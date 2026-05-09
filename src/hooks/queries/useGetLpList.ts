import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getLpList, getLpDetail } from "../../apis/lp";
import { QUERY_KEYS } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

//  1. 무한 스크롤용 훅
export function useGetLPInfiniteList({ search, order }: { search: string; order: 'desc' | 'asc' }) {
  return useInfiniteQuery<ResponseLpListDto>({
    queryKey: [QUERY_KEYS.lps, { search, order }],
    queryFn: ({ pageParam = 0 }) => 
      getLpList({ 
        cursor: pageParam as number, 
        search, 
        order, 
        limit: 12 
      }),
    initialPageParam: 0,
    //  lastPage의 nextCursor 활용
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
}

// 2. 상세 페이지용 단건 조회 훅 
export const useGetLpDetail = (lpid: string) => {
  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid,
  });
};