import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useUser } from '../context/UserContext';
import {
  format,
  getISOWeek,
  parseISO,
  getYear,
  subWeeks,
  startOfISOWeek,
  addWeeks,
  endOfISOWeek,
  differenceInCalendarISOWeeks,
} from 'date-fns';
import determineColor from '../util/determineColor';
import ExerciseStats from '../components/ExerciseStats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  padding: 2rem 1rem 4rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  color: white;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
  background: #23243a;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0002;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: #7ecfff;
  letter-spacing: 0.02em;
`;

const ChartWrapper = styled.div`
  width: 100%;
  min-height: 220px;
  margin-bottom: 1rem;
`;

const StatsTitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: 0.04em;
`;

const QuickInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 1.5rem;
  margin: 0 auto 2.2rem auto;
  max-width: 700px;
`;

const AllTimeBox = styled.div`
  background: #23243a;
  color: #fff;
  border-radius: 10px;
  padding: 1.1rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.13rem;
  box-shadow: 0 2px 10px #0002;
`;

const RankPointsBox = styled.div`
  background: ${({ color }) => `${color}22`};
  color: ${({ color }) => color};
  border-left: 5px solid ${({ color }) => color};
  border-radius: 10px;
  padding: 1.1rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.13rem;
  box-shadow: 0 2px 10px ${({ color }) => color}33;
`;

const PointsValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.2rem;
`;

const StatLabel = styled.span`
  font-size: 1.02rem;
  color: #aaa;
`;

const TOGGLE_ACTIVE_COLOR = '#00bcd4'; // Bright cyan accent
const TOGGLE_INACTIVE_BG = '#23243a';

const ViewToggle = styled.div`
  display: flex;
  background: #23243a;
  border-radius: 10px;
  margin: 0 auto 2.5rem auto;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
  min-width: 320px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props =>
    props.$isActive ? TOGGLE_ACTIVE_COLOR : TOGGLE_INACTIVE_BG};
  color: ${props => (props.$isActive ? 'white' : '#eee')};
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${props => (props.$isActive ? '0 2px 16px #00bcd455' : 'none')};
  border-right: 1.5px solid #29294a;
  &:last-child {
    border-right: none;
  }
  &:hover {
    background: ${props => (props.$isActive ? TOGGLE_ACTIVE_COLOR : '#2e2e4a')};
    color: white;
  }
`;

const Stats = () => {
  const { user } = useUser();
  const [weeklyBarData, setWeeklyBarData] = useState({
    labels: [],
    datasets: [],
  });
  const [allPointsLineData, setAllPointsLineData] = useState({
    labels: [],
    datasets: [],
  });
  const [allTimePoints, setAllTimePoints] = useState(0);
  const [page, setPage] = useState(0); // 0 = latest 6 weeks
  const [hasMore, setHasMore] = useState(false); // If there are more previous weeks
  const [loading, setLoading] = useState(false);
  const rankColor = determineColor(user).main;
  const [exercisePieData, setExercisePieData] = useState({
    labels: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core'],
    datasets: [
      {
        label: 'Exercise Distribution in Sets',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#FF6384', // Chest - pink
          '#36A2EB', // Back - blue
          '#FFCE56', // Shoulders - yellow
          '#4BC0C0', // Biceps - teal
          '#9966FF', // Triceps - purple
          '#FF9F40', // Legs - orange
          '#00C853', // Core - green
        ],
        borderWidth: 1,
      },
    ],
  });
  // State for bodyweight vs weight lifting pie
  const [typePieData, setTypePieData] = useState({
    labels: ['Bodyweight', 'Weight Lifting'],
    datasets: [
      {
        label: 'Type Distribution in Sets',
        data: [0, 0],
        backgroundColor: ['#FF9800', '#2196F3'],
        borderWidth: 1,
      },
    ],
  });
  const [typeNote, setTypeNote] = useState('');
  const [totalKgLifted, setTotalKgLifted] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [statsTab, setStatsTab] = useState('stats'); // 'stats' or 'exercise'

  const chartOptions = {
    plugins: {
      legend: { labels: { color: 'white' } },
      tooltip: {
        backgroundColor: '#23243a',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255,255,255,0.8)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
      },
      y: {
        ticks: { color: 'rgba(255,255,255,0.8)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  function aggregateWeeklyPoints(workouts) {
    const weekMap = {};
    let allPoints = 0;
    workouts.forEach(workout => {
      if (!workout.createdAt) return;
      const date = new Date(workout.createdAt);
      const week = getISOWeek(date);
      const year = getYear(date);
      const key = `${year}-W${week.toString().padStart(2, '0')}`;
      if (!weekMap[key]) weekMap[key] = 0;
      if (workout.exercises) {
        workout.exercises.forEach(ex => {
          if (ex.sets) {
            ex.sets.forEach(set => {
              weekMap[key] += set.points || 0;
              allPoints += set.points || 0;
            });
          }
        });
      }
    });
    return { weekMap, allPoints };
  }

  function buildCumulativePoints(workouts) {
    const weekMap = {};
    let cumulative = 0;
    const sorted = [...workouts].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    sorted.forEach(workout => {
      if (!workout.createdAt) return;
      const date = new Date(workout.createdAt);
      const week = getISOWeek(date);
      const year = getYear(date);
      const key = `${year}-W${week.toString().padStart(2, '0')}`;
      if (!weekMap[key]) weekMap[key] = 0;
      if (workout.exercises) {
        workout.exercises.forEach(ex => {
          if (ex.sets) {
            ex.sets.forEach(set => {
              cumulative += set.points || 0;
              weekMap[key] = cumulative;
            });
          }
        });
      }
    });
    return weekMap;
  }

  function buildWeeklyWindow(weekMap, latestDate, page, windowSize = 12) {
    let windowEnd = latestDate;
    let windowStart = subWeeks(windowEnd, windowSize - 1 + page * windowSize);
    windowEnd = subWeeks(windowEnd, page * windowSize);
    const weekLabels = [];
    const weekKeys = [];
    for (let i = windowSize - 1; i >= 0; i--) {
      const d = subWeeks(windowEnd, i);
      const year = getYear(d);
      const week = getISOWeek(d);
      weekKeys.push(`${year}-W${week.toString().padStart(2, '0')}`);
      const start = startOfISOWeek(d);
      const end = endOfISOWeek(d);
      weekLabels.push(`${format(start, 'MMM d')}–${format(end, 'MMM d')}`);
    }
    return { weekLabels, weekKeys, windowStart };
  }

  function buildAllTimeLineData(weekMap) {
    const keys = Object.keys(weekMap).sort();
    const data = [];
    const labels = [];
    let lastValue = 0;
    let lastKey = null;
    function areConsecutiveWeeks(week1Str, week2Str) {
      const formatWeekStr = weekStr => `${weekStr}-1`;
      const week1Date = parseISO(formatWeekStr(week1Str));
      const week1Plus1 = addWeeks(week1Date, 1);
      const week1NextStr = format(week1Plus1, "RRRR-'W'II");
      return week2Str === week1NextStr;
    }
    function isoWeeksBetween(week1Str, week2Str) {
      const toWeekDate = weekStr => parseISO(`${weekStr}-1`);
      const date1 = toWeekDate(week1Str);
      const date2 = toWeekDate(week2Str);
      return differenceInCalendarISOWeeks(date2, date1);
    }
    function formatDateToIsoWeekEnd(dateInput) {
      const date = new Date(dateInput);
      const end = endOfISOWeek(date);
      return format(end, 'MMM d');
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (lastKey != null && !areConsecutiveWeeks(lastKey, key)) {
        const diff = isoWeeksBetween(lastKey, key) - 1;
        for (let j = 0; j < diff; j++) {
          lastValue = lastValue;
          data.push(lastValue);
          labels.push(
            formatDateToIsoWeekEnd(addWeeks(parseISO(`${key}-1`), j + 1))
          );
        }
      }
      lastValue = weekMap[key];
      data.push(lastValue);
      labels.push(formatDateToIsoWeekEnd(parseISO(`${key}-1`)));
      lastKey = key;
    }
    return {
      labels,
      datasets: [
        {
          label: 'Total Points',
          data,
          fill: false,
          borderColor: '#7ecfff',
          backgroundColor: '#7ecfff',
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
        },
      ],
    };
  }

  // Helper: Map categories to main muscle groups (legs unified)
  function getMainMuscleGroup(categories) {
    if (categories.includes('CHEST')) return 'Chest';
    if (categories.includes('BACK')) return 'Back';
    if (categories.includes('SHOULDERS')) return 'Shoulders';
    if (categories.includes('BICEPS')) return 'Biceps';
    if (categories.includes('TRICEPS')) return 'Triceps';
    if (
      categories.includes('QUADS') ||
      categories.includes('HAMSTRINGS') ||
      categories.includes('GLUTES') ||
      categories.includes('CALVES') ||
      categories.includes('LEGS')
    )
      return 'Legs';
    if (categories.includes('CORE')) return 'Core';
    return null;
  }

  useEffect(() => {
    const fetchAndAggregate = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const workouts = await response.json();

        const { weekMap, allPoints } = aggregateWeeklyPoints(workouts);
        setAllTimePoints(allPoints);

        let latestDate = new Date();
        if (Object.keys(weekMap).length > 0) {
          const latestKey = Object.keys(weekMap).sort().slice(-1)[0];
          const [latestYear, latestW] = latestKey.split('-W');
          latestDate = startOfISOWeek(new Date(Number(latestYear), 0, 1));
          latestDate = subWeeks(latestDate, -Number(latestW) + 1);
        }

        // Determine window size: min 6, max 12, or number of available weeks
        const numWeeks = Object.keys(weekMap).length;
        const windowSize = Math.max(6, Math.min(12, numWeeks));

        const { weekLabels, weekKeys, windowStart } = buildWeeklyWindow(
          weekMap,
          latestDate,
          page,
          windowSize
        );
        const weekData = weekKeys.map(w => weekMap[w] || 0);
        setWeeklyBarData({
          labels: weekLabels,
          datasets: [
            {
              label: 'Points',
              data: weekData,
              backgroundColor: '#42A5F5',
              borderRadius: 8,
            },
          ],
        });

        const cumulativeWeekMap = buildCumulativePoints(workouts);
        setAllPointsLineData(buildAllTimeLineData(cumulativeWeekMap));

        const allKeys = Object.keys(weekMap).sort();
        const firstKey = allKeys[0];
        if (firstKey) {
          const [firstYear, firstW] = firstKey.split('-W');
          const firstDate = startOfISOWeek(new Date(Number(firstYear), 0, 1));
          const firstWeekDate = subWeeks(firstDate, -Number(firstW) + 1);
          setHasMore(firstWeekDate < windowStart);
        } else {
          setHasMore(false);
        }

        // --- Exercise distribution logic ---
        const groupCounts = {
          Chest: 0,
          Back: 0,
          Shoulders: 0,
          Biceps: 0,
          Triceps: 0,
          Legs: 0,
          Core: 0,
        };
        workouts.forEach(workout => {
          if (!workout.exercises) return;
          workout.exercises.forEach(ex => {
            const categories = ex.template?.categories || [];
            if (!ex.sets) return;
            ex.sets.forEach(set => {
              const group = getMainMuscleGroup(categories);
              if (group && groupCounts[group] !== undefined) {
                groupCounts[group]++;
              }
            });
          });
        });
        setExercisePieData({
          labels: Object.keys(groupCounts),
          datasets: [
            {
              label: 'Exercise Distribution',
              data: Object.values(groupCounts),
              backgroundColor: [
                '#FF6384', // Chest - pink
                '#36A2EB', // Back - blue
                '#FFCE56', // Shoulders - yellow
                '#4BC0C0', // Biceps - teal
                '#9966FF', // Triceps - purple
                '#FF9F40', // Legs - orange
                '#00C853', // Core - green
              ],
              borderWidth: 1,
            },
          ],
        });

        // --- Bodyweight vs Weight Lifting pie logic ---
        let bodyweightCount = 0;
        let weightLiftingCount = 0;
        workouts.forEach(workout => {
          if (!workout.exercises) return;
          workout.exercises.forEach(ex => {
            const categories = ex.template?.categories || [];
            if (!ex.sets) return;
            ex.sets.forEach(set => {
              if (categories.includes('BODYWEIGHT')) bodyweightCount++;
              else if (categories.includes('WEIGHT_LIFTING'))
                weightLiftingCount++;
            });
          });
        });
        setTypePieData({
          labels: ['Bodyweight', 'Weight Lifting'],
          datasets: [
            {
              label: 'Type Distribution in Sets',
              data: [bodyweightCount, weightLiftingCount],
              backgroundColor: ['#FF9800', '#2196F3'],
              borderWidth: 1,
            },
          ],
        });
        if (bodyweightCount > weightLiftingCount) {
          setTypeNote("You're a calisthenics athlete! 🏃‍♂️");
        } else {
          setTypeNote("You're a Lifting Legend! 🏋️‍♂️");
        }

        // --- Interesting stats: total kg lifted, sets, reps ---
        let kgLifted = 0;
        let setsCount = 0;
        let repsCount = 0;
        workouts.forEach(workout => {
          if (!workout.exercises) return;
          workout.exercises.forEach(ex => {
            if (!ex.sets) return;
            ex.sets.forEach(set => {
              setsCount++;
              repsCount += set.reps || 0;
              if (set.weight && set.weight > 0 && set.reps && set.reps > 0) {
                kgLifted += set.weight * set.reps;
              }
            });
          });
        });
        setTotalKgLifted(kgLifted);
        setTotalSets(setsCount);
        setTotalReps(repsCount);
      } catch (err) {
        setWeeklyBarData({ labels: [], datasets: [] });
        setAllPointsLineData({ labels: [], datasets: [] });
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAndAggregate();
  }, [user, page]);

  return (
    <Container>
      <StatsTitle>📊 Your Workout Stats</StatsTitle>
      <QuickInfo>
        <AllTimeBox>
          <span
            role="img"
            aria-label="trophy"
            style={{ fontSize: '1.5rem', marginBottom: 4 }}
          >
            🏅
          </span>
          <StatLabel>All-time points</StatLabel>
          <PointsValue>{allTimePoints.toLocaleString()}</PointsValue>
        </AllTimeBox>
        <RankPointsBox color={rankColor}>
          <span
            role="img"
            aria-label="rank"
            style={{ fontSize: '1.5rem', marginBottom: 4 }}
          >
            🏆
          </span>
          <StatLabel>
            Rank-relevant points
            <br />
            <span
              style={{ fontSize: '0.95rem', color: rankColor, opacity: 0.7 }}
            >
              (last 30 days)
            </span>
          </StatLabel>
          <PointsValue>
            {user?.last30DaysPoints?.toLocaleString() ?? 0}
          </PointsValue>
        </RankPointsBox>
      </QuickInfo>
      <ViewToggle>
        <ToggleButton
          $isActive={statsTab === 'stats'}
          onClick={() => setStatsTab('stats')}
        >
          Stats
        </ToggleButton>
        <ToggleButton
          $isActive={statsTab === 'exercise'}
          onClick={() => setStatsTab('exercise')}
        >
          Exercise Stats
        </ToggleButton>
      </ViewToggle>
      {statsTab === 'stats' ? (
        <>
          <Section>
            <SectionTitle>Weekly Progress</SectionTitle>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore || loading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  border: 'none',
                  background: '#23243a',
                  color: '#7ecfff',
                  opacity: !hasMore || loading ? 0.5 : 1,
                  cursor: !hasMore || loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                &lt; Prev
              </button>
              <span style={{ color: '#ccc', fontSize: '1rem' }}>
                Page {page + 1}
              </span>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  border: 'none',
                  background: '#23243a',
                  color: '#7ecfff',
                  opacity: page === 0 || loading ? 0.5 : 1,
                  cursor: page === 0 || loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                Next &gt;
              </button>
            </div>
            <ChartWrapper style={{ height: 220 }}>
              <Bar data={weeklyBarData} options={chartOptions} />
            </ChartWrapper>
          </Section>
          <Section>
            <SectionTitle>All-Time Progress</SectionTitle>
            <ChartWrapper style={{ height: 220 }}>
              <Line data={allPointsLineData} options={chartOptions} />
            </ChartWrapper>
          </Section>
          <Section>
            <SectionTitle>Exercise Distribution</SectionTitle>
            <ChartWrapper
              style={{ height: 260, maxWidth: 400, margin: '0 auto' }}
            >
              <Pie data={exercisePieData} options={chartOptions} />
            </ChartWrapper>
          </Section>
          <Section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <SectionTitle style={{ marginBottom: 0 }}>
                Bodyweight vs. Weight Lifting
              </SectionTitle>
              {typeNote && (
                <span
                  style={{
                    fontSize: '0.98rem',
                    color: typeNote.includes('calisthenics')
                      ? '#FF9800'
                      : '#2196F3',
                    fontWeight: 500,
                    marginLeft: 16,
                    opacity: 0.85,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 6,
                    padding: '0.2rem 0.7rem',
                    boxShadow: '0 1px 4px #0001',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {typeNote}
                </span>
              )}
            </div>
            <ChartWrapper
              style={{ height: 220, maxWidth: 400, margin: '0 auto' }}
            >
              <Pie data={typePieData} options={chartOptions} />
            </ChartWrapper>
          </Section>
          <Section>
            <SectionTitle>Lifetime Totals</SectionTitle>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.2rem',
                justifyContent: 'center',
                alignItems: 'stretch',
                background:
                  'linear-gradient(120deg, #23243a 80%, #2a2a3a 100%)',
                borderRadius: 18,
                padding: '2rem 1.5rem',
                boxShadow: '0 6px 32px #0004',
                margin: '0 auto',
                maxWidth: 700,
                border: '1.5px solid #2e2f4a',
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 120,
                  textAlign: 'center',
                  background: 'rgba(66,165,245,0.08)',
                  borderRadius: 12,
                  padding: '1.1rem 0.5rem',
                  margin: '0 0.5rem',
                  boxShadow: '0 2px 8px #42A5F520',
                }}
              >
                <div style={{ fontSize: '2.1rem', marginBottom: 6 }}>🏋️‍♂️</div>
                <div
                  style={{
                    fontSize: '1.08rem',
                    color: '#7ecfff',
                    marginBottom: 2,
                    letterSpacing: 0.5,
                  }}
                >
                  Kg Lifted
                </div>
                <div
                  style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}
                >
                  {totalKgLifted.toLocaleString()}{' '}
                  <span
                    style={{
                      fontSize: '1.1rem',
                      color: '#7ecfff',
                      fontWeight: 500,
                    }}
                  >
                    kg
                  </span>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 120,
                  textAlign: 'center',
                  background: 'rgba(255,206,86,0.08)',
                  borderRadius: 12,
                  padding: '1.1rem 0.5rem',
                  margin: '0 0.5rem',
                  boxShadow: '0 2px 8px #FFCE5620',
                }}
              >
                <div style={{ fontSize: '2.1rem', marginBottom: 6 }}>📦</div>
                <div
                  style={{
                    fontSize: '1.08rem',
                    color: '#FFCE56',
                    marginBottom: 2,
                    letterSpacing: 0.5,
                  }}
                >
                  Total Sets
                </div>
                <div
                  style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}
                >
                  {totalSets.toLocaleString()}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 120,
                  textAlign: 'center',
                  background: 'rgba(0,200,83,0.08)',
                  borderRadius: 12,
                  padding: '1.1rem 0.5rem',
                  margin: '0 0.5rem',
                  boxShadow: '0 2px 8px #00C85320',
                }}
              >
                <div style={{ fontSize: '2.1rem', marginBottom: 6 }}>🔢</div>
                <div
                  style={{
                    fontSize: '1.08rem',
                    color: '#00C853',
                    marginBottom: 2,
                    letterSpacing: 0.5,
                  }}
                >
                  Total Reps
                </div>
                <div
                  style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}
                >
                  {totalReps.toLocaleString()}
                </div>
              </div>
            </div>
          </Section>
        </>
      ) : (
        <ExerciseStats />
      )}
    </Container>
  );
};

export default Stats;
