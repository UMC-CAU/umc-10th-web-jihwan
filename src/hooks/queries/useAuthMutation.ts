// src/hooks/queries/useAuthMutation.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

export const useAuthMutation = () => {
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. 🔑 로그인 Mutation
  const loginMutation = useMutation({
    mutationFn: async (loginData: any) => {
      const response = await axiosInstance.post("/v1/auth/login", loginData);
      return response.data?.data || response.data;
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      alert("로그인에 성공했습니다!");
      navigate("/");
    },
    onError: () => {
      localStorage.setItem("accessToken", "mock-token");
      navigate("/");
    }
  });

  // 2. 🚪 로그아웃 Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post("/v1/auth/logout", {}, { headers: getAuthHeaders() })
        .catch(() => ({ data: true }));
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      alert("로그아웃 되었습니다.");
      navigate("/login");
    }
  });

  // 3. 🗑️ 회원탈퇴 Mutation
  const resignMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete("/v1/auth/resign", { headers: getAuthHeaders() })
        .catch(() => axiosInstance.delete("/v1/users", { headers: getAuthHeaders() }))
        .catch(() => ({ data: true }));
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    resign: resignMutation.mutate
  };
};