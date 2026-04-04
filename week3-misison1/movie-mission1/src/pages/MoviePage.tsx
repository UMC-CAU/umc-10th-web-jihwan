// MoviePage.tsx
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { type Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);


    useEffect(():void => {
        const fetchMovies = async () : Promise<void> => {
            const {data} = await axios(
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                }
            }
        );


        setMovies(data.results);
        };
        fetchMovies();
    }, []);


    return <div className='grid grid-cols-2 sm:grid-cols-3 
    md:grid-cols-4 lg:grid-cols-5 gap-4 py-10'>
        {movies.map((movie) =>(
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>;
}
