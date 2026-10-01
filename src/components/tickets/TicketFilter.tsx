import type { TicketStatus, User } from '../../types'

export type AssigneeFilter = number | 'unassigned'

interface TicketFilterProps {
  users: User[]
  search: string
  selectedStatuses: TicketStatus[]
  selectedAssignees: AssigneeFilter[]
  onSearchChange: (value: string) => void
  onToggleStatus: (status: TicketStatus) => void
  onToggleAssignee: (value: AssigneeFilter) => void
  onClearStatuses: () => void
  onClearAssignees: () => void
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: '진행 전' },
  { value: 'in_progress', label: '진행' },
  { value: 'resolved', label: '완료' },
]

// 통합 검색과 상태·담당자 필터
function TicketFilter({
  users,
  search,
  selectedStatuses,
  selectedAssignees,
  onSearchChange,
  onToggleStatus,
  onToggleAssignee,
  onClearStatuses,
  onClearAssignees,
}: TicketFilterProps) {
  return (
    <>
      {/* 제목과 담당자 이름 통합 검색 */}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#425D73]">
          티켓 검색
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
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
            onClick={onClearStatuses}
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
                onChange={() => onToggleStatus(option.value)}
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
            onClick={onClearAssignees}
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
              onChange={() => onToggleAssignee('unassigned')}
              className="h-4 w-4 accent-[#24485A]"
            />
            미배정
          </label>

          {users.map((user) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#14324B]/15 bg-white/20 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedAssignees.includes(user.id)}
                onChange={() => onToggleAssignee(user.id)}
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
    </>
  )
}

export default TicketFilter