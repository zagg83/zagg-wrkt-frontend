import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const setUserState = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const user = await res.json();
        console.log(user);
        if (decoded.exp * 1000 < Date.now()) {
          navigate('/login');
        } else {
          setUser(user);
        }
      } catch (error) {
        navigate('/login');
      }
    } else {
      console.log('nav to login');
      navigate('/login');
    }
  };

  useEffect(() => {
    setUserState();
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, setUserState }}>
      {user ? children : null}
    </UserContext.Provider>
  );
};
