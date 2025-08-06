import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressContainer = styled.div`
  background-color: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);

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
      ${props => props.colors.secondary},
      transparent
    );
    opacity: 0.8;
  }
`;

const TitleEl = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '•';
    color: ${props => props.colors.main};
    font-size: 2.5rem;
    line-height: 0;
    text-shadow: 0 0 10px ${props => props.colors.main}40;
  }
`;

const ChartWrapper = styled.div`
  height: 175px;
  position: relative;
  margin-top: 1rem;
`;

const PAGE_SIZE = 7;

const WeeklyProgress = () => {
  const { user } = useUser();
  const colors = determineColor(user);
  const [page, setPage] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [days, setDays] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [globalMax, setGlobalMax] = useState(0);
  const fetchedAllMax = useRef(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem('token');
        const offset = page * PAGE_SIZE;
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts?limit=${PAGE_SIZE}&offset=${offset}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const workouts = await response.json();
        // Sort by createdAt ascending (oldest first)
        const sorted = workouts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setIsLastPage(workouts.length < PAGE_SIZE);
        // Pad to always show 7 bars
        let padded = sorted;
        if (sorted.length < PAGE_SIZE) {
          const padCount = PAGE_SIZE - sorted.length;
          const empty = Array.from({ length: padCount }, () => ({
            createdAt: '',
            exercises: [],
            name: '',
          }));
          padded = [...empty, ...sorted];
        }
        // Points per workout
        const pointsPerWorkout = padded.map(workout => {
          let total = 0;
          if (workout.exercises) {
            workout.exercises.forEach(ex => {
              if (ex.sets) {
                ex.sets.forEach(set => {
                  total += set.points || 0;
                });
              }
            });
          }
          return total;
        });
        setWeeklyData(pointsPerWorkout);
        // Labels
        const labels = padded.map(w => {
          if (!w.createdAt) return '';
          const d = new Date(w.createdAt);
          return format(d, 'EEE, MMM d');
        });
        setDays(labels);
        setWorkoutNames(padded.map(w => w.name || ''));

        // Fetch all workouts once to determine global max
        if (!fetchedAllMax.current && user?.id) {
          fetchedAllMax.current = true;
          const allRes = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts?limit=1000&offset=0`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (allRes.ok) {
            const allWorkouts = await allRes.json();
            let maxPoints = 0;
            allWorkouts.forEach(w => {
              let total = 0;
              if (w.exercises) {
                w.exercises.forEach(ex => {
                  if (ex.sets) {
                    ex.sets.forEach(set => {
                      total += set.points || 0;
                    });
                  }
                });
              }
              if (total > maxPoints) maxPoints = total;
            });
            setGlobalMax(Math.ceil(maxPoints * 1.1)); // 10% headroom
          }
        }
      } catch (err) {
        setWeeklyData([]);
        setDays([]);
        setWorkoutNames([]);
        setIsLastPage(true);
      }
    };
    if (user?.id) fetchWorkouts();
  }, [user, page]);

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Points',
        data: weeklyData,
        backgroundColor: weeklyData.map(value => {
          if (value >= 500) return '#0D47A1'; // Very dark blue
          if (value >= 400) return '#1565C0'; // Dark blue
          if (value >= 300) return '#1E88E5'; // Blue
          if (value >= 200) return '#42A5F5'; // Medium blue
          if (value >= 100) return '#90CAF9'; // Light blue
          return '#E3F2FD'; // Very light blue
        }),
        borderColor: weeklyData.map(value => {
          if (value >= 500) return '#0D47A1'; // Very dark blue
          if (value >= 400) return '#1565C0'; // Dark blue
          if (value >= 300) return '#1E88E5'; // Blue
          if (value >= 200) return '#42A5F5'; // Medium blue
          if (value >= 100) return '#90CAF9'; // Light blue
          return '#E3F2FD'; // Very light blue
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: colors.main,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const idx = context.dataIndex;
            let label = `Points: ${context.parsed.y}`;
            if (workoutNames && workoutNames[idx]) {
              label += `\nWorkout: ${workoutNames[idx]}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12,
          },
        },
        beginAtZero: true,
        max: globalMax > 0 ? globalMax : undefined,
      },
    },
  };

  return (
    <ProgressContainer colors={colors}>
      <TitleEl colors={colors}>Points per Workout</TitleEl>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={isLastPage}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: 'none',
            background: colors.main,
            color: 'white',
            opacity: isLastPage ? 0.5 : 1,
            cursor: isLastPage ? 'not-allowed' : 'pointer',
          }}
        >
          &lt; Prev
        </button>
        <span style={{ color: '#ccc', fontSize: '1rem' }}>Page {page + 1}</span>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: 'none',
            background: colors.main,
            color: 'white',
            opacity: page === 0 ? 0.5 : 1,
            cursor: page === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Next &gt;
        </button>
      </div>
      <ChartWrapper>
        <Bar data={data} options={options} />
      </ChartWrapper>
    </ProgressContainer>
  );
};

export default WeeklyProgress;
