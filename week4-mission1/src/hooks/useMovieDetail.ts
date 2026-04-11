// useMoviedetail 훅은 영화 상세 정보를 받아오는 커스텀 훅이다. movieId를 인자로 받아서 해당 영화의 상세 정보와 출연진 정보를 반환한다.
import { useCustomFetch } from './useCustomFetch';
import { getMovieFullDetail } from '../apis/movieApi';
import { type MovieDetail, type Cast } from '../types/movie';

export const useMoviedetail = (movieId: string) => {
    // useCustomFetch 훅을 사용해서 영화 상세 정보와 출연진 정보를 받아온다
    const {data, isLoading, error} = useCustomFetch(
        async () => {
            if (!movieId) {
                throw new Error("유효한 영화 ID가 없습니다");
            }
            return await getMovieFullDetail(movieId);
        },[movieId] // movieId가 변경될 때마다 데이터를 다시 받아오도록 의존성 배열에 추가
    );

    //받아온 data 객체 안의 detail과 cast를 꺼내서 반환한다
    // data가 null인 경우를 대비해서 optional chaining을 사용한다
    return {
        movie: data?.movieDetail,
        cast: data?.movieCredits || [],
        isLoading,
        error
    };
};