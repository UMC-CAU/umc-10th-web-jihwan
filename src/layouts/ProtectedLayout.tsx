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