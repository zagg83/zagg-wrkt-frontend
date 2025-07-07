import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';

const ranks = [
  { name: 'Bronze', min: 0, max: 699, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', min: 700, max: 1299, color: '#c0c0c0', icon: '🥈' },
  { name: 'Gold', min: 1300, max: 1999, color: '#ffd700', icon: '🥇' },
  { name: 'Diamond', min: 2000, max: 2799, color: '#00bfff', icon: '💎' },
  { name: 'Master', min: 2800, max: 3799, color: '#8d6e63', icon: '👑' },
  { name: 'Grandmaster', min: 3800, max: 4999, color: '#e53935', icon: '🔥' },
  { name: 'Legend', min: 5000, max: Infinity, color: '#7c4dff', icon: '🌟' },
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

const Ranks = () => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  // Use user.last30DaysPoints or fallback to 0
  const userPoints = user?.last30DaysPoints ?? 0;
  // Try to get rank from user.rank, else calculate from points
  let userRank = ranks.find(r => userPoints >= r.min && userPoints <= r.max);
  if (user?.rank) {
    userRank =
      ranks.find(r => r.name.toLowerCase() === user.rank.toLowerCase()) ||
      userRank;
  }
  // Fallback if userRank is not found
  if (!userRank) userRank = ranks[0];

  return (
    <Container>
      <Title>🏆 Rank System</Title>
      <InfoNote>
        <b>How your rank works:</b>
        <br />
        Your rank is based on the <b>points you earned in the last 30 days</b>.
        {expanded ? (
          <>
            <br />
            <br />
            Only your recent activity counts toward your rank—just like the
            rolling ranking system in professional tennis.
            <br />
            <br />
            <b>
              As time passes, points you earned more than a month ago will
              automatically drop out of your total.
            </b>{' '}
            To maintain or improve your rank, keep working out and earning new
            points! This system rewards consistent effort and helps you track
            your current fitness momentum, not just your all-time history.
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
