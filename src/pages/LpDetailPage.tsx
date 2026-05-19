// src/pages/LpDetailPage.tsx
// LP 상세 페이지 컴포넌트로, 선택된 LP의 상세 정보를 보여준다. 좋아요 기능과 댓글 섹션도 포함한다.
// 좋아요 버튼은 클릭 시 즉시 UI에 반영되도록 낙관적 업데이트 방식으로 구현되어 있으며, 댓글 섹션은 별도의 컴포넌트로 분리하여 관리한다.
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail"; 
import { useLpMutation } from "../hooks/queries/useLpMutation";
import CommentSection from "../components/commentSection";

const LpDetailPage = () => {
  const { lpid } = useParams();
  const { data, isPending, isError } = useGetLpDetail(lpid as string);
  const navigate = useNavigate();
  const { deleteLp, isDeleting, toggleLike } = useLpMutation(); 

  //  실시간 하트 개수 및 활성화 상태 강제 동기화용 로컬 상태
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // 서버에서 상세 데이터를 로드해 오면 로컬 상태에 동기화
  useEffect(() => {
    if (data?.data) {
      const serverLikes = data.data.likes || [];
      setLikesCount(serverLikes.length);
      setIsLiked(serverLikes.includes("mock-user-id")); // 임시 유저 확인
    }
  }, [data]);

  if (isPending) return <div className="pt-24 text-center text-white">데이터 로딩 중...</div>;
  if (isError) return <div className="pt-24 text-center text-red-500">정보를 불러오지 못했습니다.</div>;

  const lp = data.data;

  const handleDelete = () => {
    if (window.confirm("정말 이 LP를 삭제하시겠습니까?")){
      deleteLp(lpid as string);
    }
  };

  //  하트 클릭 시 브라우저 새로고침을 막고 화면 상태를 즉시 변조하는 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 이벤트 전파 전면 차단, 좋아요 버튼이 다른 클릭 이벤트(예: 카드 클릭)와 겹칠 때 충돌 방지
    
    // 1. 화면의 숫자와 하트 상태를 딜레이 없이 즉시 즉각 변경 (낙관적 UI 연출)
    if (isLiked) { // 이미 좋아요가 눌린 상태라면 클릭 시 좋아요 취소로 간주하여 숫자를 감소시키고 하트 색상을 비활성화한다.
      setLikesCount((prev) => Math.max(0, prev - 1));
      setIsLiked(false);
    } else { // 좋아요가 눌리지 않은 상태라면 클릭 시 좋아요로 간주하여 숫자를 증가시키고 하트 색상을 활성화한다.
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    }

    // 2. 백엔드 통신 Mutation 실행
    toggleLike(lpid as string);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 flex flex-col items-center relative px-4"> 
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-15 left-10 text-white flex items-center gap-2 hover:text-pink-500 transition-colors z-10 cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-medium">뒤로가기</span>
      </button>

      {/* LP 상세 카드 정보 영역 */}
      <div className="w-full max-w-3xl bg-[#1e1f21] rounded-2xl p-8 shadow-2xl relative mb-6"> 
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden"></div>
            <div>
              <p className="text-white font-bold">지환</p>
              <p className="text-gray-400 text-xs">1일 전</p>
            </div>
          </div>
          <div className="flex space-x-3 text-gray-400">
            <button onClick={() => navigate(`/lp/${lpid}/edit`)} className="hover:text-white cursor-pointer">✏️</button>
            <button onClick={handleDelete} disabled={isDeleting} className="hover:text-red-500 disabled:opacity-50 cursor-pointer">
              {isDeleting ? "..." : "🗑️"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-8">{lp.title}</h1>
          <div className="relative w-72 h-72 mx-auto mb-10">
            <div className="w-full h-full rounded-full border-8 border-[#2a2b2d] overflow-hidden shadow-2xl rotate-12">
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner" />
          </div>
        </div>

        <div className="text-gray-300 text-center text-sm leading-relaxed mb-8 px-10">
          "{lp.content}"
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {lp.tags?.map((tag: any) => (
            <span key={tag.id} className="bg-[#2a2b2d] text-gray-400 px-3 py-1 rounded-full text-xs">
              # {tag.name}
            </span>
          ))}
        </div>

        {/*  좋아요 버튼 구역 */}
        <div className="flex flex-col items-center">
          <button 
            type="button"
            onClick={handleLikeClick}
            className={`text-2xl hover:scale-110 transition-transform cursor-pointer select-none ${isLiked ? "opacity-100" : "opacity-60"}`}
          >
            ❤️
          </button>
          {/*  로컬 상태값인 likesCount를 바라보게 하여 무조건 실시간으로 숫자가 촥촥 바뀝니다! */}
          <span className="text-white text-sm mt-1">{likesCount}</span>
        </div>
      </div>

      {/* 댓글 섹션 컴포넌트 배치 */}
      <div className="w-full max-w-3xl">
        <CommentSection lpid={lpid as string} />
      </div>
    </div>
  );
};

export default LpDetailPage;