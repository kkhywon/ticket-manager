import { Link } from 'react-router'
import type { Ticket } from '../../types'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/dateUtils'

interface TicketCardProps {
  ticket: Ticket
}

// 티켓 한 건을 보여주는 카드
function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="glass-panel flex h-full min-w-0 flex-col p-5 transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#476C80]"
    >
      {/* 티켓 번호와 상태 */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-[#526D82]">
          티켓 #{ticket.id}
        </span>

        <StatusBadge status={ticket.status} />
      </div>

      {/* 제목과 내용 미리보기 */}
      <h2 className="mt-4 line-clamp-2 break-words text-lg font-medium tracking-tight">
        {ticket.title}
      </h2>

      <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-[#526D82]">
        {ticket.description}
      </p>

      {/* 담당자와 일정 */}
      <dl className="mt-auto space-y-4 pt-6">
        <div>
          <dt className="text-xs text-[#526D82]">담당자</dt>
          <dd className="mt-1 break-words text-sm">
            {ticket.assignee
              ? `${ticket.assignee.name} · ${
                  ticket.assignee.department || '부서 미설정'
                }`
              : '미배정'}
          </dd>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#14324B]/10 pt-4">
          <div>
            <dt className="text-xs text-[#526D82]">시작일</dt>
            <dd className="mt-1 text-sm">
              {ticket.startDate
                ? formatDate(ticket.startDate)
                : '미설정'}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-[#526D82]">마감일</dt>
            <dd className="mt-1 text-sm">
              {ticket.dueDate
                ? formatDate(ticket.dueDate)
                : '미설정'}
            </dd>
          </div>
        </div>
      </dl>
    </Link>
  )
}

export default TicketCard