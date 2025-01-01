// FarmerDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector} from 'react-redux';
import { fetchUserProfile } from './userSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:8001'); // Adjust the URL to your server

const NotificationList = () => {
    const dispatch= useDispatch();
    const {user}= useSelector((state)=>state.user)
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    dispatch(fetchUserProfile());
    socket.emit('join', user._id);

    socket.on('newMessage', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [user._id,dispatch]);

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      {notifications.length > 0 && (
        <div>
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                New message from {notification.message.sender.name}: {notification.message.text}
                <Link to={`/chat/${notification.chatId}`}>Go to Chat</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Other dashboard content */}
    </div>
  );
};

export default NotificationList;
