// src/pages/MyPage.tsx
// 마이 페이지 컴포넌트로, 사용자 자신의 프로필 정보를 보여주고 수정할 수 있는 페이지이다.
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

// 사용자 프로필 정보 담는 인터페이스
interface UserProfile {
  name: string;
  bio: string;
  profileImage: string;
  email: string;
}

// MyPage 컴포넌트는 useQuery를 사용하여 로그인한 사용자의 프로필 정보를 가져오고, useMutation을 사용하여 프로필 업데이트 기능을 구현한다.
const MyPage = () => {
  const queryClient = useQueryClient();
  const queryKey = ["userProfile"];

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. 내 정보 조회
  const { data: profile, isLoading } = useQuery<any>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/users/me", {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // 2. 닉네임/프로필 변경 Mutation
  // onMutate에서 낙관적 업데이트를 시도하여, 서버 응답을 기다리지 않고 즉시 UI에 변경 사항을 반영한다. 만약 서버 요청이 실패할 경우, 이전 상태로 롤백한다.
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: { name: string; bio: string; profileImage: string }) => {
      const response = await axiosInstance.patch("/v1/users", updatedData, { 
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    // 기존 데이터가 { data: { name, bio ... } } 구조인지 확인하고 안전하게 분기 맵핑
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey }); // cancelQueries로 현재 진행 중인 동일 쿼리를 취소하여 낙관적 업데이트와 충돌 방지
      const previousProfile = queryClient.getQueryData<any>(queryKey); // 현재 캐시된 프로필 데이터를 백업하여 롤백 시 사용한다.

      queryClient.setQueryData<any>(queryKey, (old) => {
        if (!old) return old;

        // 백엔드가 중첩 객체(old.data.name) 구조로 응답하는 폼인 경우
        if (old.data) {
          return {
            ...old,
            data: {
              ...old.data,
              name: newData.name,
              bio: newData.bio,
              profileImage: newData.profileImage,
            }
          };
        }
        
        // 백엔드가 최상단 플랫 구조(old.name)로 바로 응답하는 폼인 경우
        return {
          ...old,
          name: newData.name,
          bio: newData.bio,
          profileImage: newData.profileImage,
        };
      });

      return { previousProfile };
    },
    // 통신 에러 발생 시 원인 분석 로그를 띄우고 이전 상태로 복구
    onError: (err: any, newData, context) => {
      console.error("프로필 수정 요청 실패 원인:", err.response?.data || err.message);
      alert(`수정 실패: ${err.response?.data?.message || "서버 통신에 오류가 발생했습니다."}`);
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile); // 롤백: 이전 프로필 데이터로 복구하여 UI 일관성 유지
      }
    },
    // 성공/실패 무관 최종 싱크 가동
    // onSettled에서는 서버에서 최신 데이터를 다시 가져와서 캐시를 업데이트한다. 
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => { // 성공 시 사용자에게 알림을 띄우고 편집 모드를 종료한다.
      setIsEditing(false);
      alert("프로필이 성공적으로 변경되었습니다!");
    }
  });

  // 파일 입력 핸들러로, 사용자가 새 프로필 이미지를 선택하면 FileReader를 사용하여 이미지 데이터를 읽고, 읽기가 완료되면 profileImage 상태를 업데이트하여 미리보기로 보여준다.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditStart = () => {
    // 백엔드 구조가 { data: { ... } } 인지 플랫 구조인지 가드 판별 후 세팅
    const currentData = profile?.data ? profile.data : profile;
    setNameInput(currentData?.name || "");
    setBioInput(currentData?.bio || "");
    setProfileImage(currentData?.profileImage || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!nameInput.trim()) {
      alert("이름은 필수 항목입니다.");
      return;
    }
    updateProfileMutation.mutate({
      name: nameInput.trim(),
      bio: bioInput.trim(),
      profileImage: profileImage,
    });
  };

  if (isLoading) return <div className="pt-24 text-center text-white">프로필 로딩 중...</div>;

  // 렌더링용 유저 데이터 포인터 바인딩 가드
  const userData = profile?.data ? profile.data : profile;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 flex justify-center px-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-gray-950 text-white p-8 rounded-xl shadow-2xl h-fit">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">마이 페이지</h2>
          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)} 
              className="text-xs bg-black hover:bg-gray-900 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-900 cursor-pointer"
            >
              취소
            </button>
          )}
          {!isEditing && (
            <button onClick={handleEditStart} className="text-xs bg-[#1e1f21] hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-800 cursor-pointer">
              프로필 설정
            </button>
          )}
        </div>

        <div className="bg-black border border-gray-900 rounded-xl p-8 flex items-center gap-8 relative shadow-inner">
          <div onClick={() => isEditing && fileInputRef.current?.click()} className={`w-32 h-32 rounded-full bg-[#e0e0e0] flex items-center justify-center overflow-hidden flex-shrink-0 relative ${isEditing ? "cursor-pointer group border-2 border-pink-500" : ""}`}>
            {profileImage || userData?.profileImage ? (
              <img src={profileImage || userData?.profileImage} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-20 h-20 text-gray-400 mt-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="flex-1 space-y-3.5">
            {isEditing ? (
              <div className="space-y-2.5 w-full pr-16">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="이름을 입력해주세요" className="w-full bg-black border border-gray-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
                <input type="text" value={bioInput} onChange={(e) => setBioInput(e.target.value)} placeholder="Bio를 입력해주세요 (선택)" className="w-full bg-black border border-gray-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors" />
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-100 mb-1">{userData?.name || "지환"}</h3>
                <p className="text-sm text-gray-400 font-medium">{userData?.bio || "소개를 입력해주세요"}</p>
              </div>
            )}
            <div className="text-sm text-gray-300 font-normal pt-1">{userData?.email || "jyj0719@gmail.com"}</div>
          </div>

          {isEditing && (
            <button 
              type="button"
              onClick={handleSave} 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-400 font-bold text-lg bg-[#1e1f21] hover:bg-gray-800 border border-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="저장하기"
            >
              ✔
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;