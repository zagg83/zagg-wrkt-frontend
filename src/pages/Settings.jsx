import React, { useState } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Layout = styled.div`
  display: flex;
  min-height: 80vh;
  background: #121212;
`;

const Sidebar = styled.div`
  width: 270px;
  background: #18191c;
  border-right: 1px solid #23243a;
  padding: 2rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: 700px) {
    display: none;
  }
`;

const SidebarTitle = styled.div`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0 2rem 1.5rem 2rem;
`;

const SidebarItem = styled.div`
  color: ${props => (props.active ? '#7ecfff' : '#ccc')};
  background: ${props => (props.active ? '#23243a' : 'none')};
  font-weight: 500;
  font-size: 1rem;
  padding: 0.85rem 2rem;
  cursor: pointer;
  border-left: 3px solid ${props => (props.active ? '#7ecfff' : 'transparent')};
  transition:
    background 0.2s,
    color 0.2s;
  &:hover {
    background: #23243a;
    color: #7ecfff;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const SectionTitle = styled.h1`
  color: #fff;
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SectionDesc = styled.div`
  color: #aaa;
  font-size: 1.05rem;
  margin-bottom: 2.2rem;
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionRow = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  background: #18191c;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 1.1rem 1.2rem;
  cursor: pointer;
  transition: background 0.18s;
  justify-content: space-between;
  &:hover {
    background: #23243a;
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
`;

const RowIcon = styled.div`
  font-size: 1.3rem;
  color: #7ecfff;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RowTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
`;

const RowDesc = styled.div`
  font-size: 0.97rem;
  color: #aaa;
  font-weight: 400;
`;

const Arrow = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmBox = styled.div`
  background: #23243a;
  border-radius: 16px;
  padding: 2rem;
  max-width: 350px;
  color: white;
  text-align: center;
`;

const PrivacyLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: #7ecfff;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: underline;
  &:hover {
    color: #fff;
    text-decoration: none;
  }
`;

const TermsLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: #7ecfff;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: underline;
  &:hover {
    color: #fff;
    text-decoration: none;
  }
`;

const AcceptableUseLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.2rem;
  color: #7ecfff;
  font-weight: 600;
  font-size: 1.08rem;
  text-decoration: underline;
  &:hover {
    color: #fff;
    text-decoration: none;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1.2rem;
`;

const Settings = () => {
  const { user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('Your account');
  const navigate = useNavigate();

  const sidebarItems = [
    'Your account',
    'Privacy and safety',
    'Notifications',
    'Help Center',
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/signup');
      } else {
        setError('Failed to delete account.');
      }
    } catch (e) {
      setError('Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Sidebar>
        <SidebarTitle>Settings</SidebarTitle>
        {sidebarItems.map(item => (
          <SidebarItem
            key={item}
            active={selected === item}
            onClick={() => setSelected(item)}
          >
            {item}
          </SidebarItem>
        ))}
      </Sidebar>
      <Main>
        {selected === 'Your account' && (
          <>
            <SectionTitle>Your Account</SectionTitle>
            <SectionDesc>
              See information about your account, download an archive of your
              data, or learn about your account deactivation options.
            </SectionDesc>
            <ActionList>
              <ActionRow
                as="div"
                style={{
                  cursor: 'default',
                  background: 'none',
                  padding: 0,
                  marginBottom: 10,
                }}
              >
                <RowLeft>
                  <RowIcon>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        style={{ width: 28, height: 28, borderRadius: '50%' }}
                      />
                    ) : (
                      <span role="img" aria-label="user">
                        👤
                      </span>
                    )}
                  </RowIcon>
                  <RowText>
                    <RowTitle>{user.name}</RowTitle>
                    <RowDesc>{user.email}</RowDesc>
                  </RowText>
                </RowLeft>
              </ActionRow>
              <ActionRow
                as="div"
                style={{ cursor: 'default', background: 'none', padding: 0 }}
              >
                <RowLeft>
                  <RowIcon>🏅</RowIcon>
                  <RowText>
                    <RowTitle>Rank</RowTitle>
                    <RowDesc>{user.rank || '-'}</RowDesc>
                  </RowText>
                </RowLeft>
              </ActionRow>
              <ActionRow onClick={() => {}}>
                <RowLeft>
                  <RowIcon>🔑</RowIcon>
                  <RowText>
                    <RowTitle>Change your password</RowTitle>
                    <RowDesc>Change your password at any time.</RowDesc>
                  </RowText>
                </RowLeft>
                <Arrow>›</Arrow>
              </ActionRow>
              <ActionRow onClick={() => {}}>
                <RowLeft>
                  <RowIcon>⬇️</RowIcon>
                  <RowText>
                    <RowTitle>Download an archive of your data</RowTitle>
                    <RowDesc>
                      Get insights into the type of information stored for your
                      account.
                    </RowDesc>
                  </RowText>
                </RowLeft>
                <Arrow>›</Arrow>
              </ActionRow>
              <ActionRow onClick={handleLogout}>
                <RowLeft>
                  <RowIcon>🚪</RowIcon>
                  <RowText>
                    <RowTitle>Log Out</RowTitle>
                    <RowDesc>Sign out of your account.</RowDesc>
                  </RowText>
                </RowLeft>
                <Arrow>›</Arrow>
              </ActionRow>
              <ActionRow onClick={() => setShowConfirm(true)}>
                <RowLeft>
                  <RowIcon>🗑️</RowIcon>
                  <RowText>
                    <RowTitle style={{ color: '#ff6b6b' }}>
                      Delete your account
                    </RowTitle>
                    <RowDesc style={{ color: '#ff6b6b' }}>
                      This cannot be undone.
                    </RowDesc>
                  </RowText>
                </RowLeft>
                <Arrow>›</Arrow>
              </ActionRow>
            </ActionList>
          </>
        )}
        {selected === 'Privacy and safety' && (
          <>
            <SectionTitle>Privacy & Safety</SectionTitle>
            <LegalLinks>
              <PrivacyLink to="/privacy">View Privacy Policy</PrivacyLink>
              <TermsLink to="/terms">View Terms & Conditions</TermsLink>
              <AcceptableUseLink to="/acceptable-use">
                View Acceptable Use Policy
              </AcceptableUseLink>
            </LegalLinks>
          </>
        )}
        {selected === 'Notifications' && (
          <>
            <SectionTitle>Notifications</SectionTitle>
            <SectionDesc>No notifications right now.</SectionDesc>
          </>
        )}
        {selected === 'Help Center' && (
          <>
            <SectionTitle>Help Center</SectionTitle>
            <SectionDesc>
              For help, contact support@zaggathletics.com
            </SectionDesc>
          </>
        )}
        {showConfirm && (
          <ConfirmOverlay>
            <ConfirmBox>
              <div style={{ marginBottom: 16 }}>
                <b>Are you sure you want to delete your account?</b>
                <br />
                This cannot be undone.
              </div>
              {error && (
                <div style={{ color: '#ff6b6b', marginBottom: 8 }}>{error}</div>
              )}
              <button
                style={{
                  background:
                    'linear-gradient(90deg, #ff4444 60%, #ff6b6b 100%)',
                  color: '#23243a',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '0.8rem 1.5rem',
                  cursor: 'pointer',
                  marginRight: 12,
                }}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                style={{
                  background:
                    'linear-gradient(90deg, #00bcd4 60%, #7ecfff 100%)',
                  color: '#23243a',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '1rem',
                  fontWeight: 700,
                  padding: '0.8rem 1.5rem',
                  cursor: 'pointer',
                }}
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </ConfirmBox>
          </ConfirmOverlay>
        )}
      </Main>
    </Layout>
  );
};

export default Settings;
