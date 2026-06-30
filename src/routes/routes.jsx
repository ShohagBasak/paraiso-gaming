import { createBrowserRouter, redirect } from 'react-router';

import Home from '../pages/Home/Home';
import Rules from '../pages/Rules/Rules';
import Community from '../pages/Community/Community';
import Staff from '../pages/Staff/Staff';
import Apply from '../pages/Apply/Apply';
import Login from '../pages/Login/Login';
import Root from '../pages/Root/Root';
import Error from '../pages/Error/Error';
import Donate from '../pages/Donate/Donate';
import ServerOffenses from '../pages/Home/ServerOffenses';

const forumLoader = () => {
  return redirect('https://forums.pgaming.net/index.php');
};

const forumApply = () =>{
  return redirect('https://forums.pgaming.net/index.php#factions.8');
}

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
        path: '/community',
        element: <Community />,
      },
      {
        path: '/staff',
        element: <Staff />,
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