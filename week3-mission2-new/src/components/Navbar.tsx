import { Link, NavLink } from 'react-router-dom';

const LINKS = [
    { to: '/', label: '홈'},
    { to: '/movies/popular', label: '인기'},
    { to: '/movies/now_playing', label: '상영 중'},
    { to: '/movies/top_rated', label: '평점이 높은'},
    { to: '/movies/upcoming', label: '개봉 예정'},
]

export const Navbar =() => {
    return (
        <div className='flex gap-3 p-4'>
            {LINKS.map(({to, label}) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({isActive}) => {
                        return isActive ? 'text-lg text-blue-500 hover:text-blue-700' : 'text-lg text-gray-500 hover:text-gray-700  transition-colors duration-200'
                    }}
                    >
                    {label}
                    </NavLink>

            ))}
        </div>
    )
}