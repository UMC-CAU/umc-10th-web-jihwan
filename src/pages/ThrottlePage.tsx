import { useEffect, useState } from "react";
import useThrottle from "../hooks/queries/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 200); // 200ms 간격으로 스크롤 이벤트 처리

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <div>
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY : {scrollY}px</p>
      </div>
    </div>
  );
};

export default ThrottlePage;