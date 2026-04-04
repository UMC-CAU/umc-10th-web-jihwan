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


export default function MovieDetailPage() {
  // 상태 관리: 서버에서 받아온 영화 상세 정보와 출연진 정보를 저장할 공간
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);

    // URL 파라미터에서 movieId 값을 추출해서 movieId 변수에 저장
    const {movieId} = useParams<{
        movieId: string
    }>();

    useEffect(()=> {
      // 비동기 함수 정의: 외부 API(영화 상세 정보와 출연진 정보)를 서버에서 받아오는 함수
      const fetchMovieDetail = async (): Promise<void> => {
        try {
          // axios를 사용해서 TMDB API로부터 영화 상세 정보와 출연진 정보를 받아옴
          const [movieResponse, castResponse] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
        { headers: {
            // TMDB API 키를 환경 변수에서 가져와서 Authorization 헤더에 Bearer 토큰 형식으로 설정
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        } }
      ),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
        { headers: {
            // TMDB API 키를 환경 변수에서 가져와서 Authorization 헤더에 Bearer 토큰 형식으로 설정
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
        } }
      ),
      ]);
          console.log("진짜 영화 데이터:", movieResponse.data);
          console.log(movieResponse.data);
          console.log(castResponse.data);
          // 받아온 데이터에서 영화 상세 정보와 출연진 정보를 추출해서 각각 movie와 cast 상태에 저장
          setMovie(movieResponse.data);
          setCast(castResponse.data.cast);
        } catch (error) {
          console.error('영화 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
        }
      };
      fetchMovieDetail();
    }, [movieId]); // movieId 상태가 변경될 때마다 영화 상세 정보와 출연진 정보를 다시 받아오도록 함
  
    if (!movie) {
    return <LoadingSpinner/>;
    }

  return (
    <div className='bg-black min-h-screen text-white w-full'>
    <MovieHero movie={movie}/>
    <CastList cast={cast} />
    </div>
  )
}

