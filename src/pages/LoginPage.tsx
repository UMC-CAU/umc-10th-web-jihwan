import { validateSignIn, type UserSignInformation } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation 추가
import { useEffect } from "react";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 위치 정보 가져오기

  // ✅ 1. 이전 페이지 정보(from) 추출 (없으면 홈으로)
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // 이미 로그인된 상태라면 가려던 곳(from)으로 보냄
    if (accessToken) {
      navigate(from, { replace: true });
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
      // ✅ 2. 로그인 함수 실행 후, accessToken이 업데이트되면 useEffect가 감지하여 'from'으로 이동시킵니다.
      // 만약 AuthContext에서 직접 window.location.href를 쓰고 있다면 navigate가 안 먹힐 수 있으니 
      // Context 쪽의 이동 코드를 확인해보세요!
    } catch (error) {
      console.error(error);
    }
  };

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