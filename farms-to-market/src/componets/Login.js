import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import styles from './Login.module.css';
import { fetchUserProfile } from './userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/user/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = res.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      await dispatch(fetchUserProfile());

      setAlert({ message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Login failed",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  return (
    <>
      {alert && (
        <div className={alert.type === 'success' ? styles.success : styles.error}>
          {alert.message}
        </div>
      )}

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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.register}>
          Don't have an account?
          <Link to="/register" className={styles.link}> Create New</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
