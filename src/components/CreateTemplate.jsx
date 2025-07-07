import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { useError } from '../context/ErrorContext';

const Modal = styled.div`
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

const ModalContent = styled.div`
  background: #23243a;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #7ecfff;
  margin: 0 0 1.5rem 0;
`;

const Input = styled.input`
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #7ecfff55;
  }
`;

const TextArea = styled.textarea`
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  padding: 0.8rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #7ecfff55;
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
  margin-bottom: 1.5rem;
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

const CategoryTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

const ExerciseListContainer = styled.div`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 6px;
    height: 80px;
    background: linear-gradient(to bottom, rgba(35, 36, 58, 0), #23243a);
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
  padding-bottom: 60px;

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
  border: 2px solid ${props => (props.isSelected ? '#7ecfff' : 'transparent')};
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
    background: linear-gradient(90deg, #7ecfff 0%, #00bcd4 100%);
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
      color: #7ecfff;
      font-size: 1.2rem;
      opacity: 0.8;
    }
  `}
`;

const SelectedExercises = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #1e1e2e;
  border-radius: 8px;
  min-height: 60px;
`;

const SelectedExercise = styled.div`
  background: #00bcd4;
  color: #23243a;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #23243a;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: ${props =>
    props.variant === 'secondary'
      ? '#2a2a2a'
      : 'linear-gradient(90deg, #00bcd4 60%, #7ecfff 100%)'};
  color: ${props => (props.variant === 'secondary' ? 'white' : '#23243a')};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-1px);
  }
`;

const CreateTemplate = ({
  isOpen,
  onClose,
  editingTemplate = null,
  initialFormData = { name: '', description: '' },
  initialSelectedExercises = [],
  onSuccess,
}) => {
  const { showError } = useError();
  const [formData, setFormData] = useState(initialFormData);
  const [selectedExercises, setSelectedExercises] = useState(
    initialSelectedExercises
  );
  const [exercises, setExercises] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    if (isOpen) {
      fetchExercises();
      setFormData(initialFormData);
      setSelectedExercises(initialSelectedExercises);
    }
  }, [isOpen, editingTemplate]);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userObj.id}/templates/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableExercises(data);
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    }
  };

  const handleCategoryClick = category => {
    setActiveCategory(category);
    fetchExercisesByCategory(category.value);
  };

  const fetchExercisesByCategory = async (category, query = null) => {
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);

      let url = `${import.meta.env.VITE_API_URL}/users/${userObj.id}/templates/`;
      if (category) {
        url += `?category=${category}`;
      }
      if (query) {
        url += category ? `&query=${query}` : `?query=${query}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      showError('Failed to fetch exercises');
    }
  };

  const handleExerciseClick = exercise => {
    setSelectedExercises(prev => {
      const isAlreadyAdded = prev.some(ex => ex.id === exercise.id);
      if (isAlreadyAdded) {
        return prev.filter(ex => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  };

  const isExerciseSelected = exerciseId => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  const handleBackClick = () => {
    setExercises([]);
    setActiveCategory(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrorMsg('Template name is required');
      showError('Template name is required');
      return;
    }
    if (selectedExercises.length === 0) {
      setErrorMsg('Please add at least one exercise');
      showError('Please add at least one exercise');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      const url = editingTemplate
        ? `${import.meta.env.VITE_API_URL}/users/${userObj.id}/workout-templates/${editingTemplate.id}`
        : `${import.meta.env.VITE_API_URL}/users/${userObj.id}/workout-templates`;
      const method = editingTemplate ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          exerciseIds: selectedExercises.map(ex => ex.id),
        }),
      });
      if (response.ok) {
        setSuccessMsg(
          editingTemplate ? 'Template updated!' : 'Template created!'
        );
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 800);
      } else {
        const err = await response.json();
        setErrorMsg(err.error || 'Failed to save template');
      }
    } catch (error) {
      setErrorMsg('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setSelectedExercises([]);
    setExercises([]);
    setActiveCategory(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>
          {editingTemplate ? 'Edit Template' : 'Create Template'}
        </ModalTitle>

        {errorMsg && (
          <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{errorMsg}</div>
        )}
        {successMsg && (
          <div style={{ color: '#00e676', marginBottom: 8 }}>{successMsg}</div>
        )}

        <Input
          placeholder="Template name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
        />

        <TextArea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={loading}
        />

        <SearchBar>
          <input
            type="text"
            placeholder="Search exercises..."
            onChange={e => {
              if (e.target.value.trim().length > 0) {
                fetchExercisesByCategory(activeCategory?.value, e.target.value);
              } else if (activeCategory) {
                fetchExercisesByCategory(activeCategory.value);
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
                    isSelected={isExerciseSelected(exercise.id)}
                  >
                    {exercise.name}
                  </ExerciseButton>
                ))}
              </ExerciseList>
            </ExerciseListContainer>
          </>
        )}

        {selectedExercises.length > 0 && (
          <div>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
              Selected Exercises ({selectedExercises.length})
            </h4>
            <SelectedExercises>
              {selectedExercises.map(exercise => (
                <SelectedExercise key={exercise.id}>
                  {exercise.name}
                  <RemoveButton onClick={() => handleExerciseClick(exercise)}>
                    ×
                  </RemoveButton>
                </SelectedExercise>
              ))}
            </SelectedExercises>
          </div>
        )}

        <ModalActions>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default CreateTemplate;
