import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp"; 
export const useGetLpDetail = (lpid: string) => {
  return useQuery({
    //  queryKey에 lpid를 포함하여 개별 데이터를 식별
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid),
    enabled: !!lpid, // lpid가 존재할 때만 API를 호출하도록 설정
  });
};

export default useGetLpDetail;