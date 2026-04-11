// MoviePage.tsx
import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useParams } from 'react-router-dom';
import { useMovieList } from '../hooks/useMovieList';
import { type Movie } from '../types/movie';

export default function MoviePage() {
    // 페이지
    const [page, setPage] = useState(1);

    // URL 파라미터에서 category 값을 추출해서 category 변수에 저장
    const {category = 'popular'} = useParams<{
    category: string
    }>();

    const {movies, isLoading, error} = useMovieList(category, page);

    if (error){
        return <div className ='text-red-500 text-2xl'>에러가 발생했습니다</div>
    };



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
    {isLoading &&(
        <div className='flex items-center justify-center h-dvh'>
            <LoadingSpinner/>
        </div>
    )}

    {/*  로딩이 끝나고 영화 데이터가 있을 때 영화 카드들을 그리드 형태로 보여준다 */}
    {!isLoading && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-10'>
        {/* movies 배열을 순회하면서 각 영화 데이터를 MovieCard 컴포넌트에 전달해서 렌더링 */}
        {movies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
        </div>
    )}
    </>
    );
}

