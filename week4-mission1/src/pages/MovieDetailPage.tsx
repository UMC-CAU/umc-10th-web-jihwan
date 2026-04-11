// MovieDetailPage 컴포넌트는 영화 상세 페이지를 나타내는 컴포넌트입니다. 
import React, { use } from 'react'
import { useParams } from 'react-router-dom';
import { type MovieDetail, type Cast } from '../types/movie';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MovieHero from '../components/MovieHero';
import CastList from '../components/CastList';
import CastCard from '../components/CastCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { type MovieResponse } from '../types/movie';
import { useMoviedetail } from '../hooks/useMovieDetail';


export default function MovieDetailPage() {

    // URL 파라미터에서 movieId 값을 추출해서 movieId 변수에 저장
    const {movieId} = useParams<{
        movieId: string
    }>();

    const {movie, cast, isLoading, error } = useMoviedetail(movieId!);

    if(isLoading || !movie) {
        return <LoadingSpinner/>
    }

    if (error) {
      return <div className='text-white'>데이터를 불러오는 데 실패했습니다</div>;
    }

  return (
    <div className='bg-black min-h-screen text-white w-full'>
    <MovieHero movie={movie}/>
    <CastList cast={cast} />
    </div>
  )
}

