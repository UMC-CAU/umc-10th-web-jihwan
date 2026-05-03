import React from 'react'
import { type Cast } from '../types/movie';
import CastCard from './CastCard';

interface CastListProps {
    cast: Cast[];
}

export default function CastList({cast}: CastListProps) {
  return (
    <div>
        {/* 섹션 제목 */}
        <h3 className='w-full text-2xl font-bold mb-4'>출연진</h3>
        {/* 출연진 목록 */}
        <div className='grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-10 xl:grid-cols-10 justify-items-center' >
            {cast.map((castMember) => (
                <CastCard key={castMember.id} cast={castMember} />
            ))}
        </div>
    </div>
  )
}
