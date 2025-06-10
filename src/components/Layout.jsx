import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import BottomNav from './BottomNav'

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
`

const TopNav = styled.nav`
  background-color: #121212;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h1`
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
`

const ProfileButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #333;
  border: none;
  cursor: pointer;
`

const Layout = () => {
  return (
    <Container>
      <TopNav>
        <Title>Home</Title>
        <ProfileButton />
      </TopNav>
      <Outlet />
      <BottomNav />
    </Container>
  )
}

export default Layout
