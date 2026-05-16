import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthMutation } from "../hooks/queries/useAuthMutation";

const HomeLayout = () => {
  const navigate = useNavigate();
  const { logout, resign } = useAuthMutation();
  
  // 탈퇴 확인 모달 상태 관리
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);

  // 탈퇴 최종 동의 완료 버튼 클릭 핸들러
  const handleResignConfirm = () => {
    setIsResignModalOpen(false);
    resign(); // '예'를 누른 경우에만 useMutation 기반 탈퇴 API 호출
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* 1. 좌측 사이드바 구역 */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-950 flex flex-col justify-between p-6 fixed h-full z-20">
        <div className="space-y-8">
          {/* 로고 영역 */}
          <div 
            onClick={() => navigate("/")} 
            className="text-pink-500 font-bold text-lg flex items-center gap-2 cursor-pointer"
          >
            <span>=</span>
            <span className="text-pink-600">돌려돌려LP판</span>
          </div>

          {/* 메뉴 스택 */}
          <nav className="space-y-4 text-sm text-gray-400">
            <div className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <span>🔍</span> <span>찾기</span>
            </div>
            <div 
              onClick={() => navigate("/mypage")} 
              className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors"
            >
              <span>👤</span> <span>마이페이지</span>
            </div>
          </nav>
        </div>

        {/* 좌측 하단 탈퇴하기 단추 */}
        <button 
          onClick={() => setIsResignModalOpen(true)}
          className="text-left text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
        >
          탈퇴하기
        </button>
      </aside>

      {/* 2. 우측 메인 콘텐츠 및 내비바 영역 */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* 상단 상단 내비게이션 바 */}
        <header className="h-16 border-b border-gray-950 flex justify-end items-center px-8 bg-black fixed top-0 right-0 left-64 z-10">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              🔍 <span className="text-gray-300">지환님 반갑습니다.</span>
            </span>
            <button 
              onClick={() => logout()} 
              className="hover:text-white cursor-pointer font-medium"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* 중첩 라우트 페이지 노출 영역 */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* 3. 회원탈퇴 최종 동의 확인 팝업 모달창 */}
      {isResignModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-[#1e1f21] w-full max-w-md rounded-xl p-8 relative shadow-2xl flex flex-col items-center">
            {/* 우측 상단 X 닫기 단추 */}
            <button 
              onClick={() => setIsResignModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* 모달 안내 문구 */}
            <p className="text-gray-200 text-sm font-medium mt-6 mb-8">
              정말 탈퇴하시겠습니까?
            </p>

            {/* 예 / 아니오 제어 액션 단추 버튼 컴포넌트 세트 */}
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={handleResignConfirm}
                className="bg-[#d1d2d3] hover:bg-gray-400 text-black font-bold px-8 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                예
              </button>
              <button 
                onClick={() => setIsResignModalOpen(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLayout;