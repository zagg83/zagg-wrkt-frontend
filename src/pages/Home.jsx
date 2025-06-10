import React from 'react'
import styled from 'styled-components'
import Header from '../components/Header'
import WeeklyProgress from '../components/WeeklyProgress'
import MenuGrid from '../components/MenuGrid'

const HomeContainer = styled.div`
  background-color: #121212;
  padding-bottom: 80px; // Space for bottom nav
`

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <WeeklyProgress />
      <MenuGrid />
    </HomeContainer>
  )
}

export default Home
