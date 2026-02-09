import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getExerciseRank } from '../util/getExerciseRank';

export default function PRSetInfo({ prSet, onClose }) {
  const navigate = useNavigate();

  if (!prSet) return null;

  const templateName = prSet.exercise?.template?.name || 'Exercise';
  const workoutName = prSet.exercise?.workout?.name || 'Workout';
  const date = new Date(prSet.createdAt).toLocaleDateString();
  const isBodyweight = prSet.weight === 0;

  const rankInfo = getExerciseRank(prSet.points);

  return (
    <Overlay onClick={onClose}>
      <Modal rankColor={rankInfo.color} onClick={e => e.stopPropagation()}>
        <Header>
          <Title rankColor={rankInfo.color}>{rankInfo.rank} PR</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        <ExerciseName>{templateName}</ExerciseName>
        <SubText>Best recorded performance</SubText>

        <Stats>
          <Stat rankColor={rankInfo.color}>
            <Label>Reps</Label>
            <Value>{prSet.reps}</Value>
          </Stat>

          {!isBodyweight && (
            <Stat>
              <Label>Weight</Label>
              <Value>{prSet.weight} kg</Value>
            </Stat>
          )}

          <Stat highlight={true} rankColor={rankInfo.color}>
            <Label>Z-Points⚡</Label>
            <Value>{prSet.points}</Value>
          </Stat>
        </Stats>

        <Divider />

        <Meta>
          <MetaItem>
            <MetaLabel>Workout</MetaLabel>
            <MetaValue>{workoutName}</MetaValue>
          </MetaItem>

          <MetaItem>
            <MetaLabel>Date</MetaLabel>
            <MetaValue>{date}</MetaValue>
          </MetaItem>
        </Meta>
        <LinkButton
          rankColor={rankInfo.color}
          onClick={() => {
            navigate('/stats', {
              state: {
                fromWrktDetail: true,
                template: prSet.exercise.template,
              },
            });
          }}
        >
          View Exercise Stats →
        </LinkButton>
        <Footer>
          This is your strongest set logged for this exercise so far.
        </Footer>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Modal = styled.div`
  width: 340px;
  background: ${({ rankColor }) => `${rankColor}12`};
  border-radius: 18px;
  padding: 22px;
  color: white;
  border: 1px solid ${({ rankColor }) => `${rankColor}55`};
  box-shadow:
    0 0 25px ${({ rankColor }) => `${rankColor}44`},
    0 10px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ rankColor }) => rankColor};
  text-shadow: 0 0 10px ${({ rankColor }) => `${rankColor}66`};
  letter-spacing: 0.5px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const ExerciseName = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
`;

const SubText = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
  background: ${({ highlight, rankColor }) =>
    highlight ? `${rankColor}22` : '#1f1f1f'};
  border: 1px solid
    ${({ highlight, rankColor }) => (highlight ? `${rankColor}66` : '#2a2a2a')};
  border-radius: 12px;
  padding: 10px 6px;
  margin: 0 4px;
  box-shadow: ${({ highlight, rankColor }) =>
    highlight ? `0 0 10px ${rankColor}44` : 'none'};
  transition: all 0.25s ease;
`;

const Label = styled.div`
  font-size: 11px;
  color: #888;
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 2px;
`;

const Divider = styled.div`
  height: 1px;
  background: #2a2a2a;
  margin: 14px 0;
`;

const Meta = styled.div`
  font-size: 13px;
`;

const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const MetaLabel = styled.div`
  color: #888;
`;

const MetaValue = styled.div`
  font-weight: 500;
`;

const Footer = styled.div`
  font-size: 12px;
  color: #777;
  margin-top: 14px;
  text-align: center;
`;

const LinkButton = styled.button`
  margin-top: 12px;
  width: 100%;
  background: none;
  border: none;
  color: ${({ rankColor }) => rankColor};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ rankColor }) => `${rankColor}22`};
    box-shadow: 0 0 10px ${({ rankColor }) => `${rankColor}55`};
  }
`;
