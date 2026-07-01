import { createBrowserRouter } from 'react-router';

import Home from '../pages/Home/Home';
import Rules from '../pages/Rules/Rules';
import Staff from '../pages/Staff/Staff';
import Root from '../pages/Root/Root';
import Error from '../pages/Error/Error';
import Donate from '../pages/Donate/Donate';
import ServerOffenses from '../pages/Home/ServerOffenses';
import About from '../pages/About/About';
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
        path: '/about',
        element: <About />,
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
      { path: 'forgot-password', Component: ForgotPassword }
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
      { path: 'banners', element: <BannerManager /> },
      { path: 'announcements', element: <AnnouncementManager /> },
      { path: 'users', element: <UserManager /> },
      { path: 'staff', element: <StaffManager /> },
    ]
  }
]);