import type { Ticket } from '../types/index'

export const mockTickets: Ticket[] = [
  {
    id: 1,
    title: '로그인 버튼 수정',
    description: '로그인 버튼의 크기를 조정해주세요.',
    status: 'open',
    assignee: { id: 1, name: '이재현' },
    createdAt: '2026-09-15T09:00:00+09:00',
    dueDate: '2026-09-18',
  },
  {
    id: 2,
    title: '공지사항 내용 변경',
    description: '공지사항의 안내 문구를 수정해주세요.',
    status: 'in_progress',
    assignee: { id: 2, name: '이승민' },
    createdAt: '2026-09-14T14:00:00+09:00',
  },
  {
    id: 3,
    title: '메인 화면 이미지 교체',
    description: '메인 화면 이미지를 새 이미지로 교체해주세요.',
    status: 'resolved',
    createdAt: '2026-09-13T11:00:00+09:00',
  },
]