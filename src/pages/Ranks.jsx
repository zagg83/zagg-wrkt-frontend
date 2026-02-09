import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';

const ranks = [
  { name: 'Bronze', min: 0, max: 499, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', min: 500, max: 749, color: '#c0c0c0', icon: '🥈' },
  { name: 'Gold', min: 750, max: 999, color: '#ffd700', icon: '🥇' },
  { name: 'Diamond', min: 1000, max: 1499, color: '#00bfff', icon: '💎' },
  { name: 'Master', min: 1500, max: 1999, color: '#8d6e63', icon: '👑' },
  { name: 'Grandmaster', min: 2000, max: 2499, color: '#e53935', icon: '🔥' },
  { name: 'Legend', min: 2500, max: Infinity, color: '#7c4dff', icon: '🌟' },
];

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 1rem 6rem 1rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
  letter-spacing: 0.04em;
`;

const Ladder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin: 2.5rem 0 2rem 0;
`;

const RankRow = styled.div`
  display: flex;
  align-items: center;
  background: ${({ active, color }) =>
    active
      ? `linear-gradient(90deg, ${color}33 0%, ${color}77 100%)`
      : '#23243a'};
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  box-shadow: ${({ active, color }) =>
    active ? `0 0 16px 2px ${color}99` : '0 2px 10px #0002'};
  border: ${({ active, color }) =>
    active ? `2px solid ${color}` : '2px solid #333'};
  font-size: 1.1rem;
  font-weight: ${({ active }) => (active ? 700 : 500)};
  color: ${({ active, color }) => (active ? color : '#fff')};
  transition: all 0.2s;
`;

const RankIcon = styled.span`
  font-size: 2.2rem;
  margin-right: 1.2rem;
`;

const RankName = styled.span`
  flex: 1;
  font-size: 1.2rem;
`;

const PointsRange = styled.span`
  font-size: 1rem;
  color: #ccc;
`;

const CurrentRankBox = styled.div`
  background: ${({ color }) => `${color}22`};
  border: 2px solid ${({ color }) => color};
  border-radius: 16px;
  padding: 2rem 1.5rem;
  margin-bottom: 2.5rem;
  text-align: center;
  box-shadow: 0 0 24px ${({ color }) => color}44;
`;

const CurrentRankTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ color }) => color};
  margin-bottom: 0.5rem;
`;

const CurrentPoints = styled.div`
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const InfoNote = styled.div`
  background: #23243a;
  color: #7ecfff;
  border-left: 5px solid #7ecfff;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin: 0 auto 2rem auto;
  max-width: 600px;
  font-size: 1.08rem;
  text-align: center;
`;

const ProgressContainer = styled.div`
  background: #23243a;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem auto;
  max-width: 600px;
  border: 1px solid #333;
`;

const ProgressTitle = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #1a1a1a;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.color} 0%,
    ${props => props.color}dd 100%
  );
  border-radius: 6px;
  transition: width 0.8s ease;
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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
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

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #ccc;
`;

const PointsNeeded = styled.span`
  color: ${props => props.color};
  font-weight: 600;
`;

const Ranks = () => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const userPoints = user?.rating ?? 0;
  // Try to get rank from user.rank, else calculate from points
  let userRank = ranks.find(r => userPoints >= r.min && userPoints <= r.max);
  if (user?.rank) {
    userRank =
      ranks.find(r => r.name.toLowerCase() === user.rank.toLowerCase()) ||
      userRank;
  }
  // Fallback if userRank is not found
  if (!userRank) userRank = ranks[0];

  // Calculate progress to next rank
  const currentRankIndex = ranks.findIndex(r => r.name === userRank.name);
  const nextRank =
    currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;

  let progressPercentage = 0;
  let pointsNeeded = 0;
  let progressText = "You've reached the highest rank! 🎉";

  if (nextRank) {
    const pointsInCurrentRank = userPoints - userRank.min;
    const pointsNeededForNextRank = nextRank.min - userRank.min;
    progressPercentage = Math.min(
      (pointsInCurrentRank / pointsNeededForNextRank) * 100,
      100
    );
    pointsNeeded = nextRank.min - userPoints;
    progressText = `${pointsNeeded} points needed for ${nextRank.name}`;
  }

  return (
    <Container>
      <Title>🏆 Rank System</Title>
      <InfoNote>
        <b>How your rank works:</b>
        <br />
        Your rank is based on your <b>weekly training performance</b>.
        {expanded ? (
          <>
            <br />
            <br />
            Every week, your workouts are analyzed and turned into a performance
            score. This score is based on three key factors:
            <br />
            <br />
            <b>Training Load</b> – How much quality work you completed
            <br />
            <b>Consistency</b> – How regularly you trained compared to previous
            weeks
            <br />
            <b>Personal Records</b> – New PRs give bonus impact
            <br />
            <br />
            <b>
              Your weekly score adjusts your rating, which determines your rank
              tier.
            </b>{' '}
            Train consistently and push your limits to climb higher. If your
            activity drops or you skip training for a while, your rank can go
            down — because it reflects your <b>current form</b>, not just past
            achievements.
            <br />
            <br />
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#7ecfff',
                cursor: 'pointer',
                fontSize: '1rem',
                textDecoration: 'underline',
                marginTop: '0.5rem',
              }}
              onClick={() => setExpanded(false)}
            >
              Show less
            </button>
          </>
        ) : (
          <>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#7ecfff',
                cursor: 'pointer',
                fontSize: '1rem',
                textDecoration: 'underline',
                marginLeft: '0.5rem',
              }}
              onClick={() => setExpanded(true)}
            >
              Read more...
            </button>
          </>
        )}
      </InfoNote>
      <CurrentRankBox color={userRank.color}>
        <CurrentRankTitle color={userRank.color}>
          Your Current Rank: {userRank.icon} {userRank.name}
        </CurrentRankTitle>
        <CurrentPoints>
          Points: <b>{userPoints}</b>
        </CurrentPoints>
        <PointsRange>
          ({userRank.min} - {userRank.max === Infinity ? '∞' : userRank.max}{' '}
          points)
        </PointsRange>
      </CurrentRankBox>

      {nextRank && (
        <ProgressContainer>
          <ProgressTitle>
            Progress to {nextRank.icon} {nextRank.name}
          </ProgressTitle>
          <ProgressBar>
            <ProgressFill
              color={nextRank.color}
              style={{ width: `${progressPercentage}%` }}
            />
          </ProgressBar>
          <ProgressText>
            <span>
              {userPoints} / {nextRank.min} points
            </span>
            <PointsNeeded color={nextRank.color}>
              {pointsNeeded} points needed
            </PointsNeeded>
          </ProgressText>
        </ProgressContainer>
      )}
      <h3
        style={{
          color: '#7ecfff',
          marginBottom: '1.2rem',
          textAlign: 'center',
        }}
      >
        Rank Ladder
      </h3>
      <Ladder>
        {ranks.map(rank => (
          <RankRow
            key={rank.name}
            active={userRank.name === rank.name}
            color={rank.color}
          >
            <RankIcon>{rank.icon}</RankIcon>
            <RankName>{rank.name}</RankName>
            <PointsRange>
              {rank.min} - {rank.max === Infinity ? '∞' : rank.max} pts
            </PointsRange>
          </RankRow>
        ))}
      </Ladder>
      <div
        style={{
          color: '#ccc',
          fontSize: '1.05rem',
          marginTop: '2rem',
          textAlign: 'center',
          paddingBottom: '2.5rem',
        }}
      >
        <b>How it works:</b> <br />
        Earn points by completing workouts. The more points you earn, the higher
        your rank! Each rank unlocks new badges and bragging rights.
      </div>
    </Container>
  );
};

export default Ranks;
