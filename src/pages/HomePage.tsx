import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer"; 
import { useGetLPInfiniteList } from "../hooks/queries/useGetLpList.ts";

//  로딩용 스켈레톤 컴포넌트
const LpCardSkeleton = () => (
  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
);

const HomePage = () => {
  const [search, setSearch] = useState<string>("");
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  // 무한 스크롤 훅 호출
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage 
  } = useGetLPInfiniteList({ search, order });

  //  무한 스크롤 트리거용 훅
  const { ref, inView } = useInView();

  //  화면 하단 도달 시 다음 페이지 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  //  데이터 평탄화 (flat)
  const allLps = data?.pages.flatMap((page) => page.data.data) || [];

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
      {/* 검색 및 정렬 영역 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <input 
          className="border p-2 rounded-md w-full md:w-64 dark:bg-gray-800 dark:text-white"
          placeholder="검색어를 입력하세요..."
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <div className="flex space-x-2">
          <button onClick={() => setOrder('desc')} className={`px-4 py-2 rounded-lg transition-colors ${order === 'desc' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>최신순</button>
          <button onClick={() => setOrder('asc')} className={`px-4 py-2 rounded-lg transition-colors ${order === 'asc' ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>오래된순</button>
        </div>
      </div>

      {/* 카드 그리드 레이아웃 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/*  초기 로딩 시 스켈레톤  */}
        {isLoading && new Array(12).fill(0).map((_, i) => <LpCardSkeleton key={i} />)}

        {/* 실제 데이터 리스트 */}
        {allLps.map((lp) => (
          <Link 
            to={`/lp/${lp.id}`} 
            key={lp.id} 
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative aspect-square">
              <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
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

        {/*  추가 데이터 로딩 시 하단 스켈레톤 (4개) */}
        {isFetchingNextPage && new Array(4).fill(0).map((_, i) => <LpCardSkeleton key={i} />)}
      </div>

      {/*  관찰 대상 (바닥) */}
      <div ref={ref} className="h-20" />
    </div>
  );
};

export default HomePage;