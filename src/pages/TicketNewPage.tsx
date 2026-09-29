import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { USERS } from '../mocks/users'
import type { TicketStatus } from '../types'
import { createTicket } from '../services/ticketService'

const inputStyle =
  'mt-2 w-full min-w-0 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-3 text-base text-[#14324B] outline-none transition-colors placeholder:text-[#718694] focus:border-[#476C80] focus:bg-white/40 focus:ring-2 focus:ring-[#476C80]/10 sm:text-sm'

const labelStyle = 'block text-sm font-medium text-[#425D73]'

// 티켓 생성 화면
function TicketNewPage() {
  const navigate = useNavigate()

  // 입력값 관리
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [status, setStatus] = useState<TicketStatus>('open')
  const [dueDate, setDueDate] = useState('')
  const [error, seterror] = useState('')

  // 필수 입력값 검사 후 생성
  function handleValidate() {
    if (!title.trim() || !description.trim()) {
      seterror('제목과 내용을 모두 입력해주세요.')
      return
    }

    seterror('')

    const assignee = USERS.find(
      (user) => user.id === Number(assigneeId)
    )

    try {
      createTicket({
        title: title.trim(),
        description: description.trim(),
        status,
        ...(assignee ? { assignee } : {}),
        dueDate,
      })

      navigate('/tickets')
    } catch {
      seterror('티켓을 저장하지 못했습니다. 입력 내용은 유지됩니다.')
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

      {/* 업무 내용 입력 */}
      <div className="glass-panel p-5 md:p-8">
        <p className="mb-5 text-xs text-[#526D82]">
            <span className="text-[#9A5050]">*</span> 필수 입력 항목
        </p>
        <div className="space-y-6">
          <label className={labelStyle}>
            제목
            <span className="ml-2 text-xs font-normal text-[#526D82]">
              *
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="어떤 업무가 필요한가요?"
              aria-required="true"
              className={inputStyle}
            />
          </label>

          <label className={labelStyle}>
            내용
            <span className="ml-2 text-xs font-normal text-[#526D82]">
              *
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="요청 배경과 필요한 작업을 작성해주세요."
              rows={8}
              aria-required="true"
              className={`${inputStyle} resize-y leading-7`}
            />
          </label>
        </div>

        {/* 담당자·상태·마감일 */}
        <div className="mt-7 grid gap-5 border-t border-[#14324B]/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <label className={`${labelStyle} min-w-0`}>
            담당자
            <select
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
              className={inputStyle}
            >
              <option value="">미배정</option>
              {USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>

          <label className={`${labelStyle} min-w-0`}>
            상태
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TicketStatus)
              }
              className={inputStyle}
            >
              <option value="open">진행 전</option>
              <option value="in_progress">진행</option>
              <option value="resolved">완료</option>
            </select>
          </label>

          <label className={`${labelStyle} min-w-0`}>
            마감일
            <span className="ml-2 text-xs font-normal text-[#526D82]">
              (선택)
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={inputStyle}
            />
          </label>
        </div>

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
            className="rounded-lg bg-[#24485A] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#193A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
          >
            티켓 생성
          </button>
        </div>
      </div>
    </section>
  )
}

export default TicketNewPage