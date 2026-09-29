import { useState } from 'react'
import { Link } from 'react-router'
import type { Ticket } from '../../types'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarProps {
  tickets: Ticket[]
}

// 날짜를 마감일과 비교할 문자열로 변환
function toDateString(year: number, monthIndex: number, day: number) {
  return (
    `${year}-` +
    `${String(monthIndex + 1).padStart(2, '0')}-` +
    String(day).padStart(2, '0')
  )
}

function Calendar({ tickets }: CalendarProps) {
  // 표시할 달 관리
  const [month, setMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  // 날짜와 빈칸 구성
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const lastDate = new Date(year, monthIndex + 1, 0).getDate()
  const cellCount = Math.ceil((firstDay + lastDate) / 7) * 7

  const days = Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstDay + 1
    return day >= 1 && day <= lastDate ? day : null
  })

  const today = new Date()
  const todayString = toDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  // 이전·다음 달 이동
  function changeMonth(offset: number) {
    setMonth((current) =>
      new Date(current.getFullYear(), current.getMonth() + offset, 1)
    )
  }

  // 이번 달로 돌아오기
  function goToToday() {
    const current = new Date()
    setMonth(new Date(current.getFullYear(), current.getMonth(), 1))
  }

  return (
    <div className="glass-panel overflow-hidden">
      {/* 월 제목과 이동 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#14324B]/10 px-4 py-5 md:px-6">
        <h2
          aria-live="polite"
          className="text-lg font-medium tracking-tight md:text-xl"
        >
          {year}년 {monthIndex + 1}월
        </h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToToday}
            className="mr-2 rounded-lg border border-[#14324B]/15 bg-white/15 px-3 py-2 text-sm transition-colors hover:bg-white/40"
          >
            오늘
          </button>

          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="이전 달"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors hover:bg-white/40"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="다음 달"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors hover:bg-white/40"
          >
            ›
          </button>
        </div>
      </div>

      {/* 요일 표시 */}
      <div className="grid grid-cols-7 border-b border-[#14324B]/10">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={`py-3 text-center text-xs font-medium ${
              index === 0
                ? 'text-[#A65050]'
                : index === 6
                  ? 'text-[#456F98]'
                  : 'text-[#526D82]'
            }`}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* 날짜별 마감 티켓 */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const cellStyle =
            'min-h-28 min-w-0 border-[#14324B]/10 p-1 sm:min-h-36 sm:p-2.5' +
            (index % 7 !== 6 ? ' border-r' : '') +
            (index < cellCount - 7 ? ' border-b' : '')

          if (day === null) {
            return (
              <div
                key={index}
                aria-hidden="true"
                className={`${cellStyle} bg-[#14324B]/[0.025]`}
              />
            )
          }

          const dateString = toDateString(year, monthIndex, day)
          const isToday = dateString === todayString

          const dayTickets = tickets.filter(
            (ticket) => ticket.dueDate === dateString
          )

          const dateColor =
            index % 7 === 0
              ? 'text-[#A65050]'
              : index % 7 === 6
                ? 'text-[#456F98]'
                : 'text-[#425D73]'

          return (
            <div
              key={index}
              className={`${cellStyle} ${isToday ? 'bg-white/20' : ''}`}
            >
              <time
                dateTime={dateString}
                aria-current={isToday ? 'date' : undefined}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs sm:text-sm ${
                  isToday
                    ? 'bg-[#24485A] font-medium text-white'
                    : dateColor
                }`}
              >
                {day}
              </time>

              <div className="mt-1.5 space-y-1">
                {dayTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    title={ticket.title}
                    className="block rounded border-l-2 border-[#AD6666]/70 bg-[#AD6666]/10 px-1 py-2 text-[11px] leading-4 text-[#783D3D] transition-colors hover:bg-[#AD6666]/20 focus-visible:outline-2 focus-visible:outline-[#783D3D] sm:px-2 sm:text-xs"
                  >
                    <span className="line-clamp-2 break-all">
                      {ticket.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar