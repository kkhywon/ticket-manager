import { createBrowserRouter } from 'react-router'

import Layout from './components/layout/Layout'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import TicketNewPage from './pages/TicketNewPage'
import TicketEditPage from './pages/TicketEditPage'
import CalendarPage from './pages/CalendarPage'

// 주소와 화면을 연결
const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: TicketsPage,
      },
      {
        path: 'tickets',
        Component: TicketsPage,
      },
      {
        path: 'tickets/new',
        Component: TicketNewPage,
      },

      // 캘린더 화면 연결
      {
        path: 'tickets/calendar',
        Component: CalendarPage,
      },
      
      // 티켓 상세 화면 연결
      {path: 'tickets/:ticketId',
       Component: TicketDetailPage,
      },
      //티켓 수정 화면 연결
      {
        path: 'tickets/:ticketId/edit',
        Component: TicketEditPage,
      },
    ],
  },
])

export default router