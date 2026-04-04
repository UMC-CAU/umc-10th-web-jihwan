// MovieDetailPage 컴포넌트는 영화 상세 페이지를 나타내는 컴포넌트입니다. 
import React from 'react'
import { useParams } from 'react-router-dom';

export default function MovieDetailPage() {
    const params = useParams();
    console.log(params);
  return (
    <div>MovieDetailPage</div>
  )
}

