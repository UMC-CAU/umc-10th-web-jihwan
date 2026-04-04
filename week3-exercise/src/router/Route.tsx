// Props: path와 component를 받습니다. 
// Return: 자신이 가진 컴포넌트를 그대로 렌더링합니다.
import React from "react";


interface RouteProps {
    path: string;  // 경로 주소(예: '/home', '/about' 등)
    component: React.ComponentType; // 컴포넌트 타입
}

export const Route = ({component: Component } : RouteProps) => {
    return <Component />;
}