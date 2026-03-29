// Navbar, ThemeContent, ThemeToggleButton 을 한데 모아서 배치하는 메인 페이지

import Navbar from './Navbar';
import ThemeContent from './ThemeContent';
import { ThemeProvider } from '../context/ThemeProvider';


export default function ContexPage() {
  return (
    <ThemeProvider>
        <div className = 'flex flex-col items-center justify-center min-h-screen'>
        <Navbar/>
        <main className='flex-1 w-full'>
            <ThemeContent />
        </main>
        </div>
    </ThemeProvider>
  );
}
