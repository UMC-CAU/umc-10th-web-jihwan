// src/components/commentSection.tsx
// LP 상세 페이지 내에서 댓글 목록을 보여주고, 댓글 작성/수정/삭제 기능을 담당하는 컴포넌트
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

interface CommentSectionProps {
  lpid: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

const CommentSection = ({ lpid }: CommentSectionProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["comments", lpid];

  // UI 상태 관리
  const [commentInput, setCommentInput] = useState("");
  const [order, setOrder] = useState<"latest" | "old">("latest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. 댓글 목록 조회 
  // 서버의 느린 DB 반영 속도 때문에 화면이 롤백되는 현상을 원천 차단하기 위해,
  // refetchOnWindowFocus와 refetchOnMount 옵션을 모두 false로 설정하여 
  // 다른 탭에 갔다 와도, 컴포넌트가 다시 마운트되어도 백엔드 서버를 다시 찌르지 않도록 한다.
  const { data: rawData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/lps/${lpid}/comments`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    //  다른 탭에 갔다 와도 백엔드 서버를 다시 찌르지 않게 하기
    // 서버의 느린 DB 반영 속도 때문에 화면이 롤백되는 현상을 원천 차단
    refetchOnWindowFocus: false, 
    // 추가로 컴포넌트가 다시 마운트될 때 무조건 서버 데이터를 강제 신뢰하지 않도록 가드
    refetchOnMount: false,
  });

  // 서버 응답 데이터의 구조가 일관적이지 않을 수 있기 때문에 안전하게 댓글 배열을 추출하는 가드 함수를 만든다.
  const getSafeCommentsArray = (): Comment[] => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (typeof rawData === "object") {
      if (Array.isArray(rawData.data)) return rawData.data;
      if (rawData.data && Array.isArray(rawData.data.data)) return rawData.data.data;
      if (Array.isArray(rawData.comments)) return rawData.comments;
    }
    return [];
  };

  const safeComments = getSafeCommentsArray();

  // 2.  댓글 등록 Mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await axiosInstance.post(
        `/v1/lps/${lpid}/comments`,
        { content },
        { headers: getAuthHeaders() }
      );
      return response.data?.data || response.data;
    },
    onSuccess: (newCommentFromServer) => {
      setCommentInput("");

      // 서버 응답 규격 안전 가드
      const validatedComment: Comment = (newCommentFromServer && newCommentFromServer.id) 
        ? newCommentFromServer 
        : {
            id: `server-${Date.now()}`,
            content: commentInput,
            createdAt: new Date().toISOString(),
            user: { name: "지환" } // 실제로는 서버에서 반환된 사용자 정보로 대체되어야 하지만, 안전하게 기본값을 넣어준다.
          };

      // 서버의 느린 반영 때문에 롤백되지 않도록 조회 갱신(invalidate)을 호출하지 않고, 
      // 프론트엔드 캐시 상태를 직접 갱신하여 그대로 반영시킨다
      // validatedCommnet를 기존 댓글 목록의 맨 앞에 추가하는 형태로 캐시를 업데이트한다.
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return [validatedComment];
        if (Array.isArray(old)) return [validatedComment, ...old];
        if (old.data && Array.isArray(old.data)) return { ...old, data: [validatedComment, ...old.data] };
        if (old.data?.data && Array.isArray(old.data.data)) return { ...old, data: { ...old.data, data: [validatedComment, ...old.data.data] } };
        return [validatedComment];
      });
    },
  });

  // 3. 댓글 수정 Mutation
  // 댓글 수정 API는 엔드포인트가 일관적이지 않아서, 먼저 /v1/lps/{lpid}/comments/{commentId}로 시도하고, 
  // 실패하면 /v1/comments/{commentId}로 재시도하는 형태로 구현한다.
  const updateCommentMutation = useMutation({ 
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await axiosInstance.patch(
        `/v1/lps/${lpid}/comments/${commentId}`,
        { content },
        { headers: getAuthHeaders() }
      ).catch(() => 
        axiosInstance.patch(`/v1/comments/${commentId}`, { content }, { headers: getAuthHeaders() })
      );
      return { commentId, content };
    },
    onSuccess: ({ commentId, content }) => {
      setEditingId(null);
      setEditInput("");

      // 서버의 느린 반영 때문에 롤백되지 않도록 조회 갱신(invalidate)을 호출하지 않고,
      // 프론트엔드 캐시 상태를 직접 갱신하여 그대로 반영시킨다
      // commentId에 해당하는 댓글의 content만 업데이트하는 형태로 캐시를 업데이트한다.
      queryClient.setQueryData(queryKey, (old: any) => {
        const updateContent = (list: Comment[]) => list.map(c => c.id === commentId ? { ...c, content } : c);
        if (Array.isArray(old)) return updateContent(old); // old가 배열 형태인 경우. 왜 old가 여러 형태인가? 서버 응답이 일관적이지 않아서 여러 형태로 가드해야 한다.
        if (old?.data && Array.isArray(old.data)) return { ...old, data: updateContent(old.data) }; // old.data가 배열 형태인 경우
        if (old?.data?.data && Array.isArray(old.data.data)) return { ...old, data: { ...old.data, data: updateContent(old.data.data) } }; // old.data.data가 배열 형태인 경우
        return old;
      });
    }
  });
  // 4.  댓글 삭제 Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await axiosInstance.delete(`/v1/lps/${lpid}/comments/${commentId}`, { headers: getAuthHeaders() })
        .catch(() => axiosInstance.delete(`/v1/comments/${commentId}`, { headers: getAuthHeaders() }));
      return commentId;
    },
    onSuccess: (commentId) => {
      // 서버의 느린 반영 때문에 롤백되지 않도록 조회 갱신(invalidate)을 호출하지 않고,
      // 프론트엔드 캐시 상태를 직접 갱신하여 그대로 반영시킨다
      // commentId에 해당하는 댓글을 목록에서 제거하는 형태로 캐시를 업데이트한다.
      queryClient.setQueryData(queryKey, (old: any) => {
        const deleteItem = (list: Comment[]) => list.filter(c => c.id !== commentId);
        if (Array.isArray(old)) return deleteItem(old);
        if (old?.data && Array.isArray(old.data)) return { ...old, data: deleteItem(old.data) };
        if (old?.data?.data && Array.isArray(old.data.data)) return { ...old, data: { ...old.data, data: deleteItem(old.data.data) } };
        return old;
      });
    }
  });

  // 정렬 순서 가공
  // 댓글 목록을 최신순 또는 오래된순으로 정렬하는 로직이다.
  // createdAt을 기준으로 타임스탬프를 비교하여 정렬한다.
  const sortedComments = [...safeComments].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return order === "latest" ? timeB - timeA : timeA - timeB;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    createCommentMutation.mutate(commentInput.trim());
  };

  const handleUpdateSubmit = (commentId: string) => {
    if (!editInput.trim()) return;
    updateCommentMutation.mutate({ commentId, content: editInput.trim() });
  };

  if (isLoading && safeComments.length === 0) return <div className="text-center text-gray-400 py-4">댓글 로딩 중...</div>;

  return (
    <div className="bg-[#121314] text-white p-6 rounded-xl mt-4 max-w-3xl mx-auto shadow-xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">댓글 ({safeComments.length})</h3>
        <div className="flex bg-[#1e1f21] rounded-lg p-0.5 text-xs text-gray-400">
          <button onClick={() => setOrder("old")} className={`px-3 py-1 rounded-md cursor-pointer ${order === "old" ? "bg-white text-black font-semibold" : ""}`}>오래된순</button>
          <button onClick={() => setOrder("latest")} className={`px-3 py-1 rounded-md cursor-pointer ${order === "latest" ? "bg-white text-black font-semibold" : ""}`}>최신순</button>
        </div>
      </div>

      <form onSubmit={handleCreateSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 bg-[#1e1f21] border border-gray-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gray-600"
        />
        <button type="submit" className="bg-[#2a2b2d] hover:bg-gray-700 text-sm px-5 rounded-lg font-medium cursor-pointer">작성</button>
      </form>

      <div className="space-y-4">
        {sortedComments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-6">첫 댓글을 남겨보세요!</div>
        ) : (
          sortedComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-900 pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-9 h-9 bg-pink-600 rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                    {comment.user?.name ? comment.user.name[0] : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-300">{comment.user?.name || "익명 사용자"}</div>
                    {editingId === comment.id ? (
                      <div className="flex gap-2 mt-1.5 w-full">
                        <input
                          type="text"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="flex-1 bg-[#1e1f21] border border-pink-500 rounded-lg p-2 text-sm text-white focus:outline-none"
                        />
                        <button onClick={() => handleUpdateSubmit(comment.id)} className="bg-pink-500 hover:bg-pink-600 px-3 rounded-lg text-xs font-semibold cursor-pointer">확인</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-700 hover:bg-gray-600 px-3 rounded-lg text-xs cursor-pointer">취소</button>
                      </div>
                    ) : (
                      <div className="text-sm mt-0.5 text-gray-100 whitespace-pre-wrap">{comment.content}</div>
                    )}
                  </div>
                </div>
                {editingId !== comment.id && (
                  <div className="flex items-center gap-2 text-gray-500 ml-4">
                    <button onClick={() => { setEditingId(comment.id); setEditInput(comment.content); }} className="hover:text-white p-1 cursor-pointer text-xs">✏️</button>
                    <button onClick={() => { if(confirm("댓글을 삭제하시겠습니까?")) deleteCommentMutation.mutate(comment.id); }} className="hover:text-red-500 p-1 cursor-pointer text-xs">🗑️</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;