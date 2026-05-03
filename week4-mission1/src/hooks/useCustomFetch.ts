//미션용 error, loading 관리 커스텀 훅
// 슬도 코드 참고
// useCustomFetch 훅은 비동기 데이터를 받아오는 커스텀 훅이다
// fetchFn이라는 비동기 함수를 인자로 받아서 데이터를 받아오고, 로딩 상태와 에러 상태를 관리합니다. 
// deps라는 의존성 배열을 추가로 받아서, 해당 배열의 값이 변경될 때마다 데이터를 다시 받아오도록 합니다.

import { useEffect, useState } from "react";

export const useCustomFetch = <T>(
    fetchFn: () => Promise<T>, //인자 받고 실행하는 것 보다, 그냥 함수 자체를 받은 뒤
    deps: any[] = [] // 필요한 의존성은 호출하는 쪽에서 관리하는 걸로
  ) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await fetchFn();
          setData(result);
        } catch (e) {
          setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
  
      void fetchData();
    }, [...deps]); 
  
    return { data, isLoading, error };
  };