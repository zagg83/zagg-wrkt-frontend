import React, { createContext, useContext, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';

const ErrorContext = createContext(null);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const showError = message => {
    setError(message);
    setIsClosing(false);
  };

  const hideError = () => {
    setIsClosing(true);
    setTimeout(() => {
      setError(null);
      setIsClosing(false);
    }, 500); // Match animation duration
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {error && (
        <ErrorMessage
          message={error}
          onClose={hideError}
          isClosing={isClosing}
        />
      )}
      {children}
    </ErrorContext.Provider>
  );
};
