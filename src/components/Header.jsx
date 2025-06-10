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
  border: 1px solid rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);
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
      color: ${props => props.color};
    }
  }
`;

const RankBadge = styled.div`
  background-color: ${props => props.color};
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 0 15px ${props => props.color};
  border: 2px solid ${props => props.color};
  animation: glow 2s ease-in-out infinite;

  @keyframes glow {
    0% {
      box-shadow: 0 0 15px ${props => props.color}33;
    }
    50% {
      box-shadow: 0 0 40px ${props => props.color}88;
    }
    100% {
      box-shadow: 0 0 15px ${props => props.color}33;
    }
  }
`;

const Header = () => {
  const { user } = useUser();
  const color = determineColor(user);
  // This would come from your state management
  const username = user.name;
  const rank = user.rank;

  return (
    <HeaderContainer>
      <UserInfo>
        <ProfileSection>
          <ProfilePic />
          <Greeting color={color}>
            <h1>
              Hello <span>{username}</span>
            </h1>
          </Greeting>
        </ProfileSection>
        <RankBadge color={color}>{rank}</RankBadge>
      </UserInfo>
    </HeaderContainer>
  );
};
export default Header;
