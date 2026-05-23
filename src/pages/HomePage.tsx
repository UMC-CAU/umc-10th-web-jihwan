// src/pages/HomePage.tsx
// 홈 페이지 컴포넌트로, LP 카드들의 무한 스크롤 리스트를 보여준다. 검색과 정렬 기능도 제공한다.
// 각 카드 클릭 시 상세 페이지로 이동하며, 우측 하단의 플로팅 버튼을 클릭하면 LP 생성 모달이 열린다. 데이터 로딩 시에는 스켈레톤 UI를 보여준다.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer"; 
import { useGetLPInfiniteList } from "../hooks/queries/useGetLpList.ts";
import LpCreateModal from "../components/LpCreateModal.tsx";


//  로딩용 스켈레톤 컴포넌트
const LpCardSkeleton = () => (
  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
);

const HomePage = () => {
  const [search, setSearch] = useState<string>("");
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 무한 스크롤 훅 호출
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    fetchNextPage, 
    hasNextPage 
  } = useGetLPInfiniteList({ search, order });

  //  무한 스크롤 트리거용 훅
  // useInView 훅: 화면의 특정 요소가 뷰포트에 들어왔는지 감지하는 훅으로, 무한 스크롤 구현에 자주 사용된다.
  // ref: 감지할 요소에 할당하는 ref, inView: 요소가 뷰포트에 들어왔는지 여부를 나타내는 boolean 값
  const { ref, inView } = useInView();

  //  화면 하단 도달 시 다음 페이지 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {  // 요소가 뷰포트에 들어왔는지 확인, 다음 페이지가 있는지 확인, 이미 다음 페이지를 불러오는 중인지 확인
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  //  데이터 평탄화 (flat)
  //  useGetLPInfiniteList 훅에서 반환된 데이터는 페이지별로 나뉘어져 있기 때문에, 이를 하나의 배열로 평탄화하여 실제 렌더링에 사용한다.
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
      {/*  우측 하단 고정 플로팅 + 버튼 */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl transition-transform hover:scale-110 z-40 cursor-pointer"
      >
        +
      </button>

      {/*  LP 생성 모달 컴포넌트 연결 */}
      <LpCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HomePage;