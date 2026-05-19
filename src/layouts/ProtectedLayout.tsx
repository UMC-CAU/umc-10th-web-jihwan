// src/layouts/ProtectedLayout.tsx
// 인증이 필요한 페이지들을 감싸는 레이아웃 컴포넌트로, 로그인 여부를 확인하여 접근을 제어한다.
// 로그인하지 않은 사용자가 접근하려고 하면 로그인 페이지로 리다이렉트 시키며, 로그인 후에는 원래 접근하려던 페이지로 돌아갈 수 있도록 state에 경로 정보를 전달한다.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
    }
  }, [accessToken]);

  if (!accessToken) {
    //  state에 현재 위치(from)를 담아서 로그인 페이지로 보냅니다.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedLayout;