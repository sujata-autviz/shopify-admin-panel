import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(username, password);
      const userData = {
        username,
        token: response.access_token,
        tokenType: response.token_type
      };
      
      setUser(userData);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Mavexa Admin</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label  htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggle}
              >
                  {showPassword ? <VisibilityOff sx={{ fill: '#000', fontSize: 22 }} /> : <Visibility sx={{ fill: '#000', fontSize: 22 }} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: 'linear-gradient(180deg, #006ed5, #002254)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '7px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  label: {
    marginBottom: '3px',
    display: 'block',
    fontSize: '14px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0 0 25px',
  },
  field: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  toggle: {
    position: 'absolute',
    right: '10px',
    top: '7px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007bff',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    background: 'linear-gradient(rgb(0, 110, 213), rgb(0, 34, 84))',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
};

export default Login;





