import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';

const AddWorkout = React.lazy(() => import('./pages/AddWorkout'));
const WorkoutLog = React.lazy(() => import('./pages/WorkoutLog'));
const WorkoutDetail = React.lazy(() => import('./pages/WorkoutDetail'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Ranks = React.lazy(() => import('./pages/Ranks'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Login = React.lazy(() => import('./pages/Login'));
const Templates = React.lazy(() => import('./pages/Templates'));
const Settings = React.lazy(() => import('./pages/Settings'));
const VerifyNotice = React.lazy(() => import('./pages/VerifyNotice'));
const Verify = React.lazy(() => import('./pages/Verify'));
const ResendVerify = React.lazy(() => import('./pages/ResendVerify'));

import { UserProvider } from './context/UserContext';
import { ErrorProvider } from './context/ErrorContext';

const suspense = Component => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <Component />
  </React.Suspense>
);

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
        element: suspense(AddWorkout),
      },
      {
        path: 'workouts',
        element: suspense(WorkoutLog),
      },
      {
        path: 'workouts/:workoutId',
        element: suspense(WorkoutDetail),
      },
      {
        path: 'stats',
        element: suspense(Stats),
      },
      {
        path: '/ranks',
        element: suspense(Ranks),
      },
      {
        path: '/templates',
        element: suspense(Templates),
      },
      {
        path: '/settings',
        element: suspense(Settings),
      },
    ],
  },
  {
    path: 'login',
    element: suspense(Login),
  },
  {
    path: 'signup',
    element: suspense(Signup),
  },
  {
    path: 'verify-notice',
    element: suspense(VerifyNotice),
  },
  {
    path: 'verify/:token',
    element: suspense(Verify),
  },
  {
    path: 'resend-verification',
    element: suspense(ResendVerify),
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
