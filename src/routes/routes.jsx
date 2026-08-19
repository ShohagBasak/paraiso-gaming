import { createBrowserRouter } from 'react-router';

import Home from '../pages/Home/Home';
import Rules from '../pages/Rules/Rules';
import Staff from '../pages/Staff/Staff';
import Root from '../pages/Root/Root';
import Error from '../pages/Error/Error';
import Donate from '../pages/Donate/Donate';
import ServerOffenses from '../pages/Home/ServerOffenses';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import BannerManager from '../pages/Dashboard/BannerManager';
import AnnouncementManager from '../pages/Dashboard/AnnouncementManager';
import UserManager from '../pages/Dashboard/UserManager';
import StaffManager from '../pages/Dashboard/StaffManager';
import AdminRoute from '../components/AdminRoute';
import MasterRoute from '../components/MasterRoute';
import GovernmentRoster from '../pages/Roster/GovernmentRoster';
import RosterManager from '../pages/Dashboard/RosterManager';
import ChainOfCommand from '../pages/Roster/ChainOfCommand';
import HelperRoster from '../pages/Roster/HelperRoster';
import HelperRosterManager from '../pages/Dashboard/HelperRosterManager';
import FaqManager from '../pages/Dashboard/FaqManager';
import ChainOfCommandManager from '../pages/Dashboard/ChainOfCommandManager';
import CreateUserManager from '../pages/Dashboard/CreateUserManager';
import DonateManager from '../pages/Dashboard/DonateManager';
import TicketManager from '../pages/Dashboard/TicketManager';
import ServerSettingsManager from '../pages/Dashboard/ServerSettingsManager';
import UcpSecurityManager from '../pages/Dashboard/UcpSecurityManager';
import MyTickets from '../pages/Tickets/MyTickets';
import TicketChat from '../pages/Tickets/TicketChat';
import UcpPage from '../pages/Ucp/UcpPage';
import Highscores from '../pages/Highscores/Highscores';

import PermissionGuard from '../components/PermissionGuard';
import PrivateRoute from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/ucp',
        element: <UcpPage />,
      },
      {
        path: '/highscores',
        element: <Highscores />,
      },
      {
        path: '/donate',
        element: <Donate />,
      },
      {
        path: '/rules',
        element: <Rules />,
      },
      {
        path: '/rules/offenses',
        element: <ServerOffenses />,
      },
      {
        path: '/staff',
        element: <Staff />,
      },
      {
        path: '/roster/chain-of-command',
        element: <ChainOfCommand />,
      },
      {
        path: '/roster/helper',
        element: <HelperRoster />,
      },
      {
        path: '/roster/government',
        element: <GovernmentRoster />,
      },
      {
        path: '/my-tickets',
        element: <PrivateRoute><MyTickets /></PrivateRoute>,
      },
      {
        path: '/my-tickets/:id',
        element: <PrivateRoute><TicketChat /></PrivateRoute>,
      },
      {
        path: '/discord',
        loader: () => {
          window.location.href = "https://discord.gg/sbBnrCMcGD"; 
          return null;
        },
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'forgot-password', Component: ForgotPassword },
    ]
  },
  {
    path: '/dashboard',
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'server-settings', element: <ServerSettingsManager /> },
      { path: 'ucp-security', element: <MasterRoute><UcpSecurityManager /></MasterRoute> },
      { path: 'banners', element: <PermissionGuard permission="banners"><BannerManager /></PermissionGuard> },
      { path: 'announcements', element: <PermissionGuard permission="announcements"><AnnouncementManager /></PermissionGuard> },
      { path: 'users', element: <PermissionGuard permission="users"><UserManager /></PermissionGuard> },
      { path: 'staff', element: <PermissionGuard permission="staff"><StaffManager /></PermissionGuard> },
      { path: 'roster', element: <PermissionGuard permission="roster"><RosterManager /></PermissionGuard> },
      { path: 'helper-roster', element: <PermissionGuard permission="helper-roster"><HelperRosterManager /></PermissionGuard> },
      { path: 'faqs', element: <PermissionGuard permission="faqs"><FaqManager /></PermissionGuard> },
      { path: 'coc', element: <PermissionGuard permission="coc"><ChainOfCommandManager /></PermissionGuard> },
      { path: 'donate', element: <PermissionGuard permission="donate"><DonateManager /></PermissionGuard> },
      { path: 'tickets', element: <PermissionGuard permission="tickets"><TicketManager /></PermissionGuard> },
      { path: 'create-user', element: <MasterRoute><CreateUserManager /></MasterRoute> },
    ]
  }
]);