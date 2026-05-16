// src/hooks/queries/useLpMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

export const useLpMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. 🗑️ LP판 삭제 Mutation
  const deleteLpMutation = useMutation({
    mutationFn: async (lpid: string) => {
      const response = await axiosInstance.delete(`/v1/lps/${lpid}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: () => {
      alert("LP판이 정상적으로 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/");
    },
    onError: (error: any) => {
      alert(`삭제 실패: ${error.response?.data?.message || error.message}`);
    }
  });

  // 2. ❤️ 좋아요 토글 Mutation (🚀 TypeScript 'never' 에러 완벽 파괴)
  const toggleLikeMutation = useMutation({
    mutationFn: async (lpid: string) => {
      const response = await axiosInstance.post(`/v1/lps/${lpid}/likes`, {}, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onMutate: async (lpid: string) => {
      const detailQueryKey = ["lpDetail", lpid];

      await queryClient.cancelQueries({ queryKey: detailQueryKey });

      const previousLpDetail = queryClient.getQueryData<any>(detailQueryKey);

      queryClient.setQueryData<any>(detailQueryKey, (old: any) => {
        if (!old) return old;

        const currentLikes = old.data?.likes || [];
        const hasLiked = currentLikes.includes("mock-user-id");

        // 명확하게 string[] 배열임을 보장하여 타입 에러 해결
        const newLikes: string[] = hasLiked
          ? currentLikes.filter((id: string) => id !== "mock-user-id")
          : [...currentLikes, "mock-user-id"];

        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes
          }
        };
      });

      return { previousLpDetail, detailQueryKey };
    },
    onError: (err, lpid, context) => {
      if (context?.previousLpDetail) {
        queryClient.setQueryData(context.detailQueryKey, context.previousLpDetail);
      }
    },
    onSettled: (_, __, lpid, context) => {
      queryClient.invalidateQueries({ queryKey: context?.detailQueryKey });
      queryClient.invalidateQueries({ queryKey: ["lps"] });
    }
  });

  return {
    deleteLp: deleteLpMutation.mutate,
    isDeleting: deleteLpMutation.isPending,
    toggleLike: toggleLikeMutation.mutate,
  };
};