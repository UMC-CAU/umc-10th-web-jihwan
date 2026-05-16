export const useLocalStorage = (key: string) => {
    // 1. 데이터 저장 함수
    const setItem = (value: unknown) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    // 2. 데이터 가져오기 함수
    const getItem = () => {
        try {
            const item: string | null = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.log(e);
        }
    };

    // 3. 데이터 삭제 함수 (함수 안으로 이동 완료)
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };

    // 4. 세 가지 기능을 모두 객체로 반환
    return { setItem, getItem, removeItem };
};