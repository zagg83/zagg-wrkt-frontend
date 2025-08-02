import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Container = styled.div`
  padding: 1rem;
  padding-bottom: 70px;
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
  width: 80%;
`;

const SetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 60px;
  gap: 1rem;
  align-items: center;
  background: none;
  border-radius: 0;
  box-shadow: none;
  transition: none;
  cursor: default;
  min-height: 48px;
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
  background: ${props => props.colors.main}20;
  border: 1px solid ${props => props.colors.main}40;
  color: ${props => props.colors.main};
  border-radius: 6px;
  padding: 0.45rem 0.7rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.colors.main}30;
    border-color: ${props => props.colors.main}60;
    color: ${props => props.colors.main};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${props => props.colors.main}20;
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddExerciseButton = styled.button`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid ${props => props.colors?.main || '#6366f1'}40;
  color: white;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2rem auto 0 auto;
  display: block;
  width: fit-content;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.colors?.main || '#6366f1'}20,
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    border-color: ${props => props.colors?.main || '#6366f1'}80;
    background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.3),
      0 0 15px ${props => props.colors?.main || '#6366f1'}30;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const FinishButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.colors?.main || '#4CAF50'} 0%,
    ${props => props.colors?.secondary || '#45a049'} 100%
  );
  border: none;
  color: white;
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: 4rem;

  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #4caf50 100%);
    transform: translateY(-2px);
    box-shadow: 0 -6px 25px rgba(0, 0, 0, 0.4);
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

const PointsBadge = styled.span`
  display: inline-block;
  background: #23243a;
  color: #7ecfff;
  border-radius: 8px;
  padding: 0.18em 0.7em;
  font-size: 0.98em;
  font-weight: 600;
  margin-left: 0.5em;
  white-space: nowrap;
  vertical-align: middle;
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  background: #23243a;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 0.5em 1em;
  position: absolute;
  z-index: 10;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.95em;
  white-space: nowrap;
  box-shadow: 0 2px 8px #0006;
  transition: opacity 0.18s;
  pointer-events: none;
`;

const PointsBadgeWrapper = styled.span`
  position: relative;
  display: inline-block;
  animation: ${fadeInScale} 0.22s cubic-bezier(0.4, 0.8, 0.4, 1) both;
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

const SetUnit = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  margin-bottom: 0.5rem;
  padding: 0.2rem 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const LastWorkoutButton = styled.button`
  background: rgba(126, 207, 255, 0.13);
  border: 1.5px solid #7ecfff;
  color: #7ecfff;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  vertical-align: middle;
  transition:
    background 0.18s,
    color 0.18s,
    border-color 0.18s,
    box-shadow 0.18s;
  padding: 0.18em 0.45em 0.18em 0.35em;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 4px #7ecfff22;
  outline: none;
  &:hover,
  &:focus {
    background: #23243a;
    color: #fff;
    border-color: #fff;
    box-shadow: 0 2px 8px #7ecfff55;
  }
`;

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const { user, setUserState } = useUser();
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
  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  // Track which exercise is in comparison mode and its previous data
  const [comparisonExerciseId, setComparisonExerciseId] = useState(null);
  const [comparisonExerciseData, setComparisonExerciseData] = useState(null);

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

  // Save all pending changes to the database
  const savePendingChanges = useCallback(async () => {
    if (pendingChanges.size === 0 || isSaving) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const promises = Array.from(pendingChanges).map(async setId => {
        // Find the set data from the current workout state
        let setData = null;
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            if (set.id === setId) {
              setData = set;
            }
          });
        });
        if (!setData) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/sets/${setId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reps: setData.reps,
              weight: setData.weight,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to update set ${setId}`);
        }
      });

      await Promise.all(promises);
      setPendingChanges(new Set()); // Clear pending changes after successful save
    } catch (error) {
      console.error('Error saving pending changes:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, pendingChanges, workout, user.id]);

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

  async function fetchLastWorkoutEx(templateId, currExId) {
    try {
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);
      let url = `${import.meta.env.VITE_API_URL}/users/${user.id}/exercises`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const exercises = await response.json();
      let isNext = false;
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        if (isNext) {
          if (exercise.template.id === templateId) {
            if (exercise.sets && exercise.sets.length > 0) {
              exercise.sets = [...exercise.sets].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              );
            }
            return exercise;
          }
        }
        if (exercise.id == currExId) {
          isNext = true;
        }
      }
      return null;
    } catch (error) {}
  }

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

      const newExercise = await res.json();

      // Update local state immediately for better UX
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: [...prevWorkout.exercises, newExercise],
      }));

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

      // Update local state immediately for better UX
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: prevWorkout.exercises.filter(
          exercise => exercise.id !== exerciseId
        ),
      }));
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

      const newSet = await res.json();

      // Update local state immediately for better UX
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: prevWorkout.exercises.map(exercise =>
          exercise.id === exerciseId
            ? { ...exercise, sets: [...exercise.sets, newSet] }
            : exercise
        ),
      }));
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

      // Update local state immediately for better UX
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: prevWorkout.exercises.map(exercise =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.filter(set => set.id !== setId),
              }
            : exercise
        ),
      }));
    } catch (error) {
      console.error('Error removing set:', error);
    }
  };

  // Handle input blur events - update set values when user finishes editing
  const handleInputBlur = async (setId, field, value) => {
    try {
      // Clean up the value (remove leading zeros, convert to number)
      let cleanValue = value;
      if (value && value.length >= 2 && value[0] === '0') {
        cleanValue = value.slice(1);
      }
      cleanValue = parseInt(cleanValue) || 0;

      // Update local state immediately for better UX
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: prevWorkout.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set =>
            set.id === setId ? { ...set, [field]: cleanValue } : set
          ),
        })),
      }));

      // Save immediately for better reliability
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
            [field]: cleanValue,
          }),
        }
      );
      if (!res.ok) {
        throw new Error('Failed to update set');
      }
      const updatetSet = await res.json();
      // Now with new points too
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exercises: prevWorkout.exercises.map(exercise => ({
          ...exercise,
          sets: exercise.sets.map(set =>
            set.id === setId ? { ...set, points: updatetSet.points } : set
          ),
        })),
      }));

      // Remove from pending changes after successful save
      setPendingChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(setId);
        return newSet;
      });
      setUserState();
    } catch (error) {
      console.error('Error updating set:', error);
      // If the API call fails, we could revert the local state here
      // For now, we'll just log the error
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

  // Save pending changes when component unmounts
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (pendingChanges.size > 0) {
        // Try to save synchronously before unload
        savePendingChanges();
        // Show a warning to the user
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save any remaining changes when component unmounts
      if (pendingChanges.size > 0) {
        savePendingChanges();
      }
    };
  }, [pendingChanges, savePendingChanges]);

  // Toggle comparison mode for an exercise and fetch previous data
  async function handleShowLastWorkout(templateId, currExId) {
    if (comparisonExerciseId === currExId) {
      setComparisonExerciseId(null);
      setComparisonExerciseData(null);
      return;
    }
    const prev = await fetchLastWorkoutEx(templateId, currExId);
    setComparisonExerciseId(currExId);
    setComparisonExerciseData(prev);
  }

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
          {pendingChanges.size > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                color: 'white',
                fontSize: '0.9rem',
                opacity: 0.8,
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              {isSaving
                ? 'Saving...'
                : `${pendingChanges.size} change${pendingChanges.size > 1 ? 's' : ''} pending`}
            </div>
          )}
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
                <svg
                  fill="#000000"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path>
                  </g>
                </svg>
              </RemoveExerciseButton>
              <ExerciseName>
                {exercise.template.name}
                <LastWorkoutButton
                  title="Show last workout for comparison"
                  onClick={() =>
                    handleShowLastWorkout(exercise.template.id, exercise.id)
                  }
                >
                  <svg
                    fill="#ffffff"
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    id="Outline"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'inline', verticalAlign: 'middle' }}
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>194 restore</title>
                      <path d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z M23.812,10.132A12,12,0,0,0,3.578,3.415V1a1,1,0,0,0-2,0V5a2,2,0,0,0,2,2h4a1,1,0,0,0,0-2H4.827a9.99,9.99,0,1,1-2.835,7.878A.982.982,0,0,0,1,12a1.007,1.007,0,0,0-1,1.1,12,12,0,1,0,23.808-2.969Z"></path>
                    </g>
                  </svg>
                </LastWorkoutButton>
              </ExerciseName>
              <SetList>
                <SetRow
                  style={{
                    background: 'none',
                    borderRadius: 0,
                    boxShadow: 'none',
                    cursor: 'default',
                    minHeight: 'auto',
                    pointerEvents: 'none',
                  }}
                >
                  <Label>Set</Label>
                  <Label>Reps</Label>
                  <Label>Weight (kg)</Label>
                  <Label></Label>
                </SetRow>

                {exercise.sets.map((set, index) => (
                  <SetUnit key={index}>
                    <SetRow>
                      <Label>{index + 1}</Label>
                      {comparisonExerciseId === exercise.id ? (
                        <>
                          <div
                            style={{
                              background: '#222',
                              borderRadius: '8px',
                              height: '2.2em',
                              width: '100%',
                              margin: '0 0.5em',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#888',
                              fontSize: '1em',
                              fontStyle: 'italic',
                            }}
                          >
                            {comparisonExerciseData &&
                            comparisonExerciseData.sets &&
                            comparisonExerciseData.sets[index] &&
                            typeof comparisonExerciseData.sets[index].reps ===
                              'number'
                              ? comparisonExerciseData.sets[index].reps
                              : '--'}
                          </div>
                          <div
                            style={{
                              background: '#222',
                              borderRadius: '8px',
                              height: '2.2em',
                              width: '100%',
                              margin: '0 0.5em',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#888',
                              fontSize: '1em',
                              fontStyle: 'italic',
                            }}
                          >
                            {comparisonExerciseData &&
                            comparisonExerciseData.sets &&
                            comparisonExerciseData.sets[index] &&
                            typeof comparisonExerciseData.sets[index].weight ===
                              'number'
                              ? comparisonExerciseData.sets[index].weight
                              : '--'}
                          </div>
                        </>
                      ) : (
                        <>
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={set.reps || ''}
                            onChange={e => {
                              setWorkout(prevWorkout => ({
                                ...prevWorkout,
                                exercises: prevWorkout.exercises.map(ex => ({
                                  ...ex,
                                  sets: ex.sets.map(s =>
                                    s.id === set.id
                                      ? {
                                          ...s,
                                          reps: parseInt(e.target.value) || 0,
                                        }
                                      : s
                                  ),
                                })),
                              }));
                              setPendingChanges(
                                prev => new Set([...prev, set.id])
                              );
                            }}
                            onBlur={e =>
                              handleInputBlur(set.id, 'reps', e.target.value)
                            }
                            colors={colors}
                          />
                          <Input
                            type="number"
                            placeholder="Weight"
                            value={set.weight || ''}
                            onChange={e => {
                              setWorkout(prevWorkout => ({
                                ...prevWorkout,
                                exercises: prevWorkout.exercises.map(ex => ({
                                  ...ex,
                                  sets: ex.sets.map(s =>
                                    s.id === set.id
                                      ? {
                                          ...s,
                                          weight: parseInt(e.target.value) || 0,
                                        }
                                      : s
                                  ),
                                })),
                              }));
                              setPendingChanges(
                                prev => new Set([...prev, set.id])
                              );
                            }}
                            onBlur={e =>
                              handleInputBlur(set.id, 'weight', e.target.value)
                            }
                            colors={colors}
                          />
                        </>
                      )}
                      <RemoveSetButton
                        onClick={e => {
                          e.stopPropagation();
                          handleRemoveSet(exercise.id, set.id);
                        }}
                      >
                        ×
                      </RemoveSetButton>
                    </SetRow>
                    {/* Show points badge for old set in comparison mode */}
                    {comparisonExerciseId === exercise.id ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '0.2em',
                        }}
                      >
                        <PointsBadge
                          style={{
                            background: '#444', // darker gray background
                            color: '#bbb', // muted text color
                            border: '1px solid #666',
                            opacity: 0.85,
                          }}
                        >
                          <span
                            role="img"
                            aria-label="points"
                            style={{
                              marginRight: '0.3em',
                              fontSize: '1em',
                              verticalAlign: 'middle',
                            }}
                          >
                            🏆
                          </span>
                          {comparisonExerciseData &&
                          comparisonExerciseData.sets &&
                          comparisonExerciseData.sets[index] &&
                          comparisonExerciseData.sets[index].points !==
                            undefined &&
                          comparisonExerciseData.sets[index].points !== null
                            ? `+${comparisonExerciseData.sets[index].points}`
                            : '+0'}
                        </PointsBadge>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '0.2em',
                        }}
                      >
                        <PointsBadge>
                          <span
                            role="img"
                            aria-label="points"
                            style={{
                              marginRight: '0.3em',
                              fontSize: '1em',
                              verticalAlign: 'middle',
                            }}
                          >
                            🏆
                          </span>
                          {set.points !== undefined && set.points !== null
                            ? `+${set.points}`
                            : '+0'}
                        </PointsBadge>
                      </div>
                    )}
                  </SetUnit>
                ))}
                <AddSetButton
                  onClick={() => handleAddSet(exercise.id)}
                  colors={colors}
                >
                  <span role="img" aria-label="add set">
                    ➕
                  </span>
                  Add Set
                </AddSetButton>
              </SetList>
            </ExerciseCard>
          ))}
          <AddExerciseButton
            onClick={() => setShowExercisePicker(true)}
            colors={colors}
          >
            <span role="img" aria-label="add exercise">
              🏋️
            </span>
            Add Exercise
          </AddExerciseButton>
        </ExerciseList>
      </ContentWrapper>

      <FinishButton onClick={() => navigate('/')} colors={colors}>
        <span role="img" aria-label="finish">
          ✅
        </span>
        Finish Workout
      </FinishButton>

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
