// MoviePage.tsx
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { type Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';

export default function MoviePage() {
    // 상태 관리: 서버에서 받아온 영화 목록을 저장할 공간
    // 초기값은 빈 배열로 설정해서 영화 데이터가 없을 때도 컴포넌트가 정상적으로 렌더링되도록 함
    const [movies, setMovies] = useState<Movie[]>([]);


    useEffect(():void => {
        // 비동기 함수 정의: 외부 API(영화 데이터)를 서버에서 받아오는 함수
        const fetchMovies = async () : Promise<void> => {
            // axios를 사용해서 TMDB API로부터 인기 영화 데이터를 받아옴
            const {data} = await axios(
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
            {
                headers: {
                    // TMDB API 키를 환경 변수에서 가져와서 Authorization 헤더에 Bearer 토큰 형식으로 설정
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                }
            }
        );

        // 받아온 데이터에서 results 배열만 추출해서 movies 상태에 저장
        setMovies(data.results);
        };
        fetchMovies();
    }, []);


    return <div className='grid grid-cols-2 sm:grid-cols-3 
    md:grid-cols-4 lg:grid-cols-5 gap-4 py-10'>
        {/* movies 배열을 순회하면서 각 영화 데이터를 MovieCard 컴포넌트에 전달해서 렌더링 */}
        {movies.map((movie) =>(
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>;
}
