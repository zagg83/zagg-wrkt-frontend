import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import DashboardSlider from '../components/DashboardSlider';
import MenuGrid from '../components/MenuGrid';
import RankProgress from '../components/RankProgress';

const HomeContainer = styled.div`
  background-color: #121212;
  padding-bottom: 80px; // Space for bottom nav
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <RankProgress />
      <DashboardSlider />
      <MenuGrid />
    </HomeContainer>
  );
};

export default Home;
