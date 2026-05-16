// src/apis/lp.ts
import type { PaginationDto } from "../types/common.ts";
import { axiosInstance } from "./axios.ts";
import type { ResponseLpListDto } from "../types/lp.ts";

// 1. LP 리스트 조회
export const getLpList = async (
  paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("http://localhost:8000/v1/lps", {
    params: paginationDto,
  });
  return data;
};

// 2. LP 상세 조회
export const getLpDetail = async (lpid: string) => {
  const { data } = await axiosInstance.get(`http://localhost:8000/v1/lps/${lpid}`);
  return data;
};

// 3. LP 생성 (✨ 이 부분을 깔끔하게 단일 파라미터 전달로 고정합니다)
export const createLp = async (lpData: { 
  title: string; 
  content: string; 
  thumbnail: string; 
  published: boolean; 
  tags: { name: string }[]; 
}) => {
  // ✅ 삼항 연산자 오타를 지우고, 아래와 같이 깨끗하게 주소 하나만 딱 적어줍니다.
  const response = await axiosInstance.post("http://localhost:8000/v1/lps", lpData);
  return response.data;
};

// 4. LP 수정
export const updateLp = async ({ 
  lpid, 
  lpData 
}: { 
  lpid: string; 
  lpData: { title: string; content: string; thumbnail: string; tags: { name: string }[] } 
}) => {
  const response = await axiosInstance.patch(`http://localhost:8000/v1/lps/${lpid}`, lpData);
  return response.data;
};

// 5. LP 삭제
export const deleteLp = async (lpid: string) => {
  const response = await axiosInstance.delete(`http://localhost:8000/v1/lps/${lpid}`);
  return response.data;
};

// 6. 좋아요 토글
export const toggleLpLike = async (lpid: string) => {
  const response = await axiosInstance.post(`http://localhost:8000/v1/lps/${lpid}/likes`);
  return response.data;
};