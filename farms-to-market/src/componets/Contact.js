import React, { useState } from 'react';
import styles from './ContactPage.module.css';
import axios from 'axios';
const url=process.env.BACKEND_URL;
const ContactPage = () => {
  const [formData, setFormData] = useState({ message: '' });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/user/sendfeedback`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAlert({ message: 'Your message has been sent!', type: 'success' });
      setFormData({ message: '' });
    } catch (error) {
      setAlert({ message: 'Failed to send your message. Please try again.', type: 'error' });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contact Us</h2>
      {alert && (
        <div className={alert.type === 'success' ? styles.success : styles.error}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className={styles.textarea}
          placeholder="Your Message"
        ></textarea>
        <button type="submit" className={styles.button}>Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
