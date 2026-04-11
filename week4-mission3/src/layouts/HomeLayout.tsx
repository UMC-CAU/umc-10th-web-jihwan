import { Outlet } from "react-router-dom"

const HomeLayout = () => {
  return (
    <div className='h-dvh flex flex-col'>
        <nav>내비게이션</nav>
        <main className='flex-1'>
            <Outlet/>
        </main>
        <footer>footer</footer>
    </div>
  )
}

export default HomeLayout