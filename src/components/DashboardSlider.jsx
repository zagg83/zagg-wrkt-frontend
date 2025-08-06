import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import WeeklyProgress from './WeeklyProgress';
import { jwtDecode } from 'jwt-decode';
import { isToday } from 'date-fns';

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 400px;
  touch-action: pan-y pinch-zoom;
`;

const SlideWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => {
    const slideWidth = 100;

    // If this slide is currently active, it should be at center
    if (props.isActive) return 'translateX(0)';

    // If moving left (Next button clicked)
    if (props.direction === 'left') {
      // The slide that was active goes left, the new slide comes from right
      if (props.slideIndex === props.previousSlide) {
        return `translateX(-${slideWidth}%)`; // Previous slide exits left
      } else if (props.slideIndex === props.currentSlide) {
        return `translateX(${slideWidth}%)`; // New slide starts from right
      }
    }

    // If moving right (Prev button clicked)
    if (props.direction === 'right') {
      // The slide that was active goes right, the new slide comes from left
      if (props.slideIndex === props.previousSlide) {
        return `translateX(${slideWidth}%)`; // Previous slide exits right
      } else if (props.slideIndex === props.currentSlide) {
        return `translateX(-${slideWidth}%)`; // New slide starts from left
      }
    }

    // Default state: first slide visible, others off-screen to the right
    return props.slideIndex === 0
      ? 'translateX(0)'
      : `translateX(${slideWidth}%)`;
  }};
  z-index: ${props => (props.isActive ? 2 : 1)};
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 3;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props =>
    props.active ? '#6366f1' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${props =>
      props.active ? '#6366f1' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const MotivationalSlide = styled.div`
  background-color: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow-y: auto;
`;

const MotivationalHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
`;

const MotivationalText = styled.p`
  font-size: 1rem;
  color: #ccc;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const DashboardSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');
  const [isMovingForward, setIsMovingForward] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const navigate = useNavigate();
  const totalSlides = 2;
  const containerRef = useRef(null);

  // Auto-rotation every 10 seconds - only left to right and right to left
  useEffect(() => {
    if (isDragging) return; // Don't auto-rotate while dragging

    const interval = setInterval(() => {
      setPreviousSlide(currentSlide);

      if (isMovingForward) {
        // Moving forward: left to right
        if (currentSlide < totalSlides - 1) {
          setSlideDirection('left');
          setCurrentSlide(currentSlide + 1);
        } else {
          // Reached the end, start moving backward
          setIsMovingForward(false);
          setSlideDirection('right');
          setCurrentSlide(currentSlide - 1);
        }
      } else {
        // Moving backward: right to left
        if (currentSlide > 0) {
          setSlideDirection('right');
          setCurrentSlide(currentSlide - 1);
        } else {
          // Reached the beginning, start moving forward
          setIsMovingForward(true);
          setSlideDirection('left');
          setCurrentSlide(currentSlide + 1);
        }
      }
    }, 10000000);

    return () => clearInterval(interval);
  }, [currentSlide, totalSlides, isMovingForward, isDragging]);

  useEffect(() => {
    async function fetchTodayWorkout() {
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts?limit=${1}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (isToday(new Date(data[0].createdAt))) {
        setTodayWorkout(data[0]);
      }
    }
    fetchTodayWorkout();
  }, []);

  const handleDotClick = slideIndex => {
    const direction = slideIndex > currentSlide ? 'left' : 'right';
    setSlideDirection(direction);
    setPreviousSlide(currentSlide);
    setCurrentSlide(slideIndex);

    // Update the movement direction based on the click
    setIsMovingForward(slideIndex > currentSlide);
  };

  const handleTouchStart = e => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = e => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left - go to next slide
        if (currentSlide < totalSlides - 1) {
          setSlideDirection('left');
          setPreviousSlide(currentSlide);
          setCurrentSlide(currentSlide + 1);
          setIsMovingForward(true);
        }
      } else {
        // Swiped right - go to previous slide
        if (currentSlide > 0) {
          setSlideDirection('right');
          setPreviousSlide(currentSlide);
          setCurrentSlide(currentSlide - 1);
          setIsMovingForward(false);
        }
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = e => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swiped left - go to next slide
        if (currentSlide < totalSlides - 1) {
          setSlideDirection('left');
          setPreviousSlide(currentSlide);
          setCurrentSlide(currentSlide + 1);
          setIsMovingForward(true);
        }
      } else {
        // Swiped right - go to previous slide
        if (currentSlide > 0) {
          setSlideDirection('right');
          setPreviousSlide(currentSlide);
          setCurrentSlide(currentSlide - 1);
          setIsMovingForward(false);
        }
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleAddWorkout = () => {
    navigate('/add-workout');
  };

  return (
    <SliderContainer
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <SlideWrapper
        isActive={currentSlide === 0}
        direction={slideDirection}
        slideIndex={0}
        currentSlide={currentSlide}
        previousSlide={previousSlide}
      >
        <WeeklyProgress />
      </SlideWrapper>

      <SlideWrapper
        isActive={currentSlide === 1}
        direction={slideDirection}
        slideIndex={1}
        currentSlide={currentSlide}
        previousSlide={previousSlide}
      >
        {todayWorkout ? (
          <MotivationalSlide
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => navigate(`/workouts/${todayWorkout.id}`)}
            title="View today's workout"
          >
            <MotivationalHeading>Today's Workout Logged 🎉</MotivationalHeading>
            <MotivationalText>
              {todayWorkout.exercises && todayWorkout.exercises.length > 0 ? (
                <>
                  <div
                    style={{
                      marginBottom: '1rem',
                      fontWeight: 600,
                      color: '#fff',
                      fontSize: '1.3rem',
                      margin: '10px 10px',
                    }}
                  >
                    Today's Workout
                  </div>
                  <strong>{todayWorkout.exercises.length}</strong> exercise
                  {todayWorkout.exercises.length > 1 ? 's' : ''}:
                  <div
                    style={{
                      marginTop: '0.7em',
                      paddingRight: todayWorkout.exercises.length > 3 ? 8 : 0,
                    }}
                  >
                    {todayWorkout.exercises.map((ex, idx) => (
                      <div key={ex.id || idx} style={{ marginBottom: '0.7em' }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.2em' }}>
                          {ex.template?.name || ex.name}
                        </div>
                        {ex.sets && ex.sets.length > 0 && (
                          <div
                            style={{
                              borderRadius: 6,
                              border: '1px solid #333',
                              background: '#232323',
                              maxWidth: 340,
                            }}
                          >
                            <table
                              style={{
                                width: '100%',
                                fontSize: '0.97em',
                                borderCollapse: 'collapse',
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background: '#232323',
                                    color: '#aaa',
                                  }}
                                >
                                  <th
                                    style={{
                                      padding: '0.3em 0.7em',
                                      textAlign: 'left',
                                      fontWeight: 400,
                                    }}
                                  >
                                    Set
                                  </th>
                                  <th
                                    style={{
                                      padding: '0.3em 0.7em',
                                      textAlign: 'left',
                                      fontWeight: 400,
                                    }}
                                  >
                                    Reps
                                  </th>
                                  <th
                                    style={{
                                      padding: '0.3em 0.7em',
                                      textAlign: 'left',
                                      fontWeight: 400,
                                    }}
                                  >
                                    Weight
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {ex.sets.slice(0, 5).map((set, sidx) => (
                                  <tr key={set.id || sidx}>
                                    <td style={{ padding: '0.2em 0.7em' }}>
                                      {sidx + 1}
                                    </td>
                                    <td style={{ padding: '0.2em 0.7em' }}>
                                      {set.reps ?? '-'}
                                    </td>
                                    <td style={{ padding: '0.2em 0.7em' }}>
                                      {set.weight !== undefined &&
                                      set.weight !== null
                                        ? `${set.weight} kg`
                                        : '-'}
                                    </td>
                                  </tr>
                                ))}
                                {ex.sets.length > 5 && (
                                  <tr>
                                    <td
                                      colSpan={3}
                                      style={{
                                        padding: '0.2em 0.7em',
                                        color: '#aaa',
                                        filter: 'blur(1.2px)',
                                      }}
                                    >
                                      ...more sets
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                    {todayWorkout.exercises.length > 6 && (
                      <div
                        style={{
                          color: '#aaa',
                          filter: 'blur(1.5px)',
                          marginTop: '0.3em',
                        }}
                      >
                        ...and more exercises
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>Workout logged. Great job!</>
              )}
            </MotivationalText>
          </MotivationalSlide>
        ) : (
          <MotivationalSlide
            style={{ cursor: 'pointer' }}
            onClick={handleAddWorkout}
            title="Add today's workout"
          >
            <MotivationalHeading>Stay consistent 💪</MotivationalHeading>
            <MotivationalText>
              You haven't logged a workout today. Start strong!
            </MotivationalText>
          </MotivationalSlide>
        )}
      </SlideWrapper>

      <DotsContainer>
        <Dot active={currentSlide === 0} onClick={() => handleDotClick(0)} />
        <Dot active={currentSlide === 1} onClick={() => handleDotClick(1)} />
      </DotsContainer>
    </SliderContainer>
  );
};

export default DashboardSlider;
