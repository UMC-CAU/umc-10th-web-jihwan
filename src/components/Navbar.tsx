import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 👈 추가
import { useAuth } from "../context/AuthContext";
import hamburgerIcon from "../assets/hamburger-button.svg";

const Navbar = () => {
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient(); // 👈 추가
  
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 로그아웃 Mutation 구현 (안전한 세션 파괴 및 리다이렉트)
  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      return true;
    },
    onSuccess: () => {
      // 1. 로컬스토리지 토큰 삭제
      localStorage.removeItem("accessToken");

      // 2. TanStack Query 캐시 전체 폭파 (보안 및 데이터 혼선 방지)
      queryClient.clear();

      alert("로그아웃 되었습니다.");
      
      // 3. 브라우저 세션 강제 리프레시 이동 (전역 상태 원천 초기화)
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("로그아웃 에러:", error);
      localStorage.removeItem("accessToken");
      queryClient.clear();
      window.location.href = "/login";
    }
  });

  // 로그아웃 확인 컨펌창 트리거
  const onLogoutClick = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      setIsSidebarOpen(false); // 모바일인 경우 사이드바 닫기
      handleLogout();
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-20">
        <div className="flex items-center justify-between p-4">
          
          {/* --- 왼쪽 영역: 햄버거 버튼 & 로고 --- */}
          <div className="flex items-center space-x-4">
            {/* 모바일에서만 보이는 햄버거 버튼 (md:hidden) */}
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <img src={hamburgerIcon} alt="menu" className="w-8 h-8" />
            </button>

            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              SpinningSpinning Dolimpan
            </Link>
          </div>

          {/* --- 오른쪽 영역: 데스크탑용 메뉴 (md:flex / 큰 화면에서만 보임) --- */}
          <div className="hidden md:flex items-center space-x-6">
            {!accessToken && (
              <>
                <Link to={"/login"} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                  로그인
                </Link>
                <Link to={"/signup"} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                  회원가입
                </Link>
              </>
            )}

            {accessToken && (
              <>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-blue-500">{user?.name}</span> 님 반갑습니다.
                </span>
                <Link to={"/mypage"} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                  마이페이지
                </Link>
                {/*  데스크탑 레이아웃에도 로그아웃 버튼 배치 */}
                <button 
                  onClick={onLogoutClick}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors text-left"
                >
                  로그아웃
                </button>
              </>
            )}

            <Link to={"/search"} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
              검색
            </Link>
          </div>
        </div>
      </nav>

      {/* --- 사이드바 (모바일용) --- */}
      {/* 배경 딤 처리 (어둡게 변하는 부분) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* 사이드바 본체 */}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 flex flex-col space-y-6">
          <h2 className="text-2xl font-bold dark:text-white">Menu</h2>
          <hr className="border-gray-200 dark:border-gray-700" />
          
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={toggleSidebar} className="text-lg dark:text-white">홈</Link>
            <Link to="/search" onClick={toggleSidebar} className="text-lg dark:text-white">검색</Link>
            
            {accessToken ? (
              <>
                <Link to="/mypage" onClick={toggleSidebar} className="text-lg dark:text-white">마이페이지</Link>
                
                <button 
                  onClick={onLogoutClick}
                  className="pt-4 text-left text-sm text-gray-500 dark:text-gray-400 underline hover:text-red-500 transition-colors cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleSidebar} className="text-lg dark:text-white">로그인</Link>
                <Link to="/signup" onClick={toggleSidebar} className="text-lg dark:text-white">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;