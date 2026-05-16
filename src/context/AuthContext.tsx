import type { PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import React, { useContext, useState } from "react";
import { postSignin, postLogout } from "../apis/auth";

// 1. 유저 정보의 타입을 정의합니다.
interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null; //  1. 인터페이스에 추가
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. 초기값 설정 (인터페이스와 형식을 맞춰야 함)
export const AuthContext = React.createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null, //  2. 초기값 추가
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
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

  // 3. 유저 정보를 저장할 로컬스토리지와 상태(state) 추가
  const {
    getItem: getUserFromStorage,
    setItem: setUserToStorage,
    removeItem: removeUserFromStorage,
  } = useLocalStorage("user");

  const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
  
  //  4. 유저 상태값 (새로고침 시에도 유지되도록 스토리지에서 가져옴)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = getUserFromStorage();
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const userData = { id: data.id, name: data.name };

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUser(userData); //  5. 로그인 성공 시 유저 상태 저장

        setAccessTokenToStorage(data.accessToken);
        setRefreshTokenToStorage(data.refreshToken);
        setUserToStorage(JSON.stringify(userData)); //  6. 스토리지에도 저장

        alert("로그인 성공!");
        //window.location.href = "/mypage";
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
      removeUserFromStorage(); //  7. 로그아웃 시 유저 정보 삭제

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null); //  8. 유저 상태 초기화

      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    //  9. Provider의 value에 user를 포함
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};