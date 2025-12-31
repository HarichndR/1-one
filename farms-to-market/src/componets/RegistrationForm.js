import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegistrationForm.css'; // Import your CSS file here
import { useNavigate } from 'react-router-dom';
const url = process.env.REACT_APP_BACKEND_URL;

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const [fullName, setFullName] = useState('');
  const [M_number, setM_number] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Buyer');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({});

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000); // alert disappears after 5 seconds

      if (alert.type === 'success') {
        setTimeout(() => {
          navigate('/login'); // redirect to login page after 5 seconds
        }, 2000);
      }

      return () => clearTimeout(timer); // cleanup the timer on component unmount
    }
  }, [alert, navigate]);

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
    setProfileImgPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!M_number) {
      newErrors.M_number = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(M_number)) {
      newErrors.M_number = 'Mobile Number must be 10 digits';
    }
    if (!address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append('profileImg', profileImg);
    data.append('fullName', fullName);
    data.append('email', email);
    data.append('M_number', M_number);
    data.append('password', password);
    data.append('address', address);
    data.append('role', role);

    try {
      const response = await axios.post(`${url}/user/Register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setAlert({ message: 'Registration successful', type: 'success' });
      } else {
        setAlert({ message: 'Registration unsuccessful, please try again', type: 'error' });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setAlert({ message: 'An error occurred, please try again', type: 'error' });
    }
  };

  return (
    <>
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}

      <form className="registration-form" onSubmit={handleSubmit}>

        <div>
          <label htmlFor="profileImg">Profile Image:</label>
          <input
            type="file"
            id="profileImg"
            name="profileImg"
            accept="image/*"
            onChange={handleProfileImgChange}
          />
          {profileImgPreview && (
            <div>
              <img src={profileImgPreview} alt="Profile Preview" className="profile-img-preview" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label htmlFor="M_number">Mobile Number:</label>
          <input
            type="text"
            id="M_number"
            name="M_number"
            value={M_number}
            onChange={(e) => setM_number(e.target.value)}
          />
          {errors.M_number && <span className="error">{errors.M_number}</span>}
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Farmer">Farmer</option>
            <option value="Buyer">Buyer</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegistrationForm;
