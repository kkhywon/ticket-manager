import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import TicketForm from '../components/tickets/TicketForm'
import type { TicketFormValues } from '../components/tickets/TicketForm'
import { getUsers } from '../services/userService'
import { createTicket } from '../services/ticketService'

// 티켓 생성 화면
function TicketNewPage() {
  const navigate = useNavigate()

  // 입력값과 오류 안내 관리
  const [values, setValues] = useState<TicketFormValues>({
    title: '',
    description: '',
    assigneeId: '',
    status: 'open',
    dueDate: '',
  })
  const [error, setError] = useState('')

  // 필수 입력값 검사 후 생성
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
      createTicket({
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
        ...(assignee ? { assignee } : {}),
        dueDate: values.dueDate,
      })

      navigate('/tickets')
    } catch {
      setError('티켓을 저장하지 못했습니다. 입력 내용은 유지됩니다.')
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* 페이지 제목 */}
      <header>
        <Link
          to="/tickets"
          className="text-sm text-[#526D82] hover:underline"
        >
          ← 티켓 목록
        </Link>

        <h1 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
          새 티켓
        </h1>
        <p className="mt-2 text-sm text-[#526D82]">
          요청할 업무와 필요한 정보를 입력하세요.
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
            to="/tickets"
            className="rounded-lg px-5 py-3 text-sm text-[#526D82] transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-[#476C80]"
          >
            취소
          </Link>

          <button
            type="button"
            onClick={handleValidate}
            className="glass-create-button"
          >
            티켓 생성
          </button>
        </div>
      </div>
    </section>
  )
}

export default TicketNewPage