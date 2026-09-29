export type TicketStatus = 'open' | 'in_progress' | 'resolved'

export interface User {
  id: number
  name: string
}

export interface Ticket {
  id: number
  title: string
  description: string
  status: TicketStatus
  assignee?: User
  createdAt: string
  dueDate?: string
}