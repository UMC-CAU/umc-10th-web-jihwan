import './App.css';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path:'movies/details/:movieId',
        element: <MovieDetailPage/>,
      },
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      
    ]
  },
])


function App() {
  return <RouterProvider router={router} />;
}

export default App;