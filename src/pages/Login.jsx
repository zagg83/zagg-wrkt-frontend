import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

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

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  background: #fff;
  color: #23243a;
  border: none;
  border-radius: 10px;
  font-size: 1.08rem;
  font-weight: 700;
  padding: 0.9rem 1rem;
  margin-bottom: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 12px #00bcd422;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  &:hover {
    background: #f3f3f3;
    box-shadow: 0 4px 18px #00bcd422;
  }
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

const ErrorMsg = styled.div`
  color: #ff4444;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.05rem;
`;

const Subtle = styled.div`
  color: #aaa;
  font-size: 1rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const token = await response.json();
      if (!response.ok || !token) {
        setError(token.error || 'Login failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/auth/google`,
      '_blank',
      'width=500,height=600'
    );
  };

  useEffect(() => {
    const listener = event => {
      if (event.origin !== import.meta.env.VITE_API_URL) return;
      const { token, error } = event.data;
      if (error) {
        console.log(error);
        setError(error);
      }
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [navigate]);

  return (
    <Container>
      <Card>
        <Logo>ZaggWrkt</Logo>
        <Title>Welcome back! Log in to your account</Title>
        <GoogleButton type="button" onClick={handleGoogleLogin}>
          <FcGoogle size={22} /> Sign in with Google
        </GoogleButton>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit} autoComplete="on">
          <InputGroup>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </InputGroup>
          <InputGroup>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Subtle>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#00bcd4',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            Sign up
          </Link>
        </Subtle>
      </Card>
    </Container>
  );
};

export default Login;
