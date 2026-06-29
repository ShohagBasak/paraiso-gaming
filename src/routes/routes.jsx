import { createBrowserRouter } from 'react-router';

import Home from '../pages/Home/Home';
import Rules from '../pages/Rules/Rules';
import Forums from '../pages/Forums/Forums';
import Community from '../pages/Community/Community';
import Staff from '../pages/Staff/Staff';
import Apply from '../pages/Apply/Apply';
import Login from '../pages/Login/Login';
import Root from '../pages/Root/Root';
import Connect from '../pages/Connect/Connect';
import Error from '../pages/Error/Error';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/connect',
        element: <Connect />,
      },
      {
        path: '/rules',
        element: <Rules />,
      },
      {
        path: '/forums',
        element: <Forums />,
      },
      {
        path: '/community',
        element: <Community />,
      },
      {
        path: '/staff',
        element: <Staff />,
      },
      {
        path: '/apply',
        element: <Apply />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: "*", 
        element: <Error />, 
      },
    ],
  },
]);