// axios.ts
import axios, { type InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

// 1. _retry 플래그를 위한 인터페이스 확장 (무한 루프 방지용)
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

/**
 * [요청 인터셉터]
 * 서버로 보내는 모든 요청 헤더에 최신 Access Token을 부착한다
 */
axiosInstance.interceptors.request.use((config) => {
    let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    //  저장된 토큰에 따옴표가 포함된 경우 제거
    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * [응답 인터셉터]
 * 401 Unauthorized 에러 발생 시 Refresh Token으로 재발급을 시도한다.
 */
axiosInstance.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // 에러 응답이 401(토큰 만료 등)이고, 아직 재시도를 하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지를 위해 플래그 설정

            try {
                let refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                
                // Refresh Token도 따옴표 제거 처리
                if (refreshToken && refreshToken.startsWith('"') && refreshToken.endsWith('"')) {
                    refreshToken = refreshToken.slice(1, -1);
                }

                // 1. 새로운 Access Token 발급 요청
                // 이때는 axiosInstance가 아닌 기본 axios를 써야 인터셉터 무한 루프에 안 빠짐
                const { data } = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const newAccessToken = data.accessToken;

                // 2. 새로운 토큰 저장
                localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);

                // 3. 실패했던 원래 요청의 헤더를 새 토큰으로 교체 후 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); 

            } catch (refreshError) {
                // Refresh Token마저 만료되었거나 오류가 나면 로그아웃 처리
                console.error("토큰 재발급 실패: 다시 로그인해야 합니다.");
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                
                // 사용자 경험을 위해 로그인 페이지로 강제 이동 (필요 시)
                // window.location.href = "/login";
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);