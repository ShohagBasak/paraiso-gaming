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

import PermissionGuard from '../components/PermissionGuard';

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
      { path: 'login', Component: Login }
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
      { path: 'banners', element: <PermissionGuard permission="banners"><BannerManager /></PermissionGuard> },
      { path: 'announcements', element: <PermissionGuard permission="announcements"><AnnouncementManager /></PermissionGuard> },
      { path: 'users', element: <PermissionGuard permission="users"><UserManager /></PermissionGuard> },
      { path: 'staff', element: <PermissionGuard permission="staff"><StaffManager /></PermissionGuard> },
      { path: 'roster', element: <PermissionGuard permission="roster"><RosterManager /></PermissionGuard> },
      { path: 'helper-roster', element: <PermissionGuard permission="helper-roster"><HelperRosterManager /></PermissionGuard> },
      { path: 'faqs', element: <PermissionGuard permission="faqs"><FaqManager /></PermissionGuard> },
      { path: 'coc', element: <PermissionGuard permission="coc"><ChainOfCommandManager /></PermissionGuard> },
      { path: 'create-user', element: <MasterRoute><CreateUserManager /></MasterRoute> },
    ]
  }
]);