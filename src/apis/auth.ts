// auth.ts
// 서비스의 핵심인 회원가입, 로그인, 로그아웃, 내 정보 조회 API 함수들을 모아둔 파일
import type {
    RequestSigninDto,
    RequestSignupDto,
    ResponseSigninDto,
    ResponseSignupDto,
} from "../types/auth";
import {axiosInstance }from "./axios";
import { type ResponseMyInfoDto } from "../types/auth";

// 커스텀 정의한 axiosInstance를 이용해 /v1/auth/signup, /v1/auth/signin, /v1/users/me, /v1/auth/logout 
// 엔드포인트와 통신하는  비동기 API 함수들이다. 

// 입력 타입, 출력 타입, 비동기 제어, 구조분해할당 규격화해서 API 요청을 명확하게 정의한다.

// 회원가입 API 함수. 사용자가 입력한 회원가입 정보를 서버에 보내고, 성공 시 가입 완료 메시지와 함께 새로 생성된 사용자 정보를 받아온다.
export const postSignup = async ( // 네트워크 요청처럼 무거운 작업은 비동기로 처리해야 한다. async가 붙은 함수는 항상 Promise를 반환한다.
    body: RequestSignupDto,  // 회원가입에 필요한 정보를 담은 객체를 매개변수로 받는다.
): Promise<ResponseSignupDto> => {   // 함수가 return할 데이터를 명시적으로 지정. ResponseSignupDto는 CommonResponse<{ id, name, email, bio, avatar, createAt, updateAt }> 형태
    // axiosInstance.post 메서드를 통해 /v1/auth/signup 엔드포인트로 유저 정보(body)를 담은 POST요청을 보낸다.  await 키워드로 비동기 요청이 완료될 때까지 기다린다.
    const { data } = await axiosInstance.post("/v1/auth/signup", body);

    return data; // 서버로부터 받은 응답 데이터 중 data 반환
};
// 로그인 API 함수. 사용자 인증 정보를 서버에 보내고, 성공 시 토큰과 사용자 정보를 받아온다.
export const postSignin = async (
    body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);

    return data;
};

// 내 정보 조회 API 함수. 로그인한 사용자의 프로필 정보를 가져오는 데 사용된다.
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get("/v1/users/me");

    return data;
}
// 로그아웃 API 함수. 서버에 로그아웃 요청을 보내고, 성공 시 클라이언트 측에서 토큰을 제거하는 등의 후속 처리를 할 수 있다.
export const postLogout = async ()=> {
    const {data} =  await axiosInstance.post("/v1/auth/logout");

    return data;
}