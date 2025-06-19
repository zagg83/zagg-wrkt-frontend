import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import AddWorkout from './pages/AddWorkout';
import WorkoutLog from './pages/WorkoutLog';
import WorkoutDetail from './pages/WorkoutDetail';
import { UserProvider } from './context/UserContext';
import { ErrorProvider } from './context/ErrorContext';

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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
