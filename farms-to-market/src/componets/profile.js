

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, logout } from './userSlice';
import { Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setProfileImage(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    for (const key in updatedUser) {
      formData.append(key, updatedUser[key]);
    }
    dispatch(updateUserProfile(formData));
    setEditMode(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-profile-container">
      {user ? (
        <div className="user-details">
          <div className="profile-image">
            <img className="profile-img" src={user.profileImageURL} alt="profile" />
            <button onClick={() => setEditMode(!editMode)} className="edit-button">
              <img className="editlogo" src="edit.png" alt="Edit" />
            </button>
            {editMode && (
              <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            )}
          </div >
          <form onSubmit={handleSubmit}>
            <div className="user-info">
              <div className='user_data'>
                <span className="user-label">Role:</span>
                {editMode ? (
                  <input
                    className="user-input"
                    type="text"
                    name="role"
                    value={updatedUser.role || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.role
                )}
              </div>
              <div className='user_data'>
                <span className="user-label">Name:</span>
                {editMode ? (
                  <input
                    className="user-input"
                    type="text"
                    name="fullName"
                    value={updatedUser.fullName || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.fullName
                )}
              </div>
              <div className='user_data'>
                <span className="user-label">Email:</span>
                {editMode ? (
                  <input
                    className="user-input"
                    type="email"
                    name="email"
                    value={updatedUser.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </div>
              <div className='user_data'>
                <span className="user-label">Mobile:</span>
                {editMode ? (
                  <input
                    className="user-input"
                    type="tel"
                    name="M_number"
                    value={updatedUser.M_number || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.M_number
                )}
              </div>
              <div className='user_data'>
                <span className="user-label">Address:</span>
                {editMode ? (
                  <input
                    className="user-input"
                    type="text"
                    name="address"
                    value={updatedUser.address || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.address
                )}
              </div>
            </div>
            {editMode && <button type="submit">Save</button>}
          </form>
        </div>
      ) : (
        <div>No user profile found</div>
      )}
      <div className="user-actions">
        {user && user.role === 'Buyer' ? (

          <Link className="my-product" to="/cart">Go to Cart</Link>

        ) : (

          <Link className="my-product" to="/myproduct">
            My Products
          </Link>

        )}
        <Link className="logout" to="/logout" onClick={() => dispatch(logout())}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
