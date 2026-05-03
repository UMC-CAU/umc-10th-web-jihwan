// axios.ts
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { type AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    // headers: {
    //     Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
    // },
});

axiosInstance.interceptors.request.use((config) => {
    // 요청을 보낼 때마다 로컬 스토리지를 새로 읽어와서 최신 토큰을 넣음
    let token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    console.log("인터셉터에서 읽어온 키:", LOCAL_STORAGE_KEY.accessToken);
    console.log("인터셉터에서 읽어온 토큰:", token);

    if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
    }

    if (token) {
        config.headers = config.headers || {}; 
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});