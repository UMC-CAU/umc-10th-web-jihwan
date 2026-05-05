import {useQuery} from '@tanstack/react-query';


export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    queryKey: [url],

    queryFn: async ({signal}) : Promise<T> => {
      const response = await fetch(url, {signal});

      if(!response.ok){
        throw new Error('Failed to fetch data');
      }

      return response.json() as Promise<T>;
    },

    retry:10,

    retryDelay: (attemptIndex) =>{
      return Math.min(1000*Math.pow(2,attemptIndex),30_000);
  },
  staleTime: 5 * 60 * 1000, // 5 minutes

  gcTime: 10 * 60 * 1000, // 10 minutes
  });
};