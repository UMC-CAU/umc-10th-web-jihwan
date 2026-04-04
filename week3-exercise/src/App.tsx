import './App.css'
import { Link, Routes, Route } from './router';

const Home = () => <div>여기는 홈페이지 입니다.</div>
const JIHWAN = () => <div>여기는 지환 페이지 입니다.</div>
const SUBIN = () => <div>여기는 수빈 페이지 입니다.</div>

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/home'>Home</Link>
      <Link to='jihwan'>JIHWAN</Link>
      <Link to ='subin'>SUBIN</Link>
    </nav>
  )
}


function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path='/home' component={Home} />
      <Route path='/jihwan' component={JIHWAN} />
      <Route path='/subin' component={SUBIN} />
    </Routes>
    </>
  );
}

export default App
