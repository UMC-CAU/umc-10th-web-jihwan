import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEYS } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";
import { getLpDetail } from "../../apis/lp";

// 훅 이름을 이전 코드와 동일하게 useGetLPList로 유지합니다.
function useGetLPList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery<ResponseLpListDto>({
    // ✅ queryKey에 모든 파라미터를 객체로 묶어 넣어야 정렬/검색 시 자동 리패치가 일어납니다.
    queryKey: [QUERY_KEYS.lps, { cursor, search, order, limit }],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  });
}

export default useGetLPList;

export const useGetLpDetail = (lpid: string) => {
  return useQuery({
    queryKey: ["lp", lpid], // ✅ 미션 요구사항: 키에 lpid 포함
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid, // lpid가 있을 때만 실행
  });
};