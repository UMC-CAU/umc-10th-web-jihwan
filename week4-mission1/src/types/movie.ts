// Movie 타입은 TMDB API에서 영화 데이터를 받아올 때 반환되는 각 영화 객체의 타입을 정의한다.
export type Movie ={
    adult: boolean;
    backdrop_path: string; // 영화 배경 이미지 경로
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

// MovieResponse 타입은 TMDB API에서 영화 데이터를 받아올 때 반환되는 전체 응답 객체의 타입을 정의한다.
export type MovieResponse = {
    page: number;
    total_pages: number;
    total_results: number;
    results: Movie[];
}

// 상세 페이지 전용 장르 정보
export interface Genre {
    id: number;
    name: string;
}
//상세 페이지 전용 제작사 정보
export interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}
// 출연진 정보
export interface Cast{
    id: number;
    known_for_department: string;
    name: string;      // 본명
    character: string; // 극중 이름
    profile_path: string | null; // 배우 사진
}

// MovieDetail 타입(Movie 타입 상속받음)
export interface MovieDetail extends Movie {
    //시리즈물인지 확인
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string;
        backdrop_path: string;
    } | null;

  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  revenue: number;
  runtime: number; 
  status: string;
  tagline: string; 
}