import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import AddWorkout from './pages/AddWorkout';
import WorkoutLog from './pages/WorkoutLog';
import WorkoutDetail from './pages/WorkoutDetail';
import Stats from './pages/Stats';
import { UserProvider } from './context/UserContext';
import { ErrorProvider } from './context/ErrorContext';
import Ranks from './pages/Ranks';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorProvider>
        <UserProvider>
          <Layout />
        </UserProvider>
      </ErrorProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'add-workout',
        element: <AddWorkout />,
      },
      {
        path: 'workouts',
        element: <WorkoutLog />,
      },
      {
        path: 'workouts/:workoutId',
        element: <WorkoutDetail />,
      },
      {
        path: 'stats',
        element: <Stats />,
      },
      {
        path: '/ranks',
        element: <Ranks />,
      },
      {
        path: '/templates',
        element: <Templates />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
