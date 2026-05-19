// src/apis/lp.ts
// LP 관련 API 함수들을 모아둔 파일이다. LP 리스트 조회, 상세 조회, 생성, 수정, 삭제, 좋아요 토글 등의 기능을 담당한다.
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

// 3. LP 생성 
export const createLp = async (lpData: { 
  title: string; 
  content: string; 
  thumbnail: string; 
  published: boolean; 
  tags: { name: string }[]; 
}) => {
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