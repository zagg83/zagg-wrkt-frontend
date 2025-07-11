import React from 'react';
import styled from 'styled-components';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #20212c;
`;

const Card = styled.div`
  background: #23243a;
  border-radius: 22px;
  box-shadow: 0 8px 40px #0005;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  min-width: 340px;
  max-width: 95vw;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 18px;
  left: 18px;
  background: none;
  border: none;
  color: #00bcd4;
  font-size: 1.7rem;
  font-weight: 900;
  cursor: pointer;
  z-index: 2;
`;

const Logo = styled.div`
  font-size: 2.3rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #00bcd4;
  text-align: center;
  margin-bottom: 0.7rem;
  font-family: 'Montserrat', 'Inter', Arial, sans-serif;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #b6eaff;
  margin-bottom: 2.2rem;
  text-align: center;
  font-weight: 600;
`;

const Subtle = styled.div`
  color: #aaa;
  font-size: 1rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const VerifyNotice = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate('/login')} title="Back to login">
          {'<'}{' '}
        </BackButton>
        <Logo>ZaggWrkt</Logo>
        <Title>Check your email</Title>
        <p style={{ color: '#b6eaff', textAlign: 'center', marginTop: 20 }}>
          We’ve sent a verification link to <b>{email}</b>.<br />
          Please check your inbox and follow the instructions to verify your
          account.
        </p>
        <Subtle>
          Already verified?{' '}
          <Link
            to="/login"
            style={{
              color: '#00bcd4',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            Log in
          </Link>
        </Subtle>
        <Subtle>
          Didn't get the email?{' '}
          <Link
            to="/resend-verification"
            style={{
              color: '#00bcd4',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            Resend verification email
          </Link>
        </Subtle>
      </Card>
    </Container>
  );
};

export default VerifyNotice;
