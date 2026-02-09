import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

export default function WeeklyReportModal({ report, onClose }) {
  const [displayRating, setDisplayRating] = useState(report.ratingBefore);
  const isRankUp = report.rankAfter !== report.rankBefore;

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value =
        report.ratingBefore +
        (report.ratingAfter - report.ratingBefore) * progress;
      setDisplayRating(Math.round(value));

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [report.ratingAfter, report.ratingBefore]);

  const progressPercent = Math.min((displayRating % 500) / 5, 100);

  return (
    <Overlay>
      <Modal>
        <Title>Weekly Report</Title>
        <Sub>Week of {new Date(report.weekStart).toLocaleDateString()}</Sub>

        <Section>
          <Row>
            <span>Rating</span>
            <RatingChange positive={report.ratingChange >= 0}>
              {report.ratingChange >= 0 ? '+' : ''}
              {report.ratingChange}
            </RatingChange>
          </Row>

          <ProgressBar>
            <ProgressFill style={{ width: `${progressPercent}%` }} />
          </ProgressBar>

          <RatingText>{displayRating} pts</RatingText>
        </Section>

        <Section>
          <Row>
            <div>
              <Small>Rank</Small>
              <RankText>
                {report.rankBefore} → <Highlight>{report.rankAfter}</Highlight>
              </RankText>
            </div>

            {isRankUp && <RankUpBadge>🏆 RANK UP!</RankUpBadge>}
          </Row>
        </Section>

        <StatsGrid>
          <StatBox>
            <Small>Workouts</Small>
            <Big>{report.workoutsCount}</Big>
          </StatBox>
          <StatBox>
            <Small>Total Sets</Small>
            <Big>{report.totalSets}</Big>
          </StatBox>
          <StatBox>
            <Small>Volume</Small>
            <Big>{report.totalVolumePoints}</Big>
          </StatBox>
          <StatBox highlight>
            <Small>PRs</Small>
            <Big>{report.prCount}</Big>
          </StatBox>
          <StatBox>
            <Small>Consistency</Small>
            <Big>{report.consistencyRatio.toFixed(2)}</Big>
          </StatBox>
          <StatBox>
            <Small>Load</Small>
            <Big>{report.loadRatio.toFixed(2)}</Big>
          </StatBox>
        </StatsGrid>

        <CloseButton onClick={onClose}>Let’s Go 💪</CloseButton>
      </Modal>
    </Overlay>
  );
}
const popIn = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const rankPulse = keyframes`
  0% { transform: scale(0); }
  60% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Modal = styled.div`
  width: 420px;
  background: #121212;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #ff8c42;
  box-shadow: 0 0 30px rgba(255, 140, 66, 0.25);
  color: white;
  animation: ${popIn} 0.35s ease;
`;

const Title = styled.h2`
  color: #ff8c42;
  margin: 0 0 4px 0;
`;

const Sub = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  color: #aaa;
`;

const Section = styled.div`
  margin-bottom: 18px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Small = styled.p`
  font-size: 0.75rem;
  color: #888;
  margin: 0;
`;

const Big = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 4px 0 0 0;
`;

const RatingChange = styled.span`
  color: ${props => (props.positive ? '#4cd964' : '#ff4d4f')};
  font-weight: bold;
`;

const ProgressBar = styled.div`
  height: 14px;
  background: #222;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff8c42, #ffb347);
  transition: width 0.2s linear;
`;

const RatingText = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 4px;
`;

const RankText = styled.p`
  font-weight: bold;
  margin: 4px 0 0 0;
`;

const Highlight = styled.span`
  color: #ff8c42;
`;

const RankUpBadge = styled.div`
  color: gold;
  font-weight: bold;
  animation: ${rankPulse} 0.7s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 18px;
`;

const StatBox = styled.div`
  background: #1b1b1b;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid ${props => (props.highlight ? '#4cd964' : '#2a2a2a')};
`;

const CloseButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #ff8c42;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #ffa95e;
  }
`;
