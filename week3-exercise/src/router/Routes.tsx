import { useMemo } from "react";
import { Children, cloneElement, type FC, type ReactNode } from "react";
import { useCurrentPath } from "./useCurrentPath.ts";
import type { RoutesProps, RouteProps } from "./types.ts";
import { Route } from "./Route";

// Routes.tsx
export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    // 1. 자식들을 배열로 만듭니다.
    const routes = Children.toArray(children) as React.ReactElement<RouteProps>[];
    
    // 2. 현재 경로와 일치하는 path를 가진 자식을 찾습니다.
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;

  // 찾은 Route의 component 속성에 담긴 컴포넌트를 직접 렌더링합니다.
  const { component: Component } = activeRoute.props as RouteProps;
  return <Component />;
};