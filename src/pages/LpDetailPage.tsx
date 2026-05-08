import { useParams, useNavigate } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail"; // 👈 경로 확인 (Detail 전용 훅)

const LpDetailPage = () => {
  const { lpid } = useParams();
  const { data, isPending, isError } = useGetLpDetail(lpid as string);
  const navigate = useNavigate();

  if (isPending) return <div className="pt-24 text-center text-white">데이터 로딩 중...</div>;
  if (isError) return <div className="pt-24 text-center text-red-500">정보를 불러오지 못했습니다.</div>;

  const lp = data.data;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 flex justify-center relative"> 
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-28 left-10 text-white flex items-center gap-2 hover:text-pink-500 transition-colors z-10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-medium">뒤로가기</span>
      </button>

      {/* ✅ 빈 div를 삭제하고 실제 카드 하나만 남겼습니다. */}
      <div className="w-full max-w-3xl bg-[#1e1f21] rounded-2xl p-8 shadow-2xl relative self-start md:self-center"> 
        
        {/* 상단: 프로필 및 정보 */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden"></div>
            <div>
              <p className="text-white font-bold">오타니안</p>
              <p className="text-gray-400 text-xs">1일 전</p>
            </div>
          </div>
          <div className="flex space-x-3 text-gray-400">
            <button className="hover:text-white">✏️</button>
            <button className="hover:text-white">🗑️</button>
          </div>
        </div>

        {/* 중앙: LP 제목 및 썸네일 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-8">{lp.title}</h1>
          
          <div className="relative w-72 h-72 mx-auto mb-10">
            <div className="w-full h-full rounded-full border-8 border-[#2a2b2d] overflow-hidden shadow-2xl rotate-12">
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner" />
          </div>
        </div>

        {/* 하단: 본문 내용 */}
        <div className="text-gray-300 text-center text-sm leading-relaxed mb-8 px-10">
          "{lp.content}"
        </div>

        {/* 태그 리스트 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {lp.tags?.map((tag: any) => (
            <span key={tag.id} className="bg-[#2a2b2d] text-gray-400 px-3 py-1 rounded-full text-xs">
              # {tag.name}
            </span>
          ))}
        </div>

        {/* 좋아요 버튼 */}
        <div className="flex flex-col items-center">
          <button className="text-pink-500 text-2xl hover:scale-110 transition-transform">
            ❤️
          </button>
          <span className="text-white text-sm mt-1">{lp.likes?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;