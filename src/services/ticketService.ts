import { mockTickets } from '../mocks/ticket'
import type { Ticket } from '../types'

// 화면들이 함께 사용할 티켓 목록
const STORAGE_KEY = 'ticket-manager-tickets'

// 저장된 티켓을 읽고, 읽을 수 없으면 기본 데이터 사용
function loadTickets(): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved === null) {
      return [...mockTickets]
    }

    const parsed: unknown = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      throw new Error('저장된 티켓이 배열 형태가 아닙니다.')
    }

    return parsed as Ticket[]
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

// 티켓 목록을 생성일 기준 최신순으로 조회
export function getTickets() {
  return [...tickets].sort(
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

// 번호가 일치하는 티켓 한 개 조회
export function getTicket(id: number): Ticket | undefined {
  return tickets.find((ticket) => ticket.id === id)
}

// 기존 티켓을 수정한 새 목록 저장
export function updateTicket(
  id: number,
  data: Omit<Ticket, 'id' | 'createdAt'>
): Ticket {
  const existingTicket = tickets.find((ticket) => ticket.id === id)

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