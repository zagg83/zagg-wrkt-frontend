import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  background: #23243a;
  border-radius: 16px;
  box-shadow: 0 4px 24px #0002;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  color: white;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
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

const DEFAULT_EXERCISE_NAME = 'Barbell Bench Press';

const ExerciseStats = () => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

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
      // Aggregate stats
      let totalSets = filteredSets.length;
      let totalReps = 0;
      let maxWeight = 0;
      let totalWeight = 0;
      let best1RM = 0;
      let lastPerformed = null;
      let mostReps = 0;
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
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch all exercises and pre-select default
  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line
  }, []);

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

  return (
    <Container>
      <Title>Exercise Stats</Title>
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
        <Title
          style={{
            fontSize: '1.15rem',
            marginBottom: 18,
            marginTop: 10,
            color: '#fff',
          }}
        >
          {activeExercise ? activeExercise.name : DEFAULT_EXERCISE_NAME}
        </Title>
        {stats ? (
          <StatGrid>
            {Object.entries(stats).map(([label, value], i) => (
              <StatCard key={i}>
                <StatValue>{value}</StatValue>
                <StatLabel>{label}</StatLabel>
              </StatCard>
            ))}
          </StatGrid>
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
