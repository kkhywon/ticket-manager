import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import TicketForm from '../components/tickets/TicketForm'
import type { TicketFormValues } from '../components/tickets/TicketForm'
import { getUsers } from '../services/userService'
import { getTicket, updateTicket } from '../services/ticketService'

// 티켓 수정 화면
function TicketEditPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams()
  const ticket = getTicket(Number(ticketId))

  // 기존 티켓 내용으로 입력값 초기화
  const [values, setValues] = useState<TicketFormValues>({
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    assigneeId: ticket?.assignee
      ? String(ticket.assignee.id)
      : '',
    status: ticket?.status ?? 'open',
    dueDate: ticket?.dueDate ?? '',
  })
  const [error, setError] = useState('')

  // 존재하지 않는 티켓 안내
  if (!ticket) {
    return (
      <section className="glass-panel px-6 py-16 text-center">
        <h1 className="text-xl font-medium">
          티켓을 찾을 수 없습니다.
        </h1>

        <p className="mt-2 text-sm text-[#526D82]">
          목록에서 수정할 티켓을 다시 선택해주세요.
        </p>

        <Link
          to="/tickets"
          className="mt-6 inline-flex rounded-lg bg-[#24485A] px-5 py-3 text-sm font-medium text-white hover:bg-[#193A4B]"
        >
          목록으로
        </Link>
      </section>
    )
  }

  // 필수 입력값 검사 후 수정 저장
  function handleValidate() {
    if (!values.title.trim() || !values.description.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }

    setError('')

    const assignee = getUsers().find(
      (user) => user.id === Number(values.assigneeId)
    )

    try {
      updateTicket(Number(ticketId), {
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
        assignee,
        dueDate: values.dueDate,
      })

      navigate(`/tickets/${ticketId}`)
    } catch {
      setError('티켓을 저장하지 못했습니다. 입력 내용은 유지됩니다.')
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* 페이지 제목 */}
      <header>
        <Link
          to={`/tickets/${ticket.id}`}
          className="text-sm text-[#526D82] hover:underline"
        >
          ← 티켓 상세
        </Link>

        <h1 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
          티켓 수정
        </h1>

        <p className="mt-2 text-sm text-[#526D82]">
          티켓 #{ticket.id}의 내용을 수정합니다.
        </p>
      </header>

      <div className="glass-panel p-5 md:p-8">
        {/* 공통 입력 영역 */}
        <TicketForm values={values} onChange={setValues} />

        {/* 오류 안내 */}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-800/15 bg-red-50/50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        {/* 저장과 취소 */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[#14324B]/10 pt-5">
          <Link
            to={`/tickets/${ticket.id}`}
            className="rounded-lg px-5 py-3 text-sm text-[#526D82] transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-[#476C80]"
          >
            취소
          </Link>

          <button
            type="button"
            onClick={handleValidate}
            className="glass-create-button"
          >
            수정 저장
          </button>
        </div>
      </div>
    </section>
  )
}

export default TicketEditPage