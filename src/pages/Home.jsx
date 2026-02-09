import React, { use, useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import DashboardSlider from '../components/DashboardSlider';
import MenuGrid from '../components/MenuGrid';
import RankProgress from '../components/RankProgress';
import WeeklyReportModal from '../components/WeeklyReportModal';
import { useUser } from '../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const HomeContainer = styled.div`
  background-color: #121212;
  padding-bottom: 80px; // Space for bottom nav
  position: relative;
`;

const Home = () => {
  const [report, setReport] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');
      const userObj = jwtDecode(token);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userObj.id}/weekly-reports/latest-unread`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.lastReport) setReport(data.lastReport);
    };
    fetchReport();
  }, []);
  return (
    <HomeContainer>
      {report && (
        <WeeklyReportModal
          report={report}
          onClose={async () => {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/users/${user.id}/weekly-reports/${report.id}/mark-viewed`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            setReport(null);
          }}
        />
      )}
      <Header />
      <RankProgress />
      <DashboardSlider />
      <MenuGrid />
    </HomeContainer>
  );
};

export default Home;
