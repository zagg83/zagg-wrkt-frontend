import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';

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
  margin-bottom: 1.5rem;

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
  background-color: ${props => props.color};
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    color: black;
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

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
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

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:after {
    content: '›';
    margin-left: auto;
    font-size: 1.5rem;
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
  border: 2px solid ${props => (props.isSelected ? '#fff' : 'transparent')};
  border-radius: 12px;
  padding: 1rem;
  color: white;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #333;
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: transparent;
  border: 2px solid #333;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
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

const AddWorkout = () => {
  const [templates] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [addedExercises, setAddedExercises] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { user } = useUser();
  const color = determineColor(user);
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
  async function fetchExercises(category, query = null) {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    if (!query) {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/templates/?category=${category}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
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
    const data = await response.json();
    console.log(data);
    return setExercises(data);
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

  return (
    <Container>
      <Section>
        <SectionTitle>Use Template</SectionTitle>
        <TemplateSelect
          value={selectedTemplate}
          onChange={e => setSelectedTemplate(e.target.value)}
        >
          <option value="">no-template</option>
          {templates.map((template, index) => (
            <option key={index} value={template.id}>
              {template.name}
            </option>
          ))}
        </TemplateSelect>
      </Section>

      <DisabledOverlay disabled={selectedTemplate !== ''}>
        {addedExercises.length > 0 && (
          <Section>
            <SectionTitle>Exercises added:</SectionTitle>
            <AddedExercises>
              {addedExercises.map((exercise, index) => (
                <ExerciseTag key={index} color={color}>
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

      <StartButton>Start</StartButton>
    </Container>
  );
};

export default AddWorkout;
