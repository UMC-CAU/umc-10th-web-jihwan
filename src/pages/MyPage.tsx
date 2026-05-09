import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth.ts";
import { type ResponseMyInfoDto } from "../types/auth.ts"; // 타입 import 확인

const MyPage = () => {
    // 1. 초기값을 null로 설정하고 타입을 명시합니다. 
    // ResponseMyInfoDto["data"]는 서버 응답 중 실제 데이터 객체의 모양을 가져옵니다.
    const [data, setData] = useState<ResponseMyInfoDto["data"] | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response: ResponseMyInfoDto = await getMyInfo();
                console.log("내 정보 조회 성공:", response);

                // 서버 응답 구조가 response.data 안에 실제 정보가 있다면 아래와 같이 저장합니다.
                setData(response.data);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };

        getData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        // 로그아웃 후 페이지를 새로고침하여 상태 초기화
        window.location.reload();
        // 메인 페이지로 리디렉션
        window.location.href = "/";
    }

    return (
        <div className="p-4">
            {/* 2. 옵셔널 체이닝(?.)을 사용해 데이터가 로드된 후에만 화면에 출력합니다. */}
            {data ? (
                <div>
                    <p>이름: {data.name}</p>
                    <p>이메일: {data.email}</p>
                    <button onClick={handleLogout} className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90">로그아웃</button>
                </div>
            ) : (
                <p>데이터를 불러오는 중입니다...</p>
            )}
        </div>
    );
};

export default MyPage;