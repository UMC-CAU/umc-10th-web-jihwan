import { type Movie } from '../types/movie';
import { useState } from 'react';


interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    // 상태 관리: 마우스 호버 여부를 추적해서 상세 정보를 보여줄지 결정한다
    const [isHovered, setIsHovered] = useState(false);


  return (      
    <div 
        // 카드 컨테이너 설정
        // relative: 자식 요소가 절대 위치를 가질 수 있도록 함
        // rounded-xl: 카드 모서리를 둥글게 만듦
        // shadow-lg: 카드에 그림자 효과를 줘서 입체감을 높임
        className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer
        w-44 transition-transform duration-500 hover:scale-105'
        onMouseEnter={():void => setIsHovered(true)}
        onMouseLeave={():void => setIsHovered(false)}
        >
        // 영화 포스터 이미지: TMDB API에서 제공하는 이미지 URL을 사용해서 영화 포스터를 보여준다
      <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
        alt={'${movie.title} 영화의 이미지'}
        className=''
        />
        // 마우스가 카드 위에 있을 때 상세 정보창을 띄운다
        {isHovered && (
            <div className='absolute inset-0 bg-linear-to-t from-black/50 
            to-transparent backdrop-blur-md text-white items-ceenter p-4'>
                <h2 className='text-lg font-bold text-center leading-snug'>{movie.title}</h2>
                <p className='text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5'>{movie.overview}</p>
        </div>
        )}
    </div>
  );
}