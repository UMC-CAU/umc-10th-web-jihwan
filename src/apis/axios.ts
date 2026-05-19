// src/apis/axios.ts
// 프로젝트의 모든 API 요청에 공통적으로 적용되는 axios 인스턴스를 정의하는 파일이다.
// 인터셉터를 활용하여 요청마다 자동으로 토큰을 첨부하고, 401 Unauthorized 응답이 왔을 때 토큰 재발급 로직을 처리한다.
import axios, { type InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

// _retry 플래그는 인터셉터 내에서 토큰 재발급 시도가 한 번만 일어나도록 제어하는 용도로 사용된다.
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000/v1",
    withCredentials: true,
});

// 요청 인터셉터
// 모든 요청에 대해 실행되며, 로컬 스토리지에서 액세스 토큰을 가져와 요청 헤더에 자동으로 첨부한다.
axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

        if (token && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
// 모든 응답에 대해 실행되며, 401 Unauthorized 에러가 발생했을 때 토큰 재발급 로직을 처리한다.
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        //  401 에러가 발생했을 때
        if (error.response?.status === 401) {
            
            // 현재 브라우저 주소가 이미 로그인 페이지라면, 어떤 API가 401을 뱉어도 알림창과 이동을 전면 차단한다. (무한 알림창 방지)
            if (window.location.pathname === "/login") {
                return Promise.reject(error);
            }

            let refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            if (refreshToken && refreshToken.startsWith('"') && refreshToken.endsWith('"')) {
                refreshToken = refreshToken.slice(1, -1);
            }

            // 리프레시 토큰이 아예 없다면 재발급 자체가 불가능하므로, 바로 로그인 페이지로 튕겨낸다. (알림창 생략으로 도돌이표 차단)
            if (!refreshToken) {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            // 1회차 재시도가 아닌 경우에만 토큰 갱신 시도
            if (!originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // 새로운 Access Token 발급 요청
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000/v1"}/v1/auth/refresh`, 
                        {}, 
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        }
                    );

                    const newAccessToken = data.accessToken;
                    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest); 

                } catch (refreshError) {
                    // Refresh Token마저 완전히 만료되어 최종 실패했을 때
                    console.error("토큰 재발급 최종 실패: 로그인 만료");
                    
                    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                    
                    // 여기서도 한 번 더 주소 검증 후 알림창 팝업
                    if (window.location.pathname !== "/login") {
                        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                        window.location.href = "/login";
                    }
                    
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);