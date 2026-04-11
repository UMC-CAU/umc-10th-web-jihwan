// 여러 API 요청을 하나로 묶는 로직
import axios from 'axios';

//공통 인스턴스 생성
const axiosinstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    }
});

// 영화 상세 정보와 출연진을 한 번에 가져오는 함수
export const getMovieFullDetail = async (movieId: string) => {
    const [movieDetailResponse, movieCreditsResponse] = await Promise.all([
        axiosinstance.get(`/movie/${movieId}?Language=ko-KR`),
        axiosinstance.get(`/movie/${movieId}/credits?Language=ko-KR`),  
    ]);
    return {
        movieDetail: movieDetailResponse.data,
        movieCredits: movieCreditsResponse.data.cast,
    }
}
// 영화 목록을 가져오는 함수
export const getMovieList = async (category: string, page: number) => {
    const response = await axiosinstance.get(`/movie/${category}?language=ko-KR&page=${page}`);
    return response.data.results; // 영화 배열(results)만 반환
};