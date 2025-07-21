import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  subDays,
  addDays,
  isThisWeek,
  isThisMonth,
  isSameYear,
  isSameWeek,
  subWeeks,
} from 'date-fns';
import { useUser } from '../context/UserContext';
import determineColor from '../util/determineColor';
import { jwtDecode } from 'jwt-decode';
import { createGlobalStyle } from 'styled-components';

// Main container with padding for bottom navigation
const Container = styled.div`
  padding: 1rem;
  padding-bottom: 80px;
`;

// Header with month navigation controls
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const MonthTitle = styled.h1`
  font-size: 1.5rem;
  color: white;
  margin: 0;
`;

// Navigation buttons with hover and active states
const NavigationButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Calendar grid container
const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 450px) {
    padding: 0.3rem;
    gap: 0.18rem;
  }
`;

// Week day headers (Sun, Mon, etc.)
const WeekDay = styled.div`
  color: #666;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.5rem;
  text-transform: uppercase;
  font-weight: 600;

  @media (max-width: 450px) {
    font-size: 0.48rem;
    padding: 0.18rem;
  }
`;

// Individual day cell with workout indicators
const Day = styled.div`
  aspect-ratio: 1;
  background: ${props => (props.$isCurrentMonth ? '#2a2a2a' : '#232323')};
  border-radius: 8px;
  color: ${props => (props.$isCurrentMonth ? 'white' : '#666')};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  // Workout indicator line at bottom
  ${props =>
    props.$hasWorkout &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: ${props.colors.gradient};
      opacity: 0.8;
    }
  `}

  // Today's date highlighting
  ${props =>
    props.$isToday &&
    `
    border: 2px solid ${props.colors.secondary};
    background: ${props.colors.main}15;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 450px) {
    padding: 0.05rem;
    border-radius: 3px;
    min-height: 28px;
    font-size: 0.7rem;
  }
`;

// Day number with special styling for today
const DayNumber = styled.span`
  font-size: 0.9rem;
  font-weight: ${props => (props.$isToday ? '600' : '400')};
`;

// Workout exercise count indicator
const WorkoutIndicator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: ${props => props.colors.main};

  @media (max-width: 450px) {
    display: none;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 10px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  background: ${props => (props.$isActive ? props.colors.main : 'transparent')};
  color: ${props => (props.$isActive ? 'white' : '#ccc')};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => (props.$isActive ? props.colors.main : '#3a3a3a')};
  }
`;

const WorkoutListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimelineHeader = styled.h2`
  color: #ccc;
  font-size: 1.1rem;
  margin: 1.5rem 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const WorkoutListItem = styled.div`
  background: radial-gradient(
    circle at top left,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border-radius: 1rem;
  padding: 1.2rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px ${props => props.colors.main}40;
    border-color: ${props => props.colors.main}50;
  }
`;

const WorkoutListName = styled.h3`
  color: white;
  margin: 0 0 0.4rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const WorkoutListInfo = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
`;

const WorkoutListDate = styled.p`
  color: ${props => props.colors.secondary};
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 0 5px ${props => props.colors.secondary}30;
`;

const WorkoutLog = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useUser();
  const colors = determineColor(user);
  const [workoutsByDate, setWorkoutsByDate] = useState({}); // For calendar view
  const [allWorkouts, setAllWorkouts] = useState([]); // For list view
  const [categorizedWorkouts, setCategorizedWorkouts] = useState({}); // New state for categorized workouts
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = jwtDecode(token);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/workouts`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }

        const data = await response.json();

        // Sort workouts by creation date (most recent first)
        const sortedWorkouts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllWorkouts(sortedWorkouts);

        // Categorize workouts for the list view
        const categories = {
          thisWeek: [],
          lastWeek: [],
          thisMonth: [],
          lastMonth: [],
          earlierThisYear: [],
          earlier: {},
        };

        const now = new Date();

        sortedWorkouts.forEach(workout => {
          const workoutDate = new Date(workout.createdAt);

          if (isThisWeek(workoutDate, { weekStartsOn: 1 })) {
            // Monday as start of week
            categories.thisWeek.push(workout);
          } else if (
            isSameWeek(workoutDate, subWeeks(now, 1), { weekStartsOn: 1 })
          ) {
            categories.lastWeek.push(workout);
          } else if (isThisMonth(workoutDate)) {
            categories.thisMonth.push(workout);
          } else if (isSameMonth(workoutDate, subMonths(now, 1))) {
            categories.lastMonth.push(workout);
          } else if (isSameYear(workoutDate, now)) {
            categories.earlierThisYear.push(workout);
          } else {
            const year = format(workoutDate, 'yyyy');
            if (!categories.earlier[year]) {
              categories.earlier[year] = [];
            }
            categories.earlier[year].push(workout);
          }
        });

        setCategorizedWorkouts(categories);

        // Transform workouts into a date-keyed object for calendar view
        const workoutsForCalendar = sortedWorkouts.reduce((acc, workout) => {
          const date = format(new Date(workout.createdAt), 'yyyy-MM-dd');
          // If multiple workouts on the same day, only the first one is shown in calendar
          // For full list, user can switch to 'All Workouts' view
          if (!acc[date]) {
            acc[date] = {
              name: workout.name,
              exercises: workout.exercises.length,
              id: workout.id,
            };
          }
          return acc;
        }, {});

        setWorkoutsByDate(workoutsForCalendar);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user.id]);

  // Calculate calendar dates
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add days from previous month to start on Sunday
  const startDay = monthStart.getDay();

  const previousDays = [];
  for (let i = startDay; i > 0; i--) {
    const dayFromPreviousMonth = subDays(monthStart, i);
    previousDays.push(dayFromPreviousMonth);
  }

  // Add days from next month to complete the grid
  const endDay = monthEnd.getDay();
  const nextDays = [];
  for (let i = 1; i <= 6 - endDay; i++) {
    const dayFromNextMonth = addDays(monthEnd, i);
    nextDays.push(dayFromNextMonth);
  }

  // Combine all days for the calendar grid
  const allDays = [...previousDays, ...daysInMonth, ...nextDays];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Handle day click to show workout details
  const handleDayClick = date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const workout = workoutsByDate[formattedDate];
    if (workout) {
      navigate(`/workouts/${workout.id}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <MonthTitle>Loading...</MonthTitle>
        </Header>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <NavigationButton onClick={handlePrevMonth}>←</NavigationButton>
          <MonthTitle>{format(currentDate, 'MMMM yyyy')}</MonthTitle>
          <NavigationButton onClick={handleNextMonth}>→</NavigationButton>
        </Header>

        <ViewToggle>
          <ToggleButton
            $isActive={viewMode === 'calendar'}
            onClick={() => setViewMode('calendar')}
            colors={colors}
          >
            Calendar
          </ToggleButton>
          <ToggleButton
            $isActive={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            colors={colors}
          >
            All Workouts
          </ToggleButton>
        </ViewToggle>

        {viewMode === 'calendar' ? (
          <Calendar>
            {weekDays.map(day => (
              <WeekDay key={day}>{day}</WeekDay>
            ))}
            {allDays.map((date, index) => {
              const formattedDate = format(date, 'yyyy-MM-dd');
              const workout = workoutsByDate[formattedDate] || null;
              return (
                <Day
                  key={index}
                  $isCurrentMonth={isSameMonth(date, currentDate)}
                  $isToday={isSameDay(date, new Date())}
                  $hasWorkout={workout}
                  colors={colors}
                  onClick={() => handleDayClick(date)}
                >
                  <DayNumber $isToday={isSameDay(date, new Date())}>
                    {format(date, 'd')}
                  </DayNumber>
                  {workout && (
                    <WorkoutIndicator colors={colors}>
                      <span className="calendar-workout-name">
                        {workout.name}
                      </span>
                      <span>{workout.exercises} exercises</span>
                    </WorkoutIndicator>
                  )}
                </Day>
              );
            })}
          </Calendar>
        ) : (
          <WorkoutListContainer>
            {categorizedWorkouts.thisWeek.length > 0 && (
              <>
                <TimelineHeader>This Week</TimelineHeader>
                {categorizedWorkouts.thisWeek.map(workout => (
                  <WorkoutListItem
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    colors={colors}
                  >
                    <WorkoutListName>{workout.name}</WorkoutListName>
                    <WorkoutListDate colors={colors}>
                      Date:{' '}
                      {format(
                        new Date(workout.createdAt),
                        'MMM d, yyyy - h:mm a'
                      )}
                    </WorkoutListDate>
                    <WorkoutListInfo>
                      {workout.exercises.length} exercises
                    </WorkoutListInfo>
                  </WorkoutListItem>
                ))}
              </>
            )}
            {categorizedWorkouts.lastWeek.length > 0 && (
              <>
                <TimelineHeader>Last Week</TimelineHeader>
                {categorizedWorkouts.lastWeek.map(workout => (
                  <WorkoutListItem
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    colors={colors}
                  >
                    <WorkoutListName>{workout.name}</WorkoutListName>
                    <WorkoutListDate colors={colors}>
                      Date:{' '}
                      {format(
                        new Date(workout.createdAt),
                        'MMM d, yyyy - h:mm a'
                      )}
                    </WorkoutListDate>
                    <WorkoutListInfo>
                      {workout.exercises.length} exercises
                    </WorkoutListInfo>
                  </WorkoutListItem>
                ))}
              </>
            )}
            {categorizedWorkouts.thisMonth.length > 0 && (
              <>
                <TimelineHeader>This Month</TimelineHeader>
                {categorizedWorkouts.thisMonth.map(workout => (
                  <WorkoutListItem
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    colors={colors}
                  >
                    <WorkoutListName>{workout.name}</WorkoutListName>
                    <WorkoutListDate colors={colors}>
                      Date:{' '}
                      {format(
                        new Date(workout.createdAt),
                        'MMM d, yyyy - h:mm a'
                      )}
                    </WorkoutListDate>
                    <WorkoutListInfo>
                      {workout.exercises.length} exercises
                    </WorkoutListInfo>
                  </WorkoutListItem>
                ))}
              </>
            )}
            {categorizedWorkouts.lastMonth.length > 0 && (
              <>
                <TimelineHeader>Last Month</TimelineHeader>
                {categorizedWorkouts.lastMonth.map(workout => (
                  <WorkoutListItem
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    colors={colors}
                  >
                    <WorkoutListName>{workout.name}</WorkoutListName>
                    <WorkoutListDate colors={colors}>
                      Date:{' '}
                      {format(
                        new Date(workout.createdAt),
                        'MMM d, yyyy - h:mm a'
                      )}
                    </WorkoutListDate>
                    <WorkoutListInfo>
                      {workout.exercises.length} exercises
                    </WorkoutListInfo>
                  </WorkoutListItem>
                ))}
              </>
            )}
            {categorizedWorkouts.earlierThisYear.length > 0 && (
              <>
                <TimelineHeader>Earlier This Year</TimelineHeader>
                {categorizedWorkouts.earlierThisYear.map(workout => (
                  <WorkoutListItem
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    colors={colors}
                  >
                    <WorkoutListName>{workout.name}</WorkoutListName>
                    <WorkoutListDate colors={colors}>
                      Date:{' '}
                      {format(
                        new Date(workout.createdAt),
                        'MMM d, yyyy - h:mm a'
                      )}
                    </WorkoutListDate>
                    <WorkoutListInfo>
                      {workout.exercises.length} exercises
                    </WorkoutListInfo>
                  </WorkoutListItem>
                ))}
              </>
            )}
            {Object.entries(categorizedWorkouts.earlier).map(
              ([year, workoutsInYear]) => (
                <React.Fragment key={year}>
                  {workoutsInYear.length > 0 && (
                    <>
                      <TimelineHeader>{year}</TimelineHeader>
                      {workoutsInYear.map(workout => (
                        <WorkoutListItem
                          key={workout.id}
                          onClick={() => navigate(`/workouts/${workout.id}`)}
                          colors={colors}
                        >
                          <WorkoutListName>{workout.name}</WorkoutListName>
                          <WorkoutListDate colors={colors}>
                            Date:{' '}
                            {format(
                              new Date(workout.createdAt),
                              'MMM d, yyyy - h:mm a'
                            )}
                          </WorkoutListDate>
                          <WorkoutListInfo>
                            {workout.exercises.length} exercises
                          </WorkoutListInfo>
                        </WorkoutListItem>
                      ))}
                    </>
                  )}
                </React.Fragment>
              )
            )}
          </WorkoutListContainer>
        )}
      </Container>
    </>
  );
};

export default WorkoutLog;
