import { createBrowserRouter } from 'react-router'

import Layout from './components/layout/Layout'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import TicketFormPage from './pages/TicketFormPage'
import CalendarPage from './pages/CalendarPage'
import UsersPage from './pages/UsersPage'

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
        path: 'users',
        Component: UsersPage,
      },
      
      {
        path: 'tickets/form',
        Component: TicketFormPage,
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
      
    ],
  },
])

export default router