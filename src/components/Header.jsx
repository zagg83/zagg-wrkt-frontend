import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';

const HeaderContainer = styled.div`
  background-color: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem;
  border: 1px solid ${props => props.colors.secondary};
  box-shadow: 0 0 15px ${props => props.colors.main}40;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
`;

const Greeting = styled.div`
  h1 {
    font-size: 1.5rem;
    margin: 0;
    span {
      color: ${props => props.colors.main};
      text-shadow: 0 0 10px ${props => props.colors.main}40;
    }
  }
`;

const RankBadge = styled.div`
  background: ${props => props.colors.gradient};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 0 15px ${props => props.colors.main}40;
  border: 2px solid ${props => props.colors.secondary};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.89) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 50%
    );
    transform: rotate(-45deg);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-50%) rotate(-45deg);
    }
    50% {
      transform: translateX(150%) rotate(-45deg);
    }
    100% {
      transform: translateX(-50%) rotate(-45deg);
    }
  }
`;

const Header = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  const username = user.name;
  const rank = user.rank;

  return (
    <HeaderContainer colors={colors}>
      <UserInfo>
        <ProfileSection>
          <ProfilePic />
          <Greeting colors={colors}>
            <h1>
              Hello <span>{username}</span>
            </h1>
          </Greeting>
        </ProfileSection>
        <RankBadge colors={colors}>{rank}</RankBadge>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;
