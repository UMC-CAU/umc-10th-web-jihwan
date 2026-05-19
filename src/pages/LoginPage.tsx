// src/pages/LoginPage.tsx
// 로그인 페이지 컴포넌트로, 이메일과 비밀번호 입력 폼을 제공한다. 입력값 검증과 로그인 API 요청을 처리하며, 로그인 성공 시 원래 접근하려던 페이지로 리다이렉트 시킨다.
import { validateSignIn, type UserSignInformation } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { useEffect } from "react";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); //  현재 위치 정보 가져오기

  // 1. 이전 페이지 정보(from) 추출 (없으면 홈으로)
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // 이미 로그인된 상태라면 가려던 곳(from)으로 보냄
    if (accessToken) {
      navigate(from, { replace: true }); // replace: true 옵션은 로그인 페이지를 히스토리에서 제거하여 뒤로 가기 시 로그인 페이지로 돌아가지 않도록 한다.
    }
  }, [navigate, accessToken, from]);

  const { values, errors, touched, getInputProps } = useForm<UserSignInformation>({
    defaultValues: {
      email: "",
      password: "",
    },
    validate: validateSignIn,
  });

  const handleSubmit = async () => {
    try {
      await login(values);
      //  2. 로그인 함수 실행 후, accessToken이 업데이트되면 useEffect가 감지하여 'from'으로 이동
    } catch (error) {
      console.error(error);
    }
  };

  // 3. 입력값 검증: 에러가 있거나 빈 값이 있으면 로그인 버튼 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4 pt-20'>
      <div className='flex flex-col gap-3 w-80'>
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] p-2 focus:border-[#807bff] rounded-sm ${
            errors?.email && touched?.email ? "border-red-500 bg-red-100" : "border-gray-300"
          }`}
          type={'email'}
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] p-2 focus:border-[#807bff] rounded-sm ${
            errors?.password && touched?.password ? "border-red-500 bg-red-100" : "border-gray-300"
          }`}
          type={'password'}
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type='button'
          onClick={handleSubmit}
          disabled={isDisabled}
          className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed'
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;