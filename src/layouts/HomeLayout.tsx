import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthMutation } from "../hooks/queries/useAuthMutation";
import { axiosInstance } from "../apis/axios";

const HomeLayout = () => {
  const navigate = useNavigate();
  const { logout, resign } = useAuthMutation();
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);

  //  마이페이지와 동일한 캐시 키를 동기화하여 닉네임 변경 시 내비바도 즉시 반영되도록 한다
  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.get("/v1/users/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data?.data || response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity, // 불필요한 재요청 차단
  });

  const handleResignConfirm = () => {
    setIsResignModalOpen(false);
    resign();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* 사이드바 구역 */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-gray-950 flex flex-col justify-between p-6 fixed h-full z-20">
        <div className="space-y-8">
          <div onClick={() => navigate("/")} className="text-pink-500 font-bold text-lg flex items-center gap-2 cursor-pointer">
            <span>=</span>
            <span className="text-pink-600">돌려돌려LP판</span>
          </div>

          <nav className="space-y-4 text-sm text-gray-400">
            <div className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <span>🔍</span> <span>찾기</span>
            </div>
            <div onClick={() => navigate("/mypage")} className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors">
              <span>👤</span> <span>마이페이지</span>
            </div>
          </nav>
        </div>

        <button onClick={() => setIsResignModalOpen(true)} className="text-left text-xs text-gray-600 hover:text-red-400 transition-colors cursor-pointer">
          탈퇴하기
        </button>
      </aside>

      {/* 메인 콘텐츠 및 내비바 영역 */}
      <div className="flex-1 pl-64 flex flex-col">
        <header className="h-16 border-b border-gray-950 flex justify-end items-center px-8 bg-black fixed top-0 right-0 left-64 z-10">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              {/* 낙관적 업데이트 캐시와 결합되어 실시간으로 반영되는 공유 닉네임 뷰 영역 */}
              🔍 <span className="text-gray-300">{profile?.name || "지환"}님 반갑습니다.</span>
            </span>
            <button onClick={() => logout()} className="hover:text-white cursor-pointer font-medium">
              로그아웃
            </button>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* 회원탈퇴 최종 모달 */}
      {isResignModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-[#1e1f21] w-full max-w-md rounded-xl p-8 relative shadow-2xl flex flex-col items-center">
            <button onClick={() => setIsResignModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm cursor-pointer">✕</button>
            <p className="text-gray-200 text-sm font-medium mt-6 mb-8">정말 탈퇴하시겠습니까?</p>
            <div className="flex gap-4 w-full justify-center">
              <button onClick={handleResignConfirm} className="bg-[#d1d2d3] hover:bg-gray-400 text-black font-bold px-8 py-2 rounded-lg text-xs cursor-pointer">예</button>
              <button onClick={() => setIsResignModalOpen(false)} className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-2 rounded-lg text-xs cursor-pointer">아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeLayout;