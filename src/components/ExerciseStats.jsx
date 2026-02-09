import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
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
import { getExerciseRank } from '../util/getExerciseRank';

const Container = styled.div`
  background: #23243a;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0002;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  color: white;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.h2`
  font-size: 1.4rem;
  color: #7ecfff;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1rem;
  input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2.5rem;
    background-color: #2a2a2a;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    &::placeholder {
      color: #666;
    }
  }
  &::after {
    content: '🔍';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 1.2rem;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background-color: #2a2a2a;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  .icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #23243a;
    font-size: 1.1rem;
  }
  &:hover {
    background-color: #333;
    box-shadow: 0 0 8px #7ecfff33;
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const ExerciseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #2a2a2a;
  border: 2px solid ${props => (props.selected ? '#7ecfff' : 'transparent')};
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  color: white;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  &:hover {
    background-color: #333;
    border-color: #7ecfff;
  }
`;

const StatGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: stretch;
`;

const StatCard = styled.div`
  background: #1e1e2e;
  border-radius: 12px;
  padding: 1.2rem 2rem;
  min-width: 160px;
  text-align: center;
  box-shadow: 0 2px 10px #0002;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #7ecfff;
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 1.05rem;
  color: #aaa;
`;

const categories = [
  {
    name: 'Push',
    value: 'CHEST,SHOULDERS,TRICEPS',
    icon: '🤜',
    color: '#4CAF50',
  },
  { name: 'Pull', value: 'BACK,BICEPS', icon: '🤛', color: '#2196F3' },
  {
    name: 'Legs',
    value: 'QUADS,HAMSTRINGS,GLUTES,CALVES',
    icon: '🦵',
    color: '#F44336',
  },
  { name: 'Core', value: 'CORE', icon: '🧘', color: '#FFB300' },
  { name: 'Bodyweight', value: 'BODYWEIGHT', icon: '🏃', color: '#FF9800' },
  {
    name: 'Weight Lifting',
    value: 'WEIGHT_LIFTING',
    icon: '🏋️',
    color: '#9C27B0',
  },
];
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

const PRDetailsCard = styled.div`
  background: #23243a;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 12px;
  color: #fff;
  box-shadow: 0 2px 10px #0002;
  text-align: center;
  border: 1px solid #2a2a2a;
  transition: all 0.3s ease;
  animation: fadeInScale 0.4s ease-out;

  &:hover {
    box-shadow: 0 4px 20px #0004;
    transform: translateY(-2px);
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const PRDetailsTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
  color: #7ecfff;
  letter-spacing: 0.5px;
`;

const PRDetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;

  &:not(:last-child) {
    border-bottom: 1px solid #2a2a2a;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
`;

const PRDetailsLabel = styled.span`
  color: #aaa;
  font-weight: 500;
`;

const PRDetailsValue = styled.span`
  font-weight: 600;
  color: #fff;
`;

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
      ticks: { color: 'rgba(255, 255, 255, 0.8)' },
      grid: { color: 'rgba(255, 255, 255, 0.08)' },
    },
    y: {
      ticks: { color: 'rgba(255,255,255,0.8)' },
      grid: { color: 'rgba(255, 255, 255, 0.08)' },
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

const DEFAULT_EXERCISE_NAME = 'Barbell Bench Press';

const ExerciseStats = ({ defaultEx }) => {
  const [prProgressChart, setPrProgressChart] = useState(null);
  const [selectedPrIndex, setSelectedPrIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [error, setError] = useState('');
  const [prSetInfo, setPrSetInfo] = useState(null);
  // On mount, fetch all exercises and pre-select default

  useEffect(() => {
    async function init() {
      await fetchExercises();
      console.log('default ex:', defaultEx);
      if (defaultEx) {
        setActiveExercise(defaultEx);
        await fetchStats(defaultEx);
      }
    }
    init();
  }, []);
  // Fetch exercises by category or search
  const fetchExercises = async (category, query = null) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      let url = `${import.meta.env.VITE_API_URL}/users/${userObj.id}/templates/`;
      if (query) {
        url += `?query=${query}`;
      } else if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      setExercises(data);
      // Pre-select default exercise on first load
      if (!activeExercise && !category && !query) {
        const defaultEx = data.find(ex => ex.name === DEFAULT_EXERCISE_NAME);
        if (defaultEx) {
          setActiveExercise(defaultEx);
          fetchStats(defaultEx);
        }
      }
    } catch (err) {
      setError('Could not load exercises');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all sets for selected exercise (by templateId)
  const fetchStats = async exercise => {
    setLoading(true);
    setError('');
    setPrSetInfo(null);
    console.log('exercise fro stats:', exercise);
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      // Fetch all sets for the user
      const url = `${import.meta.env.VITE_API_URL}/users/${userObj.id}/sets`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch sets');
      const allSets = await response.json();
      // Filter sets by selected templateId
      const filteredSets = allSets.filter(
        set =>
          set.exercise &&
          set.exercise.template &&
          set.exercise.template.id === exercise.id
      );
      console.log('exercise:', exercise);
      // Fetch PR set if available
      const prSetId = exercise?.stats?.[0]?.prSetId;
      if (prSetId) {
        try {
          const prSetRes = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${userObj.id}/sets/${prSetId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!prSetRes.ok) throw new Error('Failed to fetch PR set');
          const prSet = await prSetRes.json();
          setPrSetInfo(prSet);
        } catch (error) {
          setPrSetInfo(null);
          console.error('Error fetching PR set:', error);
        }
        const prSetsOverTime = allSets.filter(set => {
          if (!set.exercise || !set.exercise.template) return false;
          const isSameExercise = set.exercise.template.id === exercise.id;
          return set.isPR && isSameExercise;
        });
        // Prepare PR progress chart data for single chart
        if (prSetsOverTime.length > 0) {
          const prLabels = prSetsOverTime.map(set =>
            format(new Date(set.createdAt), 'M/d/yy')
          );
          setPrProgressChart({
            labels: prLabels,
            datasets: [
              {
                label: 'PR Points',
                data: prSetsOverTime.map(set => set.points),
                borderColor: '#7ecfff',
                backgroundColor: '#7ecfff33',
                tension: 0.3,
                pointRadius: 6,
                pointHoverRadius: 8,
                yAxisID: 'y',
              },
            ],
            prSets: prSetsOverTime,
          });
        } else {
          setPrProgressChart(null);
        }
        // Show latest PR as default
        setSelectedPrIndex(
          prSetsOverTime.length > 0 ? prSetsOverTime.length - 1 : null
        );
      }
      // Aggregate stats
      let totalSets = filteredSets.length;
      let totalReps = 0;
      let maxWeight = 0;
      let totalWeight = 0;
      let best1RM = 0;
      let lastPerformed = null;
      let mostReps = 0;
      // For charts:
      let repsArr = [];
      let pointsArr = [];
      let labels = [];

      filteredSets.forEach(set => {
        totalReps += set.reps || 0;
        if (set.weight > maxWeight) maxWeight = set.weight;
        if (set.weight && set.reps) totalWeight += set.weight * set.reps;
        if (set.weight > best1RM) best1RM = set.weight;
        if (set.reps > mostReps) mostReps = set.reps;
        if (
          !lastPerformed ||
          new Date(set.createdAt) > new Date(lastPerformed)
        ) {
          lastPerformed = set.createdAt;
        }
        repsArr.push(set.reps);
        pointsArr.push(set.points);
        labels.push(format(new Date(set.createdAt), 'M/d/yy'));
      });

      const isBodyWeight = exercise.categories.includes('BODYWEIGHT');
      setChartData({
        datasets: [
          {
            label: isBodyWeight ? 'Reps' : 'Points',
            data: isBodyWeight ? repsArr : pointsArr,
            backgroundColor: '#42A5F5',
            borderRadius: 8,
          },
        ],
        labels: labels,
      });
      setStats({
        'Most Reps in a Set': mostReps || '-',
        'Average Reps per Set': totalSets
          ? (totalReps / totalSets).toFixed(1)
          : '-',
        'Total Sets': totalSets,
        'Total Reps': totalReps,
        'Max Weight': maxWeight ? `${maxWeight} kg` : '-',
        'Total Weight Lifted': totalWeight
          ? `${totalWeight.toLocaleString()} kg`
          : '-',
        'Best 1RM': best1RM ? `${best1RM} kg` : '-',
        'Last Performed': lastPerformed
          ? new Date(lastPerformed).toLocaleDateString()
          : '-',
      });
    } catch (err) {
      setError('Could not load stats for this exercise');
      setStats(null);
      setPrSetInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = category => {
    setActiveCategory(category);
    setSearch('');
    setActiveExercise(null);
    setStats(null);
    fetchExercises(category.value);
  };

  // Handle exercise select
  const handleExerciseClick = exercise => {
    setActiveExercise(exercise);
    setStats(null);
    fetchStats(exercise);
  };

  // Handle search
  const handleSearch = e => {
    setSearch(e.target.value);
    setActiveCategory(null);
    setActiveExercise(null);
    setStats(null);
    if (e.target.value.trim().length > 0) {
      fetchExercises(null, e.target.value);
    } else {
      fetchExercises();
    }
  };
  const prRank = prSetInfo ? getExerciseRank(prSetInfo.points) : null;

  return (
    <Container>
      <Header>Exercise Stats</Header>
      <SearchBar>
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={handleSearch}
        />
      </SearchBar>
      {search.trim().length === 0 && !activeCategory && (
        <CategoryList>
          {categories.map((category, i) => (
            <CategoryButton
              key={i}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="icon" style={{ background: category.color }}>
                {category.icon}
              </span>
              {category.name}
            </CategoryButton>
          ))}
        </CategoryList>
      )}
      {(activeCategory || search.trim().length > 0) && (
        <ExerciseList>
          {loading && (
            <div style={{ color: '#7ecfff', padding: '1rem' }}>Loading...</div>
          )}
          {error && (
            <div style={{ color: '#ff4444', padding: '1rem' }}>{error}</div>
          )}
          {!loading && !error && exercises.length === 0 && (
            <div style={{ color: '#aaa', padding: '1rem' }}>
              No exercises found.
            </div>
          )}
          {exercises.map((exercise, i) => (
            <ExerciseButton
              key={i}
              selected={activeExercise && activeExercise.id === exercise.id}
              onClick={() => handleExerciseClick(exercise)}
            >
              {exercise.name}
            </ExerciseButton>
          ))}
        </ExerciseList>
      )}
      {/* Always render the output area, just update values */}
      <div style={{ minHeight: 240, marginTop: 24, position: 'relative' }}>
        <Header
          style={{
            fontSize: '1.15rem',
            marginBottom: 18,
            marginTop: 10,
            color: '#fff',
          }}
        >
          {activeExercise ? activeExercise.name : DEFAULT_EXERCISE_NAME}
        </Header>
        <div
          style={{
            background: prRank
              ? `${prRank.color}15` // faint tint
              : '#1e1e2e',
            borderRadius: 14,
            padding: '1.2rem 1.5rem',
            marginBottom: 24,
            boxShadow: prRank
              ? `0 0 18px ${prRank.color}55`
              : '0 2px 10px #0002',
            border: prRank
              ? `1px solid ${prRank.color}88`
              : '1px solid #2a2a2a',
            color: '#fff',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              fontSize: '1.1rem',
              marginBottom: 6,
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: 0.5,
              color: prRank ? prRank.color : '#7ecfff',
              textShadow: prRank ? `0 0 10px ${prRank.color}66` : 'none',
            }}
          >
            {prRank ? `${prRank.rank} PR` : 'Personal Record Set'}
          </div>
          {!prSetInfo ? (
            <div style={{ color: '#aaa', textAlign: 'center' }}>
              No PR set recorded yet for this exercise.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#23243a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 12,
                    padding: '10px 6px',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#aaa' }}>Reps</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                    {prSetInfo.reps ?? '-'}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#23243a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 12,
                    padding: '10px 6px',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#aaa' }}>Weight</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                    {typeof prSetInfo.weight === 'number'
                      ? prSetInfo.weight === 0
                        ? 'Bodyweight'
                        : `${prSetInfo.weight} kg`
                      : '-'}
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#7ecfff22',
                    border: '1px solid #7ecfff55',
                    borderRadius: 12,
                    padding: '10px 6px',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#aaa' }}>Points</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                    {prSetInfo.points ?? '-'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: '#2a2a2a',
                  margin: '12px 0',
                }}
              />
              <div style={{ fontSize: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ color: '#aaa' }}>Workout</div>
                  <div style={{ fontWeight: 500 }}>
                    {prSetInfo.exercise?.workout?.name ?? '-'}
                  </div>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ color: '#aaa' }}>Date</div>
                  <div style={{ fontWeight: 500 }}>
                    {prSetInfo.createdAt
                      ? new Date(prSetInfo.createdAt).toLocaleDateString()
                      : '-'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {stats ? (
          <>
            <StatGrid>
              {Object.entries(stats).map(([label, value], i) => (
                <StatCard key={i}>
                  <StatValue>{value}</StatValue>
                  <StatLabel>{label}</StatLabel>
                </StatCard>
              ))}
            </StatGrid>
            <Section>
              <SectionTitle>All-Time Progress</SectionTitle>
              <ChartWrapper style={{ height: 220 }}>
                <Line
                  data={prProgressChart || chartData}
                  options={{
                    ...chartOptions,
                    onClick: (event, elements) => {
                      if (elements && elements.length > 0 && prProgressChart) {
                        setSelectedPrIndex(elements[0].index);
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        position: 'left',
                        title: { display: true, text: 'Points' },
                      },
                    },
                  }}
                />
              </ChartWrapper>
              {selectedPrIndex !== null &&
                prProgressChart &&
                prProgressChart.prSets && (
                  <PRDetailsCard key={selectedPrIndex}>
                    <PRDetailsTitle>PR Details</PRDetailsTitle>
                    <PRDetailsRow>
                      <PRDetailsLabel>Date</PRDetailsLabel>
                      <PRDetailsValue>
                        {prProgressChart.labels[selectedPrIndex]}
                      </PRDetailsValue>
                    </PRDetailsRow>
                    <PRDetailsRow>
                      <PRDetailsLabel>Points</PRDetailsLabel>
                      <PRDetailsValue>
                        {prProgressChart.prSets[selectedPrIndex].points}
                      </PRDetailsValue>
                    </PRDetailsRow>
                    <PRDetailsRow>
                      <PRDetailsLabel>Reps</PRDetailsLabel>
                      <PRDetailsValue>
                        {prProgressChart.prSets[selectedPrIndex].reps}
                      </PRDetailsValue>
                    </PRDetailsRow>
                    <PRDetailsRow>
                      <PRDetailsLabel>Weight</PRDetailsLabel>
                      <PRDetailsValue>
                        {typeof prProgressChart.prSets[selectedPrIndex]
                          .weight === 'number'
                          ? prProgressChart.prSets[selectedPrIndex].weight === 0
                            ? 'Bodyweight'
                            : `${prProgressChart.prSets[selectedPrIndex].weight} kg`
                          : '-'}
                      </PRDetailsValue>
                    </PRDetailsRow>
                  </PRDetailsCard>
                )}
            </Section>
            <Section>
              <SectionTitle>All Sets Over Time</SectionTitle>
              <ChartWrapper style={{ height: 220 }}>
                <Line
                  data={chartData}
                  options={{
                    ...chartOptions,
                    interaction: {
                      intersect: false,
                      mode: 'index',
                    },
                    onHover: (event, activeElements) => {
                      event.native.target.style.cursor = 'default';
                    },
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        position: 'left',
                        title: {
                          display: true,
                          text: activeExercise?.categories?.includes(
                            'BODYWEIGHT'
                          )
                            ? 'Reps'
                            : 'Points',
                        },
                      },
                    },
                  }}
                />
              </ChartWrapper>
            </Section>
          </>
        ) : (
          <div
            style={{
              color: '#888',
              textAlign: 'center',
              fontSize: '1rem',
              marginTop: 32,
            }}
          >
            No stats found for this exercise.
          </div>
        )}
        {loading && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(35,36,58,0.85)',
              color: '#7ecfff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              zIndex: 2,
              borderRadius: 16,
            }}
          >
            Loading stats...
          </div>
        )}
      </div>
    </Container>
  );
};

export default ExerciseStats;
