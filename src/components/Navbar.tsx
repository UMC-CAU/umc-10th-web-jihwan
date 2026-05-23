// src/components/Navbar.tsx
// 네비게이션 바 컴포넌트로, 사이트의 상단에 고정되어 사용자 인증 상태에 따라 다른 메뉴를 보여준다.
// 모바일에서는 햄버거 메뉴로 사이드바를 열어 추가 메뉴를 제공한다. 로그아웃 시에는 토큰 삭제, 캐시 초기화, 리다이렉트 등의 안전한 세션 종료 처리를 수행한다.
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { useAuth } from "../context/AuthContext";
import hamburgerIcon from "../assets/hamburger-button.svg";

const Navbar = () => {
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient(); 
  
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
      // TanStackQuery가 관리하는 메모리 캐시를 완전히 초기화해서 메모리가 남지 않게 한다.
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
      {/* 고정 상단바 구역 */}
      <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
        <div className="flex items-center justify-between p-4">
          
          <div className="flex items-center space-x-4">
            <button 
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-gray-850 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-white">
                <span className="text-xl font-bold">☰</span> 
              </button>

            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              SpinningSpinning Dolimpan
            </Link>
          </div>

          {/* 우측 공통 메뉴 링크 구역 */}
          <div className="flex items-center space-x-6">
            <Link to={"/search"} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">검색</Link>
            {accessToken && (
              <button type="button" onClick={onLogoutClick} className="text-gray-700 dark:text-gray-300 hover:text-red-500 cursor-pointer">
                로그아웃
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 🚀 좌측 고정형 사이드바 (isSidebarOpen 상태에 따라 너비가 0초 만에 완벽 토글 제어됨) */}
      <aside 
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#0a0a0a] border-r border-gray-900 shadow-2xl transition-all duration-350 ease-in-out z-40 overflow-hidden"
        style={{ width: isSidebarOpen ? "0px" : "240px" }} // 💡 true일 때 완전히 닫히도록(0px) 설정
      >
        <div className="p-6 flex flex-col space-y-5 w-56 text-gray-300">
          <Link to="/" className="text-base hover:text-pink-500 transition-colors">🏠 찾기</Link>
          <Link to="/mypage" className="text-base hover:text-pink-500 transition-colors">👤 마이페이지</Link>
          
          <div className="pt-8 border-t border-gray-900 flex flex-col space-y-2">
            {accessToken ? (
              <button 
                type="button" 
                onClick={onLogoutClick} 
                className="text-left text-xs text-gray-500 hover:text-red-400 underline cursor-pointer"
              >
                로그아웃
              </button>
            ) : (
              <Link to="/login" className="text-sm hover:text-pink-500">로그인</Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;