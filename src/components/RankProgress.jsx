import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';

const ranks = [
  { name: 'Bronze', min: 0, max: 499, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', min: 500, max: 749, color: '#a8a8a8', icon: '🥈' },
  { name: 'Gold', min: 750, max: 999, color: '#ffd700', icon: '🥇' },
  { name: 'Diamond', min: 1000, max: 1499, color: '#00bfff', icon: '💎' },
  { name: 'Master', min: 1500, max: 1999, color: '#8d6e63', icon: '👑' },
  { name: 'Grandmaster', min: 2000, max: 2499, color: '#e53935', icon: '🔥' },
  { name: 'Legend', min: 2500, max: Infinity, color: '#7c4dff', icon: '🌟' },
];

const Container = styled.div`
  padding: 0.5rem 1rem 1rem 1rem;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PointsInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 65px;
`;

const PointsText = styled.span`
  font-size: 0.85rem;
  color: #bbb;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.color} 0%,
    ${props => props.color}dd 100%
  );
  border-radius: 3px;
  transition: width 0.6s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

const NextRankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 75px;
`;

const NextRankName = styled.span`
  font-size: 0.85rem;
  color: ${props => props.color};
  font-weight: 500;
`;

const NextRankIcon = styled.span`
  font-size: 1rem;
`;

const RankProgress = () => {
  const { user } = useUser();
  const userPoints = user?.rating ?? 0;
  console.log(user);
  // Find current rank
  let userRank = ranks.find(r => userPoints >= r.min && userPoints <= r.max);
  if (user?.rank) {
    userRank =
      ranks.find(r => r.name.toLowerCase() === user.rank.toLowerCase()) ||
      userRank;
  }
  if (!userRank) userRank = ranks[0];

  // Calculate progress to next rank
  const currentRankIndex = ranks.findIndex(r => r.name === userRank.name);
  const nextRank =
    currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;

  let progressPercentage = 0;
  let pointsNeeded = 0;

  if (nextRank) {
    const pointsInCurrentRank = userPoints - userRank.min;
    const pointsNeededForNextRank = nextRank.min - userRank.min;
    progressPercentage = Math.min(
      (pointsInCurrentRank / pointsNeededForNextRank) * 100,
      100
    );
    pointsNeeded = nextRank.min - userPoints;
  }

  if (!nextRank) {
    return (
      <Container>
        <ProgressRow>
          <PointsInfo>
            <PointsText>{userPoints} pts</PointsText>
          </PointsInfo>
          <ProgressBar>
            <ProgressFill color={userRank.color} style={{ width: '100%' }} />
          </ProgressBar>
          <NextRankInfo>
            <NextRankIcon>{userRank.icon}</NextRankIcon>
            <NextRankName color={userRank.color}>{userRank.name}</NextRankName>
          </NextRankInfo>
        </ProgressRow>
      </Container>
    );
  }

  return (
    <Container>
      <ProgressRow>
        <PointsInfo>
          <PointsText>
            {userPoints}/{nextRank.min}
          </PointsText>
        </PointsInfo>
        <ProgressBar>
          <ProgressFill
            color={userRank.color}
            style={{ width: `${progressPercentage}%` }}
          />
        </ProgressBar>
        <NextRankInfo>
          <NextRankIcon>{nextRank.icon}</NextRankIcon>
          <NextRankName color={nextRank.color}>{nextRank.name}</NextRankName>
        </NextRankInfo>
      </ProgressRow>
    </Container>
  );
};

export default RankProgress;
