import { useCustomFetch } from './useCustomFetch';
import { getMovieList } from '../apis/movieApi';
import { type Movie } from '../types/movie';

export const useMovieList = (category: string, page: number) => {
    const { data, isLoading, error } = useCustomFetch<Movie[]>(
        () => getMovieList(category, page),
        [category, page] // 카테고리나 페이지가 바뀌면 자동으로 다시 불러옴
    );

    return { movies: data || [], isLoading, error };
};