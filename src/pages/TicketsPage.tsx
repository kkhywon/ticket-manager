import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchTickets } from '../services/ticketService'
import StatusBadge from '../components/tickets/StatusBadge'
import { formatDate } from '../utils/dateUtils'
import type { Ticket, TicketStatus } from '../types'
import { USERS } from '../mocks/users'

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: '진행 전' },
  { value: 'in_progress', label: '진행' },
  { value: 'resolved', label: '완료' },
]

type AssigneeFilter = number | 'unassigned'

function TicketsPage() {
  // 티켓 목록과 조회 상태 관리
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // 통합 검색어와 선택한 필터 관리
  const [search, setSearch] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<TicketStatus[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<AssigneeFilter[]>([])

  // 화면 진입 또는 다시 시도 시 목록 조회
  useEffect(() => {
    let cancelled = false

    async function loadTicketList() {
      try {
        const data = await fetchTickets()

        if (!cancelled) {
          setTickets(data)
        }
      } catch {
        if (!cancelled) {
          setError('티켓 목록을 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadTicketList()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  // 오류 안내를 지우고 다시 조회
  function retryLoading() {
    setError('')
    setIsLoading(true)
    setRetryCount((current) => current + 1)
  }

  // 상태 선택 또는 해제
  function toggleStatus(status: TicketStatus) {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status]
    )
  }

  // 담당자 선택 또는 해제
  function toggleAssignee(value: AssigneeFilter) {
    setSelectedAssignees((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  // 통합 검색과 상태·담당자 조건을 모두 만족하는 티켓 조회
  const keyword = search.trim().toLowerCase()

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(keyword) ||
      (ticket.assignee?.name ?? '미배정').toLowerCase().includes(keyword)

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(ticket.status)

    const assigneeValue: AssigneeFilter =
      ticket.assignee?.id ?? 'unassigned'

    const matchesAssignee =
      selectedAssignees.length === 0 ||
      selectedAssignees.includes(assigneeValue)

    return matchesSearch && matchesStatus && matchesAssignee
  })

  const hasFilters =
    keyword.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedAssignees.length > 0

  // 조회 중 안내
  if (isLoading) {
    return (
      <section className="glass-panel px-6 py-16 text-center">
        <p role="status" className="text-sm text-[#526D82]">
          티켓을 불러오는 중입니다…
        </p>
      </section>
    )
  }

  // 조회 실패 안내와 다시 시도
  if (error) {
    return (
      <section className="glass-panel px-6 py-16 text-center">
        <p role="alert" className="font-medium text-[#14324B]">
          {error}
        </p>

        <button
          type="button"
          onClick={retryLoading}
          className="mt-4 rounded-lg bg-[#24485A] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#193A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
        >
          다시 시도
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {/* 제목과 주요 이동 버튼 */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            티켓 목록
          </h1>
          <p className="mt-2 text-sm text-[#526D82]">
            업무 요청과 진행 상태를 확인하세요.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/tickets/calendar"
            className="inline-flex items-center justify-center rounded-lg border border-[#14324B]/15 bg-white/20 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
          >
            캘린더
          </Link>

          <Link to="/tickets/new" className="glass-create-button">
            <span aria-hidden="true" className="text-xl font-normal leading-none">
              +
            </span>
            <span>새 티켓</span>
          </Link>
        </div>
      </header>

      {/* 제목과 담당자 이름 통합 검색 */}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#425D73]">
          티켓 검색
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="제목 또는 담당자 이름을 검색하세요"
          className="w-full rounded-lg border border-[#14324B]/15 bg-white/25 px-4 py-3 text-base outline-none placeholder:text-[#718694] focus:border-[#476C80] focus:bg-white/40 focus:ring-2 focus:ring-[#476C80]/10 sm:text-sm"
        />
      </label>

      {/* 상태 복수 선택 */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#425D73]">
          상태
        </legend>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedStatuses([])}
            aria-pressed={selectedStatuses.length === 0}
            className={`rounded-lg border px-3 py-2 text-sm ${
              selectedStatuses.length === 0
                ? 'border-[#476C80] bg-white/40 text-[#14324B]'
                : 'border-[#14324B]/15 bg-white/15 text-[#526D82]'
            }`}
          >
            전체
          </button>

          {STATUS_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(option.value)}
                onChange={() => toggleStatus(option.value)}
                className="h-4 w-4 accent-[#24485A]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 담당자 복수 선택 */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#425D73]">
          담당자
        </legend>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedAssignees([])}
            aria-pressed={selectedAssignees.length === 0}
            className={`rounded-lg border px-3 py-2 text-sm ${
              selectedAssignees.length === 0
                ? 'border-[#476C80] bg-white/40 text-[#14324B]'
                : 'border-[#14324B]/15 bg-white/15 text-[#526D82]'
            }`}
          >
            전체
          </button>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={selectedAssignees.includes('unassigned')}
              onChange={() => toggleAssignee('unassigned')}
              className="h-4 w-4 accent-[#24485A]"
            />
            미배정
          </label>

          {USERS.map((user) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedAssignees.includes(user.id)}
                onChange={() => toggleAssignee(user.id)}
                className="h-4 w-4 accent-[#24485A]"
              />
              {user.name}
            </label>
          ))}
        </div>

        <p className="mt-3 text-xs text-[#526D82]">
          {selectedAssignees.length > 0
            ? `${selectedAssignees.length}개 항목 선택됨`
            : '담당자를 선택하면 해당 담당자의 티켓만 표시됩니다.'}
        </p>
      </fieldset>

      {/* 목록과 결과 건수 */}
      <div className="glass-panel overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#14324B]/10 px-5 py-4 md:px-6">
          <h2 className="text-sm font-medium">티켓 목록</h2>

          <span
            aria-live="polite"
            className="rounded-full bg-[#14324B]/8 px-2.5 py-0.5 text-xs font-medium"
          >
            {hasFilters
              ? `${filteredTickets.length} / ${tickets.length}건`
              : `${tickets.length}건`}
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium">등록된 티켓이 없습니다.</p>
            <p className="mt-2 text-sm text-[#526D82]">
              새 티켓 버튼으로 첫 업무 요청을 등록하세요.
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium">조건에 맞는 티켓이 없습니다.</p>
            <p className="mt-2 text-sm text-[#526D82]">
              검색어나 상태·담당자 선택을 변경해보세요.
            </p>
          </div>
        ) : (
          <>
            {/* PC용 표 */}
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left">
                <caption className="sr-only">
                  티켓 제목, 담당자, 생성일, 상태 목록
                </caption>

                <thead className="border-b border-[#14324B]/20 bg-[#14324B]/[0.07] text-xs text-[#34536B]">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      제목
                    </th>
                    <th
                      scope="col"
                      className="w-24 px-3 py-3 font-medium"
                    >
                      담당자
                    </th>
                    <th
                      scope="col"
                      className="w-32 px-3 py-3 font-medium"
                    >
                      생성일
                    </th>
                    <th
                      scope="col"
                      className="w-28 px-3 py-3 font-medium"
                    >
                      상태
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#14324B]/8">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="transition-colors hover:bg-white/25"
                    >
                      <td className="px-6 py-5">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          title={ticket.title}
                          className="block truncate font-medium hover:text-[#0D717F] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#476C80]"
                        >
                          {ticket.title}
                        </Link>
                      </td>

                      <td className="break-words px-3 py-5 text-sm text-[#425D73]">
                        {ticket.assignee?.name ?? '미배정'}
                      </td>

                      <td className="px-3 py-5 text-xs text-[#526D82]">
                        {formatDate(ticket.createdAt)}
                      </td>

                      <td className="px-3 py-5">
                        <StatusBadge status={ticket.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일용 카드 목록 */}
            <ul className="divide-y divide-[#14324B]/10 md:hidden">
              {filteredTickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="block px-5 py-5 transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#476C80]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 flex-1 break-words font-medium leading-6">
                        {ticket.title}
                      </h3>

                      <div className="shrink-0">
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#526D82]">
                      <span>
                        담당자 · {ticket.assignee?.name ?? '미배정'}
                      </span>
                      <span>
                        생성일 · {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

export default TicketsPage