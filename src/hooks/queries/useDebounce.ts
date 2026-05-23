//hooks/queries/useDebounce.ts
import { useEffect, useState } from "react";

function useDebounce<T>(value:T, delay: number){
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    

    // value, delay가 변경될떄마다 실행
    useEffect(() => {
        //delay(ms) 후에 실행
        const handler = setTimeout(() => setDebouncedValue(value),delay);

        // 값이 바뀔때마다 마지막에 멈춘 값만 업데이트
        return() => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;

