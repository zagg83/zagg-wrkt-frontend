import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%,0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
`;

const ErrorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  width: 90%;
  max-width: 600px;
  background: linear-gradient(to right, #ff4444, #cc0000);
  color: white;
  padding: 1rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 15px rgba(204, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  z-index: 1000;
  animation: ${props => (props.isClosing ? slideUp : slideDown)} 0.5s ease
    forwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 0 0 12px 12px;
  }
`;

const Message = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(180deg) scale(0.9);
  }
`;

const ErrorMessage = ({ message, onClose, duration = 5000, isClosing }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ErrorContainer isClosing={isClosing}>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>×</CloseButton>
    </ErrorContainer>
  );
};

export default ErrorMessage;
