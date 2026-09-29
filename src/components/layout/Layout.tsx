import { Outlet } from 'react-router'
import Navigation from './Navigation'

// 모든 페이지에서 공통으로 사용하는 틀
function Layout() {
  return (
    <div className="taskflow-background min-h-screen w-full text-[#14324B] md:flex">
      <Navigation />

      {/* 모바일 하단 메뉴와 화면 안전 영역을 위한 여백 */}
      <main className="min-w-0 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 sm:px-6 md:px-8 md:py-10 xl:px-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout