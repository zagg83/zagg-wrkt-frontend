import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import { Link } from 'react-router-dom';

const MenuContainer = styled.div`
  padding: 1rem;
`;

const MenuTitle = styled.h2`
  color: white;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const MenuItem = styled.div`
  background-color: #1e1e1e;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: white;
  border: 2px solid #333;
  box-shadow: 0 4px 10px ${props => props.colors.main};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  transition: all 0.3s ease;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${props =>
      props.disabled ? '#333' : props.colors.secondary};
    transform: ${props => (props.disabled ? 'none' : 'scale(1.05)')};
    box-shadow: 0 6px 15px
      ${props => (props.disabled ? '#333' : props.colors.main + '60')};
  }
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: contents;
`;

const ComingSoonBadge = styled.div`
  background: #ff6b35;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  margin-left: auto;
`;

const MenuGrid = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  const menuItems = [
    { title: 'Templates', icon: '📋', color: '#4169E1', path: '/templates' },
    { title: 'Workout Log', icon: '📈', color: '#FFA500', path: '/workouts' },
    { title: 'Ranks', icon: '🏆', color: '#9370DB', path: '/ranks' },
    { title: 'Stats', icon: '📊', color: '#3CB371', path: '/stats' },
  ];

  return (
    <MenuContainer>
      <MenuTitle>Menu</MenuTitle>
      <Grid>
        {menuItems.map((item, index) => (
          <StyledLink to={item.path} key={index}>
            <MenuItem colors={colors}>
              <Icon color={item.color}>{item.icon}</Icon>
              {item.title}
            </MenuItem>
          </StyledLink>
        ))}
      </Grid>
    </MenuContainer>
  );
};

export default MenuGrid;
