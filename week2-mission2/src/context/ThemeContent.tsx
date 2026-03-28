import clsx from "clsx";
import {THEME, useTheme} from './ThemeProvider'

export default function ThemeContent() {
  const {theme, toggleTheme} = useTheme();
  
  const  isLightMode = theme === THEME.LIGHT;
  return (
    <div
      className={clsx(
        'p-4 h-dvh w-full',
        isLightMode ?  'bg-white' : 'bg-gray-800'
      )}
    >
        <h1 className={clsx(
          'text-wxl font-bold',
          isLightMode ? 'text-black' : 'text-white'
        )}
        >
          theme content
        </h1>
        <p className= {clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
        동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 
        </p>
    </div>
  )
}
