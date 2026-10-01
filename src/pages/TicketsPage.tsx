import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { fetchTickets } from '../services/ticketService'
import StatusBadge from '../components/tickets/StatusBadge'
import { formatDate } from '../utils/dateUtils'
import type { Ticket, TicketStatus } from '../types'
import { getUsers } from '../services/userService'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import TicketFilter from '../components/tickets/TicketFilter'
import type { AssigneeFilter } from '../components/tickets/TicketFilter'


function TicketsPage() {
  const users = getUsers()
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
    return <LoadingState />
  }

  // 조회 실패 안내와 다시 시도
  if (error) {
    return <ErrorState message={error} onRetry={retryLoading} />
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

     <TicketFilter
        users={users}
        search={search}
        selectedStatuses={selectedStatuses}
        selectedAssignees={selectedAssignees}
        onSearchChange={setSearch}
        onToggleStatus={toggleStatus}
        onToggleAssignee={toggleAssignee}
        onClearStatuses={() => setSelectedStatuses([])}
        onClearAssignees={() => setSelectedAssignees([])}
      />
      
      {/* 목록과 결과 건수 */}
      <div className="glass-panel overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#14324B]/10 px-5 py-4 md:px-6">
          <h2 className="text-sm font-medium leading-5">티켓 목록</h2>

          <span
            aria-live="polite"
            className="inline-flex h-6 items-center justify-center rounded-full bg-[#14324B]/8 px-2.5 text-xs font-medium leading-5"
          >
            {hasFilters
              ? `${filteredTickets.length} / ${tickets.length}건`
              : `${tickets.length}건`}
          </span>
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            title='등록된 티켓이 없습니다.'
            description='새 티켓 버튼으로 첫 업무 요청을 등록하세요.'
            />
        ) : (
          <>
            {/* PC용 표 */}
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left">
                <caption className="sr-only">
                  티켓 제목, 담당자, 생성일, 상태 목록
                </caption>

                <thead className="relative z-10 bg-[#14324B]/[0.07] text-xs text-[#34536B] shadow-[0_5px_8px_-4px_rgba(20,50,75,0.25)]">
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