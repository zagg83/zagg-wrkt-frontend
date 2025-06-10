import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';

const ProgressContainer = styled.div`
  background-color: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.color},
      transparent
    );
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '•';
    color: ${props => props.color};
    font-size: 2.5rem;
    line-height: 0;
    text-shadow: 0 0 10px ${props => props.color};
  }
`;

const ChartContainer = styled.div`
  height: 150px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 1rem 0;
`;

const Bar = styled.div`
  flex: 1;
  background-color: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px;
  transition: height 0.3s ease;
`;

const WeeklyProgress = () => {
  const { user } = useUser();
  const color = determineColor(user);
  const progressData = [
    { height: 30, color: '#E6A0FF' },
    { height: 20, color: '#E6A0FF' },
    { height: 40, color: '#E6A0FF' },
    { height: 60, color: '#FFB6C1' },
    { height: 80, color: '#90EE90' },
    { height: 90, color: '#90EE90' },
    { height: 85, color: '#90EE90' },
  ];

  return (
    <ProgressContainer color={color}>
      <Title color={color}>Weekly progress</Title>
      <ChartContainer>
        {progressData.map((data, index) => (
          <Bar key={index} height={data.height} color={data.color} />
        ))}
      </ChartContainer>
    </ProgressContainer>
  );
};

export default WeeklyProgress;
