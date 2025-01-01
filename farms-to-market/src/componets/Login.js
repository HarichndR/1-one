import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './userSlice';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null); // Set initial state to null
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.user);

  useEffect(() => {
    if (error) {
      setAlert({ message: error, type: 'error' });
    }
  }, [error]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000); // Alert disappears after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    const result = await dispatch(loginUser(credentials));
    if (result.type === 'user/loginUser/fulfilled') {
      setAlert({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  return (
    <>
      {alert && <div className={alert.type === 'success' ? styles.success : styles.error}>{alert.message}</div>}
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="Password"
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className={styles.register}>
          Don't have an account? <Link to='/register' className={styles.link}>Create New</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
