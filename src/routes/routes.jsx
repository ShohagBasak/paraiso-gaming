import { createBrowserRouter } from 'react-router';

import Home from '../pages/Home/Home';
import Rules from '../pages/Rules/Rules';
import Staff from '../pages/Staff/Staff';
import Root from '../pages/Root/Root';
import Error from '../pages/Error/Error';
import Donate from '../pages/Donate/Donate';
import ServerOffenses from '../pages/Home/ServerOffenses';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';



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
        path: '/discord',
        loader: () => {
          window.location.href = "https://discord.com/invite/7AsJaG3KSV"; 
          return null;
        },
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
  // {
  //   path: "/",
  //   Component: AuthLayout,
  //   children: [
  //     {
  //       path: 'login',
  //       Component: Login
  //     },
  //     {
  //       path: 'register',
  //       Component: Register
  //     }
  //   ]
  // }
]);