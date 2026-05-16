//모든 응답 중 401 에러가 발생하면 로그아웃을 실행
import axios from "axios";

// 기존에 만드신 axiosInstance를 가져옵니다.
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/v1",
  withCredentials: true, // 쿠키(리프레시 토큰) 전송을 위해 필요
});

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ 401 에러(인증 만료)가 발생했고, 재발급 시도조차 실패했을 때
    if (error.response?.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      
      // 1. 로컬 스토리지 등에 저장된 토큰 삭제
      localStorage.removeItem("accessToken"); 
      
      // 2. 로그인 페이지로 강제 이동 (주소창을 직접 변경하여 상태 초기화)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);