import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import TicketForm from '../components/tickets/TicketForm'
import type { TicketFormValues } from '../components/tickets/TicketForm'
import { getUsers } from '../services/userService'
import { createTicket, getTicket, updateTicket, } from '../services/ticketService'

// 티켓 생성 화면
function TicketFormPage() {
  const navigate = useNavigate()

  // 주소에 티켓 번호가 있으면 수정할 티켓 조회
  const [searchParams] = useSearchParams()
  const ticketId  = searchParams.get('ticketId')
  const isEditing = ticketId !== null

  const ticket = isEditing
    ? getTicket(Number(ticketId))
    : undefined

    // 수정 중이면 상세로, 생성 중이면 목록으로 이동
    const backPath = isEditing && ticket
      ? `/tickets/${ticket.id}`
      : '/tickets'

    // 수정은 기존 값으로, 생성은 빈 값으로 시작
    const   [values, setValues] = useState<TicketFormValues>({
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        assigneeId: ticket?.assignee
        ? String(ticket.assignee.id)
        : '',
        status: ticket?.status ?? 'open',
        startDate: ticket?.startDate ?? '',
        dueDate: ticket?.dueDate ?? '',
    })
    
  const [error, setError] = useState('')

  // 필수 입력값 검사 후 생성
  function handleValidate() {
    if (!values.title.trim() || !values.description.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }

    // 시작일과 마감일이 모두 입력된 경우 날짜 순서 검사
    if (
      values.startDate &&
      values.dueDate &&
      values.startDate > values.dueDate
    ) {
      setError('마감일은 시작일과 같거나 이후여야 합니다.')
      return
    }

    if (isEditing && !ticket) {
      setError('수정할 티켓을 찾을 수 없습니다.')
      return
    }

    setError('')

    const assignee = getUsers().find(
      (user) => user.id === Number(values.assigneeId)
    )

    const data = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      assignee,
      startDate: values.startDate,
      dueDate: values.dueDate,
    }

    try {
      if (isEditing && ticket) {
        updateTicket(ticket.id, data)
        navigate(`/tickets/${ticket.id}`)
      } else {
        createTicket(data)
        navigate(`/tickets`)
      }
    } catch {
      setError('티켓을 저장하지 못했습니다. 입력 내용은 유지됩니다.')
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* 페이지 제목 */}
      <header>
        <Link
          to={backPath}
          className="text-sm text-[#526D82] hover:underline"
        >
          ← {isEditing && ticket ? '티켓 상세' : '티켓 목록'}
        </Link>

        <h1 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
          {isEditing ? '티켓 수정' : '새 티켓'}
        </h1>
        <p className="mt-2 text-sm text-[#526D82]">
          {isEditing
            ? '수정할 업무 정보를 입력하세요.'
            : '요청할 업무와 필요한 정보를 입력하세요.'}
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
            to={backPath}
            className="rounded-lg px-5 py-3 text-sm text-[#526D82] transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-[#476C80]"
          >
            취소
          </Link>

          <button
            type="button"
            onClick={handleValidate}
            className="glass-create-button"
          >
            {isEditing ? '수정 저장' : '티켓 생성'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default TicketFormPage