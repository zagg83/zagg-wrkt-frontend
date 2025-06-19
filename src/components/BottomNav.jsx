import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';

const NavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  background-color: #1e1e1e;
  border-top: 1px solid #333;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
`;

const Nav = styled.nav`
  width: 100%;
  padding: 0.75rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const NavItem = styled(Link)`
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
`;

const AddButton = styled(Link)`
  text-decoration: none;
  background: ${props => props.colors.gradient};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 8px 2px ${props => props.colors.main}40,
    0 0 2px 0.5px ${props => props.colors.secondary};
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow:
      0 0 12px 4px ${props => props.colors.main}60,
      0 0 4px 1px ${props => props.colors.secondary};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const BottomNav = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  return (
    <NavWrapper>
      <Nav>
        <NavItem to="/">
          <IconWrapper>🏠</IconWrapper>
        </NavItem>
        <AddButton to="/add-workout" colors={colors}>
          <IconWrapper>+</IconWrapper>
        </AddButton>
        <NavItem to="/workouts">
          <IconWrapper>📅</IconWrapper>
        </NavItem>
      </Nav>
    </NavWrapper>
  );
};

export default BottomNav;
