import useGetLPList from "../hooks/queries/useGetLpList.ts";
import { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [search, setSearch] = useState<string>("");
  // ✅ 정렬 상태 추가 (최신순: desc, 오래된순: asc)
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const { data, isPending } = useGetLPList({
    search,
    order, // ✅ 정렬 상태 전달
    limit: 10,
    cursor: 0,
  });

  if (isPending) return <div className="pt-24 text-center">LP 목록을 불러오는 중...</div>;

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      {/* 검색 및 정렬 제어 영역 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <input 
          className="border p-2 rounded-md w-full md:w-64 dark:bg-gray-800 dark:text-white"
          placeholder="검색어를 입력하세요..."
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setOrder('desc')}
            className={`px-4 py-2 rounded-lg transition-colors ${order === 'desc' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            최신순
          </button>
          <button 
            onClick={() => setOrder('asc')}
            className={`px-4 py-2 rounded-lg transition-colors ${order === 'asc' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* ✅ 카드 그리드 레이아웃 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.data.data.map((lp) => (
          <Link 
            to={`/lp/${lp.id}`} 
            key={lp.id} 
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative aspect-square">
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
              {/* 호버 시 나타나는 상세 정보 오버레이 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <h3 className="font-bold text-lg truncate">{lp.title}</h3>
                <p className="text-sm opacity-80 mt-1 line-clamp-2">{lp.content}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs">{new Date(lp.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm font-semibold">❤️ {lp.likes.length}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;