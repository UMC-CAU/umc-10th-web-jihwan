// MoviePage.tsx
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { type Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function MoviePage() {
    // 상태 관리: 서버에서 받아온 영화 목록을 저장할 공간
    // 초기값은 빈 배열로 설정해서 영화 데이터가 없을 때도 컴포넌트가 정상적으로 렌더링되도록 함
    const [movies, setMovies] = useState<Movie[]>([]);
    
    // 로딩 상태 
    const [ispending, setIspending] = useState(false);
    // 에러 상태\
    const [isError, SetIsError] = useState(false);
    // 페이지
    const [page, setPage] = useState(1);

    // URL 파라미터에서 category 값을 추출해서 category 변수에 저장
    const {category} = useParams<{
    category: string
    }>();



    useEffect(():void => {
        // 비동기 함수 정의: 외부 API(영화 데이터)를 서버에서 받아오는 함수
        const fetchMovies = async () : Promise<void> => {
            setIspending(true);

            try {
                // axios를 사용해서 TMDB API로부터 인기 영화 데이터를 받아옴
            const {data} = await axios(
            `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
            {
                headers: {
                    // TMDB API 키를 환경 변수에서 가져와서 Authorization 헤더에 Bearer 토큰 형식으로 설정
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                }
            }
        );

        // 받아온 데이터에서 results 배열만 추출해서 movies 상태에 저장
        setMovies(data.results);
        setIspending(false);
            }catch {
                SetIsError(true);
            } finally {
                setIspending(false);
            }
        };
        fetchMovies();
    }, [page, category]); // page, category 상태가 변경될 때마다 영화 데이터를 다시 받아오도록 함

    if (isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다</span>
            </div>
        )
    }

    // if (ispending) {
    //     return <LoadingSpinner/>
    // }


    return (
    <>
    <div className='flex items-center justify-center gap-6 mt-5'>
        <button
        className='bg-amber-500 text-white px-4 py-2 rounded-lg shadow-mdhover:bg-amber-600 disabled:bg-gray-400
        transition-all duration-200 cursor-pointer disabled:cursor-not-allowed'
        disabled = {page ===1}
        onClick={(): void => setPage((prev): number => prev - 1 )}>
            {'<'}
        </button>
        <span>{page} 페이지</span>
        <button 
        className='bg-amber-500 text-white px-4 py-2 rounded-lg shadow-mdhover:bg-amber-600 disabled:bg-gray-400
        transition-all duration-200  cursor-pointer disabled:cursor-not-allowed'
        onClick={(): void => setPage((prev): number => prev +1)}>
            {'>'}
        </button>
    </div>
    {/* 로딩 중일 때 로딩 스피너를 보여준다 */}
    {ispending &&(
        <div className='flex items-center justify-center h-dvh'>
            <LoadingSpinner/>
        </div>
    )}

    {/*  로딩이 끝나고 영화 데이터가 있을 때 영화 카드들을 그리드 형태로 보여준다 */}
    {!ispending && (
        <div className='grid grid-cols-2 sm:grid-cols-3 
    md:grid-cols-4 lg:grid-cols-5 gap-4 py-10'>
        {/* movies 배열을 순회하면서 각 영화 데이터를 MovieCard 컴포넌트에 전달해서 렌더링 */}
        {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
    )}
    </>
    );
}
