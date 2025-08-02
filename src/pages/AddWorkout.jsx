import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import { useError } from '../context/ErrorContext';
import { useNavigate } from 'react-router-dom';
import CreateTemplate from '../components/CreateTemplate';

const Container = styled.div`
  background-color: #121212;
  padding: 1rem;
  padding-bottom: 80px;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const TemplateSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  background-color: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  margin-bottom: 0;
  height: 40px;
  display: flex;
  align-items: center;

  option {
    background-color: #2a2a2a;
    color: white;
  }
`;

const AddedExercises = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ExerciseTag = styled.div`
  background: ${props => props.colors.gradient};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px ${props => props.colors.main}40;
  border: 1px solid ${props => props.colors.secondary};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 50%
    );
    transform: rotate(-45deg);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.colors.main}60;

    &:before {
      animation: tagShine 1s forwards;
    }
  }

  @keyframes tagShine {
    to {
      transform: translateX(100%) rotate(-45deg);
    }
  }

  button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;selectedTemplateId
    z-index: 2;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: rotate(90deg);
    }

    &:active {
      transform: rotate(180deg) scale(0.9);
    }
  }
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

  &:active {
    transform: translateX(2px);
    .icon {
      transform: scale(0.95) rotate(-3deg);
    }
  }
`;

const ExerciseListContainer = styled.div`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 6px; /* Account for scrollbar width */
    height: 80px;
    background: linear-gradient(to bottom, rgba(18, 18, 18, 0), #121212);
    pointer-events: none;
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
  padding-bottom: 60px; /* Add padding to show content behind fade */

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
    display: block;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #444;
  }
`;

const ExerciseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #2a2a2a;
  border: 2px solid
    ${props => (props.isSelected ? props.colors.secondary : 'transparent')};
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

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.colors.gradient};
    opacity: ${props => (props.isSelected ? 0.1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateX(4px);
    background-color: #333;

    &:before {
      opacity: 0.05;
    }
  }

  &:active {
    transform: translateX(2px);
  }

  ${props =>
    props.isSelected &&
    `
    &:after {
      content: '✓';
      position: absolute;
      right: 1rem;
      color: ${props.colors.main};
      font-size: 1.2rem;
      opacity: 0.8;
    }
  `}
`;

const StartButton = styled.button`
  position: relative;
  width: auto;
  padding: 0.75rem 3rem;
  background: ${props => props.colors.gradient};
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  margin: 1.5rem auto;
  display: block;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.colors.gradient};
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 50%
    );
    transform: rotate(-45deg);
    animation: shine 3s infinite;
    z-index: 2;
  }

  @keyframes shine {
    0% {
      transform: translateX(-50%) rotate(-45deg);
    }
    50% {
      transform: translateX(150%) rotate(-45deg);
    }
    100% {
      transform: translateX(-50%) rotate(-45deg);
    }
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 10px 20px -10px ${props => props.colors.main}60,
      0 0 15px ${props => props.colors.main}40 inset;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

    &::before {
      opacity: 0.5;
    }
  }

  &:active {
    transform: translateY(1px) scale(0.98);
    box-shadow:
      0 5px 10px -5px ${props => props.colors.main}60,
      0 0 10px ${props => props.colors.main}30 inset;
  }

  /* Pulsing effect */
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow:
        0 5px 15px -5px ${props => props.colors.main}40,
        0 0 0 0 ${props => props.colors.main}60;
    }
    70% {
      box-shadow:
        0 5px 15px -5px ${props => props.colors.main}40,
        0 0 0 15px ${props => props.colors.main}00;
    }
    100% {
      box-shadow:
        0 5px 15px -5px ${props => props.colors.main}40,
        0 0 0 0 ${props => props.colors.main}00;
    }
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: white;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    svg path {
      fill: rgb(184, 190, 196);
    }
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`;

const DisabledOverlay = styled.div`
  position: relative;
  filter: ${props => (props.disabled ? 'grayscale(100%)' : 'none')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  transition: all 0.3s ease;
`;

const TemplateSelectorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const NewTemplateButton = styled.button`
  background: linear-gradient(90deg, #00bcd4 60%, #7ecfff 100%);
  color: #23243a;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #00bcd455;
  transition: all 0.2s;
  padding: 0;
  margin-left: 0.2rem;
  &:hover {
    transform: translateY(-2px) scale(1.08);
    box-shadow: 0 4px 14px #00bcd455;
    background: linear-gradient(90deg, #7ecfff 60%, #00bcd4 100%);
  }
`;

const AddWorkout = () => {
  const { showError } = useError();
  const [templates, setTemplates] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [addedExercises, setAddedExercises] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const { user } = useUser();
  const colors = determineColor(user);
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
    { name: 'Bodyweight', value: 'BODYWEIGHT', icon: '🏃', color: '#FF9800' },
    {
      name: 'Weight Lifting',
      value: 'WEIGHT_LIFTING',
      icon: '🏋️',
      color: '#9C27B0',
    },
  ];
  const navigate = useNavigate();
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);

  useEffect(() => {
    async function fetchWrktTemplates() {
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/workout-templates`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        showError(error.message || 'Error fetching templates');
      }
    }

    fetchWrktTemplates();
  }, [showError]);

  async function fetchExercises(category, query = null) {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);

    try {
      if (!query) {
        let url = `${import.meta.env.VITE_API_URL}/users/${user.id}/templates/`;
        if (category) {
          url += `?category=${category}`;
        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        return setExercises(data);
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/templates/?query=${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      const data = await response.json();
      return setExercises(data);
    } catch (error) {
      showError(error.message || 'Error fetching exercises');
    }
  }
  const handleCategoryClick = category => {
    setActiveCategory(category);
    fetchExercises(category.value);
  };

  const handleExerciseClick = exercise => {
    setAddedExercises(prev => {
      const isAlreadyAdded = prev.some(ex => ex.name === exercise.name);
      if (isAlreadyAdded) {
        return prev.filter(ex => ex.name !== exercise.name);
      }
      return [...prev, exercise];
    });
  };

  const isExerciseSelected = exerciseName => {
    return addedExercises.some(ex => ex.name === exerciseName);
  };

  const handleBackClick = () => {
    setExercises([]);
    setActiveCategory(null);
  };

  const handleStart = async () => {
    let exercisesToAdd = addedExercises;
    try {
      if (addedExercises.length === 0 && !selectedTemplateId) {
        showError('Please add at least one exercise');
        return;
      } else if (selectedTemplateId) {
        const selectedTemplate = templates.find(
          t => t.id === selectedTemplateId
        );
        exercisesToAdd = selectedTemplate.exercises;
      }

      const token = localStorage.getItem('token');
      const user = jwtDecode(token);
      // Create the workout
      const workoutRes = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: '', // need implement
            exercises: exercisesToAdd,
          }),
        }
      );

      if (!workoutRes.ok) {
        throw new Error('Failed to create workout');
      }

      const workout = await workoutRes.json();
      navigate(`/workouts/${workout.id}`);
    } catch (error) {
      console.error('Error creating workout:', error);
      showError(error.message || 'Failed to create workout');
    }
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Use Template</SectionTitle>
        <TemplateSelectorRow>
          <TemplateSelect
            value={selectedTemplateId}
            onChange={e => setSelectedTemplateId(e.target.value)}
          >
            <option value="">no-template</option>
            {templates.map((template, index) => (
              <option key={index} value={template.id}>
                {template.name}
              </option>
            ))}
          </TemplateSelect>
          <NewTemplateButton
            onClick={() => {
              setShowCreateTemplate(true);
            }}
            title="Create new template"
            aria-label="Create new template"
          >
            +
          </NewTemplateButton>
        </TemplateSelectorRow>
      </Section>

      <DisabledOverlay disabled={selectedTemplateId !== ''}>
        {addedExercises.length > 0 && (
          <Section>
            <SectionTitle>Exercises added:</SectionTitle>
            <AddedExercises>
              {addedExercises.map((exercise, index) => (
                <ExerciseTag key={index} colors={colors}>
                  {exercise.name}
                  <button onClick={() => handleExerciseClick(exercise)}>
                    ×
                  </button>
                </ExerciseTag>
              ))}
            </AddedExercises>
          </Section>
        )}

        <SearchBar>
          <input
            type="text"
            placeholder="Search..."
            onChange={e => {
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
          <>
            <CategoryHeader>
              <BackButton onClick={handleBackClick}>
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM13.92 16.13H9C8.59 16.13 8.25 15.79 8.25 15.38C8.25 14.97 8.59 14.63 9 14.63H13.92C15.2 14.63 16.25 13.59 16.25 12.3C16.25 11.01 15.21 9.97 13.92 9.97H8.85L9.11 10.23C9.4 10.53 9.4 11 9.1 11.3C8.95 11.45 8.76 11.52 8.57 11.52C8.38 11.52 8.19 11.45 8.04 11.3L6.47 9.72C6.18 9.43 6.18 8.95 6.47 8.66L8.04 7.09C8.33 6.8 8.81 6.8 9.1 7.09C9.39 7.38 9.39 7.86 9.1 8.15L8.77 8.48H13.92C16.03 8.48 17.75 10.2 17.75 12.31C17.75 14.42 16.03 16.13 13.92 16.13Z"
                      fill="#eaedf0"
                    ></path>
                  </g>
                </svg>
              </BackButton>
              <CategoryTitle>{activeCategory?.name}</CategoryTitle>
            </CategoryHeader>
            <ExerciseListContainer>
              <ExerciseList>
                {exercises.map((exercise, index) => (
                  <ExerciseButton
                    colors={colors}
                    key={index}
                    onClick={() => handleExerciseClick(exercise)}
                    isSelected={isExerciseSelected(exercise.name)}
                  >
                    {exercise.name}
                  </ExerciseButton>
                ))}
              </ExerciseList>
            </ExerciseListContainer>
          </>
        )}
      </DisabledOverlay>

      <StartButton colors={colors} onClick={handleStart}>
        Start
      </StartButton>

      <CreateTemplate
        isOpen={showCreateTemplate}
        onClose={() => setShowCreateTemplate(false)}
        initialSelectedExercises={[]}
        onSuccess={() => {
          // Refresh templates list after creation
          const token = localStorage.getItem('token');
          const user = jwtDecode(token);
          fetch(
            `${import.meta.env.VITE_API_URL}/users/${user.id}/workout-templates`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
            .then(res => res.json())
            .then(data => setTemplates(data));
        }}
      />
    </Container>
  );
};

export default AddWorkout;
