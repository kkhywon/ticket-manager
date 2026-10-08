export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface User {
  id: number
  name: string
  department?: string
  isDeleted?: boolean
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  assignee?: User
  createdAt: string
  startDate?: string
  dueDate?: string
  isDeleted?: boolean
}