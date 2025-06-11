import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';

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
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.colors.secondary};
    transform: scale(1.05);
    box-shadow: 0 6px 15px ${props => props.colors.main}60;
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

const MenuGrid = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  const menuItems = [
    { title: 'Templates', icon: '📋', color: '#4169E1' },
    { title: 'Workout Log', icon: '📈', color: '#FFA500' },
    { title: 'Ranks', icon: '🏆', color: '#9370DB' },
    { title: 'Stats', icon: '📊', color: '#3CB371' },
  ];

  return (
    <MenuContainer>
      <MenuTitle>Menu</MenuTitle>
      <Grid>
        {menuItems.map((item, index) => (
          <MenuItem key={index} colors={colors}>
            <Icon color={item.color}>{item.icon}</Icon>
            {item.title}
          </MenuItem>
        ))}
      </Grid>
    </MenuContainer>
  );
};

export default MenuGrid;
