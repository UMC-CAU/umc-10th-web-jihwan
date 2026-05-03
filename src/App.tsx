import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import { SignupPage } from './pages/SignupPage';
import MyPage from './pages/MyPage';
import ProtectedLayout from './layouts/ProtectedLayout';

//1.홈페이지
//2.로그인 페이지
//3.회원가입 페이지

// publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [{
    path: "/",
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [
      {index: true, element: <HomePage/>}, // 홈페이지
      {path: 'login', element: <LoginPage/>}, // 로그인페이지
      {path: 'signup', element: <SignupPage/>}, // 회원가입페이지
    ]
}];

// privateRoutes: 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [{
  path:"/",
  element: <ProtectedLayout/>,
  errorElement: <NotFoundPage/>,
  children:[
    {
      path:"mypage",
      element: <MyPage/>
    }
  ]
}];


const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);


function App() {

  return <RouterProvider router={router}/>
}

export default App
