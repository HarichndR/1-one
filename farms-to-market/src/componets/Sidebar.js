import React from 'react';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Weather Information</h2>
      <div className="info">
        <h3>Temperature</h3>
        <p>Current: 25°C</p>
        <p>High: 30°C</p>
        <p>Low: 20°C</p>
      </div>
      <div className="info">
        <h3>Wind</h3>
        <p>Speed: 10 km/h</p>
        <p>Direction: NW</p>
      </div>
      <div className="info">
        <h3>Humidity</h3>
        <p>Current: 60%</p>
      </div>
      <div className="info">
        <h3>Precipitation</h3>
        <p>Chance: 20%</p>
      </div>
      <div className="info">
        <h3>UV Index</h3>
        <p>Level: Moderate</p>
      </div>
      <div className="info">
        <h3>Sunrise & Sunset</h3>
        <p>Sunrise: 6:00 AM</p>
        <p>Sunset: 6:30 PM</p>
      </div>
    </div>
  );
};

export default Sidebar;
