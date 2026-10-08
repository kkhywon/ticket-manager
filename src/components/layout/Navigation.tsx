import { NavLink } from 'react-router'

// 메뉴별 이동 주소와 아이콘
const MENU_ITEMS = [
  {
    to: '/tickets',
    label: '티켓 목록',
    path: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  },
  {
    to: '/tickets/form',
    label: '티켓 생성',
    path: 'M12 5v14M5 12h14',
  },
  {
    to: '/tickets/calendar',
    label: '캘린더',
    path: 'M8 3v4M16 3v4M4 10h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  },

  {
    to: '/users',
    label: '담당자 관리',
    path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
]

function Navigation() {
  return (
    <nav
      aria-label="주 메뉴"
      className="taskflow-navigation fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-[400px] p-2 text-[#14324B] md:sticky md:inset-x-auto md:bottom-auto md:top-6 md:mx-0 md:my-6 md:ml-6 md:w-[clamp(180px,16vw,220px)] md:max-w-none md:shrink-0 md:self-start md:p-3"
    >
      {/* PC용 서비스 이름 */}
      <div className="hidden px-3 pb-7 pt-4 md:block">
        <p className="text-lg font-semibold tracking-[-0.04em]">
          TASKFLOW
        </p>
        <p className="mt-1 text-xs text-[#526D82]">
          업무 관리
        </p>
      </div>

      {/* 모바일은 가로 탭, PC는 세로 메뉴 */}
      <div className="flex gap-1.5 md:flex-col md:gap-2">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `taskflow-nav-item flex min-h-[58px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-medium md:min-h-[48px] md:flex-none md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 md:text-sm ${
                isActive
                  ? 'taskflow-nav-item-active text-[#174D78]'
                  : 'text-[#526D82] hover:bg-white/30 hover:text-[#14324B]'
              }`
            }
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d={item.path} />
            </svg>

            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navigation