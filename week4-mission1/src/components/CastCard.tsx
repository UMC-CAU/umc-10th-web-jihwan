// CastCard 컴포넌트는 영화의 출연진 정보를 표시하는 카드 컴포넌트입니다.
import { type Cast } from '../types/movie';

interface CastCardProps {
    cast : Cast;
}

export default function CastCard({cast}: CastCardProps) {
    //TMDB API에서 제공하는 이미지 URL을 사용해서 출연진의 프로필 이미지를 보여준다. 만약 프로필 이미지가 없는 경우에는 빈 문자열을 사용한다.
    const profileUrl = cast.profile_path 
    ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` 
    : '';
  return (
    <div className='flex flex-col items-center w-24 text-center shrink-0'>
        <div className='w-20 h-20 rounded-full overflow-hidden mb-2'>
            <img
                src={profileUrl}
                alt={cast.name}
                className='w-full h-full object-cover'
                />
        </div>
        {/* 이름과 배역 */}
        <p className='text-sm font-semibold'>{cast.name}</p>
        <p className='text-xs text-gray-500'>{cast.character}</p>
    </div>
  )
}
