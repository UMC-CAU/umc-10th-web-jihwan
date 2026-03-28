//앱 전체에 테마 theme 데이터와 그 테마를 바꾸는 함수(toggleTheme)를 만들고 관리함

import { createContext, type PropsWithChildren, useContext, useState, useEffect } from "react";

// 테마는 오직 LIGHT 와 DARK 두 가지만 존재한다
export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// enum값을 활용해 테마가 가질 수 있는 값의 범위를 제한한다.
type TTheme = THEME.LIGHT | THEME.DARK;

// context 에 올라갈 데이터(theme)와 기능(toggleTheme)이 뭔지 명시한다.
interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

// 초기값 설정
export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// 데이터를 관리하고 자식들에게 뿌려주는 핵심 로직
export const ThemeProvider = ({ children }: PropsWithChildren) => {
    // 현재 어떤 테마인지 기억하는 데이터 저장소, 기본값은 라이트 모드
    // 저장된 값이 있으면 그걸 쓰고 없으면 기본값인 LIGHT를 쓴다
  const [theme, setTheme] = useState<TTheme>(() => {
    const savedTheme = localStorage.getItem('app-theme') as TTheme;
    return savedTheme || THEME.LIGHT
  });
  
  // theme 상태가 변경될 때 로컬 스토리지 업데이트
  useEffect(()=> {
    localStorage.setItem('app-theme', theme);
  }, [theme]);


  // 현재 상태가 LIGHT면 DARK로, 반대면 반대로 바꿔주는 삼항 연산자 로직
  const toggleTheme = () => {
    setTheme((prevTheme) => 
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  // 현재 테마와 전환 함수를 하위 컴포넌트들에게 던져준다
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// 컴포넌트들이 데이터를 쉽고 안전하게 꺼내 쓸 수 있도록 만든 전용 수신기
export const useTheme = () =>{
    const context = useContext(ThemeContext);

    // ThemeProvider 밖에서 테마를 쓰려고 하면 에러를 발생시킨다.
    if(!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}