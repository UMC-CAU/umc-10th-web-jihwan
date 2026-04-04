import React from 'react'
import { type MovieDetail } from '../types/movie';


interface MovieHeroProps {
    movie: MovieDetail;
}

export default function MovieHero({movie} : MovieHeroProps) {
    const backdropUrl = movie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : '';
  return (
    <div className='relative h-[400px] w-full bg-gray-800 mb-8'>
      {/* 영화 배경 이미지: TMDB API에서 제공하는 이미지 URL을 사용해서 영화 배경 이미지를 보여준다 */}
      <img
        src={backdropUrl}
        alt={`${movie?.title} 영화의 배경 이미지`}
        className='absolute inset-0 w-full h-full object-cover opacity-50'
        />
        <h1 className='relative text-4xl font-bold text-white mb-4'>
            {movie?.title}
        </h1>
        {/* // 영화 개요: 영화의 줄거리나 설명을 보여준다 */}
        <p className='relative text-lg text-gray-200 max-w-3xl'>
            {movie?.overview}
        </p>
    </div>
  )
}
