import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import BottomNav from './BottomNav';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import LogoInApp from '/LogoInApp.png';

const Container = styled.div`
  min-height: 100vh;
  background-color: #121212;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
`;

const TopNav = styled.nav`
  background-color: #121212;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ProfileButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  border: none;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
const PointsDisplay = styled.div`
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: none;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.8),
    0 1px 3px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: #0f0f0f;
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.9),
      0 2px 6px rgba(0, 0, 0, 0.7);
  }

  &::before {
    content: '⚡';
    font-size: 1rem;
    color: #888;
    font-weight: 500;
  }
`;

const PointsValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.1);
`;

const LevelDisplay = styled.div`
  background: ${props =>
    props.colors ? `${props.colors.main}15` : 'rgba(255, 255, 255, 0.12)'};
  border: 1px solid
    ${props =>
      props.colors ? `${props.colors.main}55` : 'rgba(255, 255, 255, 0.25)'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: ${props => (props.colors ? props.colors.main : '#f5f5f5')};
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: none;
  position: relative;
  overflow: hidden;
  box-shadow: ${props =>
    props.colors ? `0 0 12px ${props.colors.main}33` : 'none'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    transform 0.3s ease,
    background 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${props =>
      props.colors ? `${props.colors.main}25` : 'rgba(255, 255, 255, 0.18)'};
  }

  &::before {
    content: 'RATING';
    font-size: 0.8rem;
    opacity: 0.8;
    font-weight: 500;
  }
`;

const RatingValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => (props.colors ? props.colors.main : '#ffffff')};
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoImg = styled.img`
  height: 40px;
  width: auto;
  display: block;
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BrandText = styled.span`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: 'Comic Relief', 'Montserrat', 'Poppins', Arial, sans-serif;

  @media (max-width: 450px) {
    display: none;
  }
`;

const Layout = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  const xp = user?.zaggPoints || 0;
  const rating = user?.rating || 0;
  return (
    <Container>
      <TopNav>
        <BrandContainer>
          <LogoImg src={LogoInApp} alt="ZaggWrkt Logo" />
          <BrandText>ZaggAthletics</BrandText>
        </BrandContainer>
        <NavContent>
          <LevelDisplay colors={colors}>
            <RatingValue colors={colors}>{rating}</RatingValue>
          </LevelDisplay>
          <PointsDisplay>
            <PointsValue>{xp.toLocaleString()}</PointsValue>
          </PointsDisplay>
          <ProfileButton to={'/settings'}>
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}&backgroundColor=${colors.secondary.replace(/^#/, '')}&textColor=${colors.secondary}`}
              alt="Profile"
            />
          </ProfileButton>
        </NavContent>
      </TopNav>
      <Outlet />
      <BottomNav />
    </Container>
  );
};

export default Layout;
