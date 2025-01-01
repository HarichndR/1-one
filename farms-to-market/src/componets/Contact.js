import React, { useState } from 'react';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your server
    setAlert({ message: 'Your message has been sent!', type: 'success' });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contact Us</h2>
      {alert && <div className={alert.type === 'success' ? styles.success : styles.error}>{alert.message}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Your Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Your Email"
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className={styles.input}
          placeholder="Subject"
        />
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
