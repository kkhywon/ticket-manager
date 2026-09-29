import type { TicketStatus } from '../../types'

interface StatusBadgeProps {
  status: TicketStatus
}

// 티켓 상태에 대응하는 한글 표시
const STATUS_LABELS = {
  open: '진행 전',
  in_progress: '진행 중',
  resolved: '완료',
}

function StatusBadge({ status }: StatusBadgeProps) {
  return <span>{STATUS_LABELS[status]}</span>
}

export default StatusBadge