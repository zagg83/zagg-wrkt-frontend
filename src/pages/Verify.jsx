import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams, Link, useNavigate } from 'react-router-dom';

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

const Message = styled.div`
  color: #b6eaff;
  font-size: 1.08rem;
  text-align: center;
  margin-top: 1.5rem;
`;

const ErrorMsg = styled.div`
  color: #ff4444;
  font-size: 1.08rem;
  text-align: center;
  margin-top: 1.5rem;
`;

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState('');
  const didRun = useRef(false); // only for strict mode (:
  const navigate = useNavigate();

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/verify/${token}`,
          {
            method: 'POST',
          }
        );
        console.log(res);
        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json();
          setError(data.error || 'Verification failed.');
          setStatus('error');
        }
      } catch (err) {
        setError('Network error.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate('/login')} title="Back to login">
          {'<'}{' '}
        </BackButton>
        <Logo>ZaggWrkt</Logo>
        <Title>Email Verification</Title>
        {status === 'loading' && <Message>Verifying your email...</Message>}
        {status === 'success' && (
          <Message>
            Your email has been verified!
            <br />
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
          </Message>
        )}
        {status === 'error' && (
          <>
            <ErrorMsg>{error}</ErrorMsg>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
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
            </div>
          </>
        )}
      </Card>
    </Container>
  );
};

export default Verify;
