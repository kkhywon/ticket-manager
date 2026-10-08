import { mockTickets } from '../mocks/ticket'
import type { Ticket } from '../types'
import { getUsers } from './userService'

// 티켓의 담당자 번호로 최신 담당자 정보를 연결
function resolveAssignee(ticket: Ticket): Ticket {
  const assignee = getUsers().find(
    (user) => user.id === ticket.assignee?.id 
  )

  return {
    ...ticket,
    assignee,
  }
}

// 화면들이 함께 사용할 티켓 목록
const STORAGE_KEY = 'ticket-manager-tickets'

// 저장된 값이 올바른 티켓인지 검사
function isTicket(value: unknown): value is Ticket {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const ticket = value as Record<string, unknown>

  const validAssignee =
    ticket.assignee === undefined ||
    (
      typeof ticket.assignee === 'object' &&
      ticket.assignee !== null &&
      'id' in ticket.assignee &&
      typeof ticket.assignee.id === 'number' &&
      Number.isSafeInteger(ticket.assignee.id) &&
      ticket.assignee.id > 0 &&
      'name' in ticket.assignee &&
      typeof ticket.assignee.name === 'string' &&
      ticket.assignee.name.trim().length > 0
    )

  return (
    typeof ticket.id === 'number' &&
    Number.isSafeInteger(ticket.id) &&
    ticket.id > 0 &&
    typeof ticket.title === 'string' &&
    ticket.title.trim().length > 0 &&
    typeof ticket.description === 'string' &&
    ticket.description.trim().length > 0 &&
    (
      ticket.status === 'open' ||
      ticket.status === 'in_progress' ||
      ticket.status === 'resolved'
    ) &&
    typeof ticket.createdAt === 'string' &&
    Number.isFinite(Date.parse(ticket.createdAt)) &&
    (
      ticket.dueDate === undefined ||
      ticket.dueDate === '' ||
      (
        typeof ticket.dueDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(ticket.dueDate) &&
        Number.isFinite(Date.parse(ticket.dueDate)) &&
        new Date(ticket.dueDate).toISOString().slice(0, 10) === ticket.dueDate
      )
    ) &&
    validAssignee
  )
}

// 저장된 티켓을 읽고, 읽을 수 없으면 기본 데이터 사용
function loadTickets(): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved === null) {
      return [...mockTickets]
    }

    const parsed: unknown = JSON.parse(saved)

    if (!Array.isArray(parsed) || !parsed.every(isTicket)) {
  throw new Error('저장된 티켓 데이터 형식이 올바르지 않습니다.')
}

return parsed
  } catch (error) {
    console.error('저장된 티켓을 불러오지 못했습니다.', error)
    return [...mockTickets]
  }
}

// 화면들이 함께 사용할 티켓 목록
let tickets: Ticket[] = loadTickets()

// 브라우저 저장에 성공한 경우에만 현재 목록 갱신
function saveTickets(nextTickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTickets))
  tickets = nextTickets
}

// 삭제되지 않은 티켓을 최신 담당자 정보와 함께 최신순으로 조회
export function getTickets() {
  return tickets
    .filter((ticket) => !ticket.isDeleted)
    .map(resolveAssignee)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
}

// 새 티켓 생성 후 저장
export function createTicket(
  data: Omit<Ticket, 'id' | 'createdAt'>
): Ticket {
  const newTicket: Ticket = {
    ...data,
    id: Math.max(0, ...tickets.map((ticket) => ticket.id)) + 1,
    createdAt: new Date().toISOString(),
  }

  saveTickets([...tickets, newTicket])

  return newTicket
}

// 삭제되지 않은 티켓 한 개 조회
export function getTicket(id: number): Ticket | undefined {
  const ticket = tickets.find(
    (ticket) => ticket.id === id && !ticket.isDeleted
  )

  return ticket ? resolveAssignee(ticket) : undefined
}

// 기존 티켓을 수정한 새 목록 저장
export function updateTicket(
  id: number,
  data: Omit<Ticket, 'id' | 'createdAt'>
): Ticket {
  const existingTicket = tickets.find(
    (ticket) => ticket.id === id && !ticket.isDeleted
  )

  if (!existingTicket) {
    throw new Error('티켓을 찾을 수 없습니다.')
  }

  const updatedTicket: Ticket = {
    ...existingTicket,
    ...data,
  }

  const nextTickets = tickets.map((ticket) =>
    ticket.id === id ? updatedTicket : ticket
  )

  saveTickets(nextTickets)

  return updatedTicket
}

// 서버 요청을 흉내 내어 잠시 기다린 뒤 티켓 목록 반환
export async function fetchTickets(): Promise<Ticket[]> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500)
  })

  return getTickets()
}

// 티켓을 삭제 상태로 저장
export function deleteTicket(id: number): void {
  const ticket = tickets.find(
    (ticket) => ticket.id === id && !ticket.isDeleted
  )

  if (!ticket) {
    throw new Error('삭제할 티켓을 찾을 수 없습니다.')
  }

  const nextTickets = tickets.map((ticket) =>
  ticket.id === id
    ? { ...ticket, isDeleted: true }
    : ticket
  )

  saveTickets(nextTickets)
}