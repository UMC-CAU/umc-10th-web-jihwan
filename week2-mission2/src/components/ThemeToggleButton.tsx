// 사용자가 클릭해서 테마를 바꿀 수 있는 버튼 컴포넌트

import { THEME, useTheme } from '../context/ThemeProvider'
import clsx from 'clsx';

export default function ThemeToggleButton() {
    const {theme, toggleTheme} = useTheme();

    const  isLightMode = theme === THEME.LIGHT;

  return (
    <button 
    onClick={toggleTheme}
    className={clsx('px-4 py-2 mt-4 rounded-md transition-all', {
        'bg-black text-white': !isLightMode,
        'bg-white text-black': isLightMode,
    })}
    >
        {isLightMode ? '다크 모드' : '라이트 모드'}
    </button>
  )
}
