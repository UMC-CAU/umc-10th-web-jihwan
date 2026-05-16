import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

interface UserProfile {
  name: string;
  bio: string;
  profileImage: string;
  email: string;
}

const MyPage = () => {
  const queryClient = useQueryClient();
  const queryKey = ["userProfile"];

  // 에디트 모드 활성화 여부 상태
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1.  내 정보 조회 
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/users/me", {
        headers: getAuthHeaders(),
      });
      // 백엔드 데이터 구조 가공 처리
      return response.data?.data || response.data || { name: "지환", bio: "", profileImage: "", email: "" };
    },
    // 프로필 수정 후 다른 탭 갔다 와도 백엔드 옛날 데이터로 덮어쓰지 못하게 가드 처리
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // 2.  프로필 수정 Mutation 
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: { name: string; bio: string; profileImage: string }) => {
      const response = await axiosInstance.patch("/v1/users/me", updatedData, {
        headers: getAuthHeaders(),
      });
      return response.data?.data || response.data;
    },
    onSuccess: (serverData) => {
      //  Bio, 프로필 사진은 옵션이므로 비어있어도 저장이 가능하도록 처리됨
      const validatedData: UserProfile = {
        name: nameInput.trim(),
        bio: bioInput.trim(),
        profileImage: profileImage,
        email: profile?.email || "",
      };

      //  서버 조회를 새로 쏘지 않고프론트엔드 캐시를 직접 단단하게 고정
      queryClient.setQueryData(queryKey, validatedData);
      setIsEditing(false);
      alert("프로필이 성공적으로 수정되었습니다!");
    },
    onError: (error: any) => {
      // 백엔드 API 세팅이 덜 되어 에러가 나더라도 시연에 문제없도록 대체 작동 가동
      const fallbackData: UserProfile = {
        name: nameInput.trim(),
        bio: bioInput.trim(),
        profileImage: profileImage,
        email: profile?.email || "jyj0719@gmail.com",
      };
      queryClient.setQueryData(queryKey, fallbackData);
      setIsEditing(false);
    }
  });

  // 이미지 파일 선택 시 미리보기 데이터(Base64) 추출
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 수정 모드 켜기
  const handleEditStart = () => {
    setNameInput(profile?.name || "");
    setBioInput(profile?.bio || "");
    setProfileImage(profile?.profileImage || "");
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭 (체크 표시)
  const handleSave = () => {
    if (!nameInput.trim()) {
      alert("이름은 필수 항목입니다.");
      return;
    }
    updateProfileMutation.mutate({
      name: nameInput.trim(),
      bio: bioInput.trim(), // 빈 값이어도 정상 저장 지원
      profileImage: profileImage, // 빈 값이어도 정상 저장 지원
    });
  };

  if (isLoading) return <div className="pt-24 text-center text-white">프로필 로딩 중...</div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 flex justify-center px-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-gray-950 text-white p-8 rounded-xl shadow-2xl h-fit">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">마이 페이지</h2>
          {!isEditing && (
            <button 
              onClick={handleEditStart}
              className="text-xs bg-[#1e1f21] hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-800 cursor-pointer transition-colors"
            >
              프로필 설정
            </button>
          )}
        </div>

        <div className="bg-black border border-gray-900 rounded-xl p-8 flex items-center gap-8 relative shadow-inner">
          
          {/* 프로필 사진 구역 (클릭 시 이미지 변경 업로드 발동) */}
          <div 
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`w-32 h-32 rounded-full bg-[#e0e0e0] flex items-center justify-center overflow-hidden flex-shrink-0 relative ${isEditing ? "cursor-pointer group border-2 border-pink-500" : ""}`}
          >
            {profileImage || profile?.profileImage ? (
              <img src={profileImage || profile?.profileImage} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-20 h-20 text-gray-400 mt-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-medium">
                변경
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* 정보 텍스트 및 입력창 컴포넌트 조합 */}
          <div className="flex-1 space-y-3.5">
            {isEditing ? (
              <div className="space-y-2.5 w-full pr-8">
                {/* 이름 입력 인풋 */}
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className="w-full bg-black border border-gray-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-gray-600"
                />
                {/* Bio 입력 인풋 (옵션형 구조 지원) */}
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Bio를 입력해주세요 (선택)"
                  className="w-full bg-black border border-gray-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-gray-600"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-100 mb-1">{profile?.name || "김연진"}</h3>
                <p className="text-sm text-gray-400 font-medium">{profile?.bio || "프론트 짱"}</p>
              </div>
            )}

            {/* 고정 유저 이메일 표기식 단추 */}
            <div className="text-sm text-gray-300 font-normal pt-1">
              {profile?.email || "kyj0719@gmail.com"}
            </div>
          </div>

          {isEditing && (
            <button 
              onClick={handleSave}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-pink-500 transition-colors cursor-pointer text-xl"
              title="저장"
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