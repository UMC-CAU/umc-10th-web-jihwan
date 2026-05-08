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

const publicRoutes: RouteObject[] = [{
    path: "/",
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [
      {index: true, element: <HomePage/>},
      {path: 'login', element: <LoginPage/>},
      {path: 'signup', element: <SignupPage/>},
    ]
}];

const protectedRoutes: RouteObject[] = [{
  path:"/",
  element: <ProtectedLayout/>,
  errorElement: <NotFoundPage/>,
  children:[
    { path:"mypage", element: <MyPage/> }, // ✅ 1. 여기에 쉼표(,)가 있어야 합니다!
    { path: "lp/:lpid", element: <LpDetailPage /> } // ✅ 2. 상세 페이지 보호 라우트로 이동 완료
  ]
}];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
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