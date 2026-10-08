import { Link } from 'react-router'
import Calendar from '../components/calendar/Calendar'
import { getTickets } from '../services/ticketService'

// 마감일 캘린더 화면
function CalendarPage() {
  const tickets = getTickets()

  return (
    <section className="space-y-6">
      {/* 페이지 제목 */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            일정 캘린더
          </h1>
          <p className="mt-2 text-sm text-[#526D82]">
            업무 시작일부터 마감일까지 일정을 확인하세요.
          </p>
        </div>

        <Link
          to="/tickets/form"
          className="glass-create-button self-start"
        >
          <span aria-hidden="true" className="text-xl font-normal leading-none">
            +
          </span>
          <span>새 티켓</span>
        </Link>
      </header>

      <Calendar tickets={tickets} />

      <p className="text-xs leading-5 text-[#526D82]">
        시작일부터 마감일까지 표시됩니다. 날짜가 하나만 지정된 경우
        해당 날짜에 표시됩니다. 제목을 누르면 상세 화면으로 이동합니다.
      </p>
    </section>
  )
}

export default CalendarPage