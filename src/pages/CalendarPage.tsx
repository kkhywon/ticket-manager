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
            마감일 캘린더
          </h1>
          <p className="mt-2 text-sm text-[#526D82]">
            날짜별 마감 업무를 확인하세요.
          </p>
        </div>

        <Link
          to="/tickets/new"
          className="inline-flex self-start items-center justify-center rounded-lg bg-[#24485A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#193A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
        >
          + 새 티켓
        </Link>
      </header>

      <Calendar tickets={tickets} />

      <p className="text-xs leading-5 text-[#526D82]">
        마감일이 지정된 티켓만 표시됩니다. 제목을 누르면 상세 화면으로
        이동합니다.
      </p>
    </section>
  )
}

export default CalendarPage