import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteTicket, getTicket } from '../services/ticketService'
import StatusBadge from '../components/tickets/StatusBadge'
import { formatDate } from '../utils/dateUtils'

// 티켓 상세 화면
function TicketDetailPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams()
  const [deleteError, setDeleteError] = useState('')

  const ticket = getTicket(Number(ticketId))

  // 삭제 확인 후 목록으로 이동
  function handleDelete() {
    if (!ticket) {
      return
    }

    setDeleteError('')

    const confirmed = window.confirm(
      `"${ticket.title}" 티켓을 삭제할까요?`
    )

    if (!confirmed) {
      return
    }

    try {
      deleteTicket(ticket.id)
      navigate('/tickets', { replace: true })
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : '티켓을 삭제하지 못했습니다. 다시 시도해주세요.'
      )
    }
  }

  // 존재하지 않는 티켓 안내
  if (!ticket) {
    return (
      <section className="rounded-2xl border border-white/80 bg-white/65 px-6 py-16 text-center shadow-sm">
        <h1 className="text-xl font-bold">티켓을 찾을 수 없습니다.</h1>

        <p className="mt-2 text-sm text-[#526D82]">
          목록에서 확인할 티켓을 다시 선택해주세요.
        </p>

        <Link
          to="/tickets"
          className="mt-6 inline-flex rounded-xl bg-[#14324B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#204A68]"
        >
          목록으로
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {/* 페이지 제목과 이동 버튼 */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/tickets"
            className="text-sm text-[#526D82] hover:text-[#14324B] hover:underline"
          >
            ← 티켓 목록
          </Link>

          <h1 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
            티켓 상세
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/tickets/form?ticketId=${ticket.id}`}
            className="glass-create-button"
          >
            티켓 수정
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-800/15 bg-white/30 px-5 py-3 text-sm text-red-800 backdrop-blur-md transition-colors hover:bg-red-50/60 focus-visible:outline-2 focus-visible:outline-red-800"
          >
            티켓 삭제
          </button>
        </div>
      </header>

      {deleteError && (
        <p
          role="alert"
          className="rounded-lg border border-red-800/15 bg-red-50/50 px-4 py-3 text-sm text-red-800"
        >
          {deleteError}
        </p>
      )}

      {/* 티켓 제목과 상태 */}
      <article className="glass-panel overflow-hidden">
        <div className="border-b border-[#14324B]/10 p-5 md:p-8">
          <p className="mb-3 text-xs font-medium tracking-wide text-[#526D82]">
            티켓 #{ticket.id}
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-6">
            <h2 className="min-w-0 break-words text-xl font-medium leading-relaxed tracking-tight md:text-2xl">
              {ticket.title}
            </h2>

            <div className="shrink-0">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>

        {/* 담당자와 날짜 정보 */}
        <dl className="grid gap-5 border-b border-[#14324B]/10 px-5 py-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-[#526D82]">
              담당자
            </dt>
            <dd className="mt-2 break-words text-sm font-semibold">
              {ticket.assignee
                ? `${ticket.assignee.name} · ${
                    ticket.assignee.department || '부서 미설정'
                  }`
                : '미배정'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#526D82]">
              생성일
            </dt>
            <dd className="mt-2 text-sm font-semibold">
              {formatDate(ticket.createdAt)}
            </dd>
          </div>

          <div>
            <dt className='text-xs font-medium text-[#526D82]'>
              시작일
            </dt>
            <dd className='mt-2 text-sm font-semibold'>
              {ticket.startDate
                ? formatDate(ticket.startDate)
                : '미설정'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#526D82]">
              마감일
            </dt>
            <dd className="mt-2 text-sm font-semibold">
              {ticket.dueDate
                ? formatDate(ticket.dueDate)
                : '미설정'}
            </dd>
          </div>
        </dl>

        {/* 요청 내용 */}
        <div className="p-5 md:p-8">
          <h3 className="mb-4 text-sm font-semibold">요청 내용</h3>

          <p className="min-h-40 whitespace-pre-wrap break-words text-sm leading-7 text-[#425D73]">
            {ticket.description}
          </p>
        </div>
      </article>
    </section>
  )
}

export default TicketDetailPage