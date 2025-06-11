import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Home from './pages/Home';
import AddWorkout from './pages/AddWorkout';
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
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
