import React from 'react'
import styled from 'styled-components'

const MenuContainer = styled.div`
  padding: 1rem;
`

const MenuTitle = styled.h2`
  color: white;
  margin-bottom: 1rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`

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
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    transform: scale(1.05);
    box-shadow:
      0 8px 25px rgba(255, 215, 0, 0.4),
      0 0 40px rgba(255, 215, 0, 0.3);
  }
`

const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MenuGrid = () => {
  const menuItems = [
    { title: 'Templates', icon: '📋', color: '#4169E1' },
    { title: 'Workout Log', icon: '📈', color: '#FFA500' },
    { title: 'Ranks', icon: '🏆', color: '#9370DB' },
    { title: 'Stats', icon: '📊', color: '#3CB371' },
  ]

  return (
    <MenuContainer>
      <MenuTitle>Menu</MenuTitle>
      <Grid>
        {menuItems.map((item, index) => (
          <MenuItem key={index}>
            <Icon color={item.color}>{item.icon}</Icon>
            {item.title}
          </MenuItem>
        ))}
      </Grid>
    </MenuContainer>
  )
}

export default MenuGrid
