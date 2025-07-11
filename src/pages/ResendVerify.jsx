import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #23253a;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  border: 1.5px solid #23253a;
  transition: border 0.2s;
  &:focus-within {
    border: 1.5px solid #00bcd4;
  }
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.08rem;
  padding: 1rem 1rem 1rem 1rem;
  flex: 1;
  outline: none;
  &::placeholder {
    color: #6e7a8a;
    opacity: 1;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00bcd4 60%, #7ecfff 100%);
  color: #23243a;
  border: none;
  border-radius: 10px;
  font-size: 1.13rem;
  font-weight: 800;
  padding: 1rem 1rem;
  margin-top: 0.7rem;
  margin-bottom: 0.2rem;
  cursor: pointer;
  box-shadow: 0 2px 12px #00bcd455;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, #00bcd4 80%, #7ecfff 100%);
    box-shadow: 0 4px 18px #00bcd455;
  }
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

const ResendVerify = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/verify/resend/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(
          data.message ||
            'If an account with that email exists and is not verified, a verification email has been sent.'
        );
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <BackButton onClick={() => navigate('/login')} title="Back to login">
          {'<'}{' '}
        </BackButton>
        <Logo>ZaggWrkt</Logo>
        <Title>Resend Verification Email</Title>
        <form onSubmit={handleSubmit} autoComplete="on">
          <InputGroup>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Resend Email'}
          </Button>
        </form>
        {message && <Message>{message}</Message>}
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Container>
  );
};

export default ResendVerify;
