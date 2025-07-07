import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';
import CreateTemplate from '../components/CreateTemplate';

const Container = styled.div`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0;
`;

const CreateButton = styled.button`
  background: linear-gradient(90deg, #00bcd4 60%, #7ecfff 100%);
  color: #23243a;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 12px #00bcd455;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 18px #00bcd455;
  }
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TemplateCard = styled.div`
  background: #23243a;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px #0003;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
`;

const TemplateName = styled.h3`
  color: #7ecfff;
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
`;

const TemplateDescription = styled.p`
  color: #aaa;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
`;

const ExercisesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ExerciseTag = styled.span`
  background: #1e1e2e;
  color: #ccc;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.85rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => (props.variant === 'delete' ? '#ff4444' : '#2a2a2a')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${props => (props.variant === 'delete' ? '#ff6666' : '#333')};
  }
`;

const Templates = () => {
  const { user } = useUser();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userObj.id}/workout-templates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleEditTemplate = template => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleDeleteTemplate = async templateId => {
    if (!window.confirm('Are you sure you want to delete this template?'))
      return;

    try {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userObj.id}/workout-templates/${templateId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ color: 'white' }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Workout Templates</Title>
        <CreateButton onClick={handleCreateTemplate}>
          Create Template
        </CreateButton>
      </Header>

      <TemplatesGrid>
        {templates.map(template => (
          <TemplateCard key={template.id}>
            <TemplateName>{template.name}</TemplateName>
            {template.description && (
              <TemplateDescription>{template.description}</TemplateDescription>
            )}
            <ExercisesList>
              {template.exercises.map(exercise => (
                <ExerciseTag key={exercise.id}>{exercise.name}</ExerciseTag>
              ))}
            </ExercisesList>
            <CardActions>
              <ActionButton onClick={() => handleEditTemplate(template)}>
                Edit
              </ActionButton>
              <ActionButton
                variant="delete"
                onClick={() => handleDeleteTemplate(template.id)}
              >
                Delete
              </ActionButton>
            </CardActions>
          </TemplateCard>
        ))}
      </TemplatesGrid>

      <CreateTemplate
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingTemplate={editingTemplate}
        initialFormData={
          editingTemplate
            ? {
                name: editingTemplate.name,
                description: editingTemplate.description || '',
              }
            : { name: '', description: '' }
        }
        initialSelectedExercises={editingTemplate?.exercises || []}
        onSuccess={() => {
          fetchTemplates();
          setShowModal(false);
          setEditingTemplate(null);
        }}
      />
    </Container>
  );
};

export default Templates;
