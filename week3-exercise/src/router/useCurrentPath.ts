import { useState, useEffect } from "react";

export const useCurrentPath = () => {
  // 현재 브라우저의 pathname을 초기 상태로 가집니다.
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);

    // 사용자가 뒤로가기/앞으로가기를 눌렀을 때(popstate) 상태를 업데이트합니다.
    window.addEventListener("popstate", handler);

    return () => window.removeEventListener("popstate", handler);
  }, []);

  return path;
};