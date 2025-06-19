import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import { jwtDecode } from 'jwt-decode';

const float = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
`;

const Container = styled.div`
  padding: 1rem;
  padding-bottom: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  position: relative;
  overflow-y: scroll;
`;

const BackgroundEffect = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s linear infinite;
  left: ${props => props.left}%;
  top: ${props => props.top}%;
  opacity: 0;
  box-shadow: 0 0 8px ${props => props.color};
`;

const ContentWrapper = styled.div`
  position: relative;
`;

const Header = styled.div`
  position: relative;
  padding: 2rem 1rem;
  margin: -1rem -1rem 2rem -1rem;
  background: ${props => props.colors.gradient};
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const WorkoutTitle = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ExerciseCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ExerciseName = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const SetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.colors.main};
    box-shadow: 0 0 0 2px ${props => props.colors.main}40;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
`;

const AddSetButton = styled.button`
  background: ${props => props.colors.main};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(AddSetButton)`
  background: ${props => props.colors.secondary};
  margin-top: 2rem;
  font-weight: 600;
`;

const RemoveSetButton = styled.button`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    background: rgba(255, 68, 68, 0.2);
    border-color: rgba(255, 68, 68, 0.5);
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(255, 68, 68, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RemoveExerciseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%);
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ExercisePickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ExercisePickerModal = styled.div`
  background: #1a1a1a;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
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
  flex-direction: column;
  gap: 0.75rem;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #2a2a2a;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
  }

  &:after {
    content: '›';
    margin-left: auto;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.color}15;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateX(4px);
    background-color: #333;

    &:before {
      transform: translateX(0);
    }

    &:after {
      transform: translateX(4px);
    }

    .icon {
      transform: scale(1.1) rotate(-5deg);
      box-shadow: 0 0 15px ${props => props.color}40;
    }
  }
`;

const ExercisePickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const ExerciseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #2a2a2a;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  color: white;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    background-color: #333;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const { user } = useUser();
  const colors = determineColor(user);
  const [particles, setParticles] = useState([]);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  // Add Exercise Functionality
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef(null);

  const categories = [
    { name: 'Upper Body', value: 'UPPER_BODY', icon: '💪', color: '#4CAF50' },
    { name: 'Lower Body', value: 'LOWER_BODY', icon: '🦵', color: '#F44336' },
    { name: 'Bodyweight', value: 'BODYWEIGHT', icon: '🏃', color: '#FF9800' },
    {
      name: 'Weight Lifting',
      value: 'WEIGHT_LIFTING',
      icon: '🏋️',
      color: '#2196F3',
    },
  ];

  useEffect(() => {
    // Create more particles with varied sizes and speeds
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 8, // Varied speeds
      color: colors.main,
    }));

    setParticles(newParticles);
  }, [colors]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts/${workoutId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch workout');
      }
      const data = await res.json();
      setWorkout(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [workoutId, user.id, refreshTrigger]);

  const refreshWorkout = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts/${workoutId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to delete workout');
      }
      navigate('/workouts');
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const fetchExercises = async (category, query = null) => {
    try {
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);
      let url = `${import.meta.env.VITE_API_URL}/users/${user.id}/templates/`;

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

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleCategoryClick = category => {
    setActiveCategory(category);
    fetchExercises(category.value);
  };

  const handleExerciseSelect = async exercise => {
    try {
      console.log(exercise);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/exercises`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            templateId: exercise.id,
            workoutId,
          }),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to add exercise');
      }
      refreshWorkout();
      setShowExercisePicker(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleRemoveExercise = async exerciseId => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/exercises/${exerciseId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to remove exercise');
      }
      refreshWorkout();
    } catch (error) {
      console.error('Error removing exercise:', error);
    }
  };

  const handleAddSet = async exerciseId => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/sets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reps: 0,
            weight: 0,
            exerciseId,
          }),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to add set');
      }
      refreshWorkout();
    } catch (error) {
      console.error('Error adding set:', error);
    }
  };

  const handleRemoveSet = async (exerciseId, setId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/sets/${setId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to remove set');
      }
      refreshWorkout();
    } catch (error) {
      console.error('Error removing set:', error);
    }
  };

  const handleSetChange = async (setId, weight, reps, exId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/sets/${setId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weight,
            reps,
          }),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update set');
      }
      const newEx = workout.exercises.map(ex => {
        if (ex.id === exId) {
          const newSets = ex.sets.map(set => {
            if (set.id === setId) {
              const res = { ...set };
              if (weight != null) {
                res.weight = weight || 0;
                if (weight.length >= 2 && weight[0] == '0') {
                  res.weight = weight.slice(1);
                }
              } else if (reps != null) {
                res.reps = reps || 0;
                if (reps.length >= 2 && reps[0] == '0') {
                  res.reps = reps.slice(1);
                }
              }
              return res;
            }
            return set;
          });
          return { ...ex, sets: newSets };
        }
        return ex;
      });
      setWorkout({ ...workout, exercises: newEx });
    } catch (error) {
      console.error('Error updating set:', error);
    }
  };

  const handleClickOutside = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowExercisePicker(false);
    }
  };

  useEffect(() => {
    if (showExercisePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExercisePicker]);

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <Header colors={colors}>
            <WorkoutTitle>Loading...</WorkoutTitle>
          </Header>
        </ContentWrapper>
      </Container>
    );
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving workout:', workout);
  };

  return (
    <Container>
      <BackgroundEffect>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            left={particle.left}
            top={particle.top}
            duration={particle.duration}
            color={particle.color}
          />
        ))}
      </BackgroundEffect>
      <ContentWrapper>
        <Header colors={colors}>
          <WorkoutTitle>{workout.name}</WorkoutTitle>
          <RemoveExerciseButton onClick={handleDeleteWorkout}>
            Delete Workout
          </RemoveExerciseButton>
        </Header>

        <ExerciseList>
          {workout.exercises.map(exercise => (
            <ExerciseCard key={exercise.id}>
              <RemoveExerciseButton
                onClick={() => handleRemoveExercise(exercise.id)}
              >
                Remove Exercise
              </RemoveExerciseButton>
              <ExerciseName>{exercise.template.name}</ExerciseName>
              <SetList>
                <SetRow>
                  <Label>Set</Label>
                  <Label>Reps</Label>
                  <Label>Weight (kg)</Label>
                  <Label></Label>
                </SetRow>
                {exercise.sets.map((set, index) => (
                  <SetRow key={index}>
                    <Label>{index + 1}</Label>
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={e =>
                        handleSetChange(
                          set.id,
                          null,
                          e.target.value,
                          exercise.id
                        )
                      }
                      colors={colors}
                    />
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={set.weight}
                      onChange={e =>
                        handleSetChange(
                          set.id,
                          e.target.value,
                          null,
                          exercise.id
                        )
                      }
                      colors={colors}
                    />
                    <RemoveSetButton
                      onClick={() => handleRemoveSet(exercise.id, set.id)}
                    >
                      ×
                    </RemoveSetButton>
                  </SetRow>
                ))}
                <AddSetButton
                  onClick={() => handleAddSet(exercise.id)}
                  colors={colors}
                >
                  + Add Set
                </AddSetButton>
              </SetList>
            </ExerciseCard>
          ))}
          <AddSetButton
            onClick={() => setShowExercisePicker(true)}
            colors={colors}
          >
            + Add Exercise
          </AddSetButton>
        </ExerciseList>
      </ContentWrapper>

      {showExercisePicker && (
        <ExercisePickerOverlay>
          <ExercisePickerModal ref={modalRef}>
            <CloseButton onClick={() => setShowExercisePicker(false)}>
              ×
            </CloseButton>
            <SearchBar>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    fetchExercises(null, e.target.value);
                  } else {
                    setExercises([]);
                  }
                }}
              />
            </SearchBar>

            {exercises.length === 0 ? (
              <CategoryList>
                {categories.map((category, index) => (
                  <CategoryButton
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    color={category.color}
                  >
                    <div
                      className="icon"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    {category.name}
                  </CategoryButton>
                ))}
              </CategoryList>
            ) : (
              <ExercisePickerList>
                {exercises.map((exercise, index) => (
                  <ExerciseButton
                    key={index}
                    onClick={() => handleExerciseSelect(exercise)}
                  >
                    {exercise.name}
                  </ExerciseButton>
                ))}
              </ExercisePickerList>
            )}
          </ExercisePickerModal>
        </ExercisePickerOverlay>
      )}
    </Container>
  );
};

export default WorkoutDetail;
