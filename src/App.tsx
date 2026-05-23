import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import { SignupPage } from './pages/SignupPage';
import MyPage from './pages/MyPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LpDetailPage from './pages/LpDetailPage';
import  ThrottlePage from './pages/ThrottlePage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />, // 전체 서비스의 기본 뼈대 레이아웃
    errorElement: <NotFoundPage />,
    children: [
      // 🔓 [공개 구역] 로그인과 회원가입은 토큰이 없어도 100% 프리패스로 진입 가능합니다.
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "throttle", element: <ThrottlePage /> },

      // 🔒 [보안 구역] 홈 화면과 마이페이지, 상세 페이지를 통째로 가드 안으로 격리합니다.
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <HomePage /> }, 
          { path: "mypage", element: <MyPage /> },
          { path: "lp/:lpid", element: <LpDetailPage /> },
        ],
      },
    ],
  },
]);
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App;