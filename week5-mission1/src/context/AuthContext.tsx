// AuthContext.tsx
import type { PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import React, { useContext, useState } from "react";
import { postSignin, postLogout } from "../apis/auth";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login:(signinData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext  = React.createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider= ({ children } : PropsWithChildren) => {
    

    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenToStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenToStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken , setAccessToken] =useState<string|null>(
        getAccessTokenFromStorage(),
    );
    const [refreshToken , setRefreshToken] =useState<string|null>(
        getRefreshTokenFromStorage(),
    );

    const login = async (signinData:RequestSigninDto) => {
        try {
        const {data} = await postSignin(signinData);

        if(data) {
            const newAccessToken = data.accessToken;
            const newRefreshToken = data.refreshToken;

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            setAccessTokenToStorage(newAccessToken);
            setRefreshTokenToStorage(newRefreshToken);

            alert("로그인 성공!");
            //navigate("/mypage");
            window.location.href = "/mypage";
        }
    } catch (error) {
        console.error("로그인 실패:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 되었습니다.");
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    };
    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
}