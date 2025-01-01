
import Table from './Table';
import React from 'react';
//import { Link } from 'react-router-dom';
import "./Navbar.css";
import './Home.css';
import Sidebar from './Sidebar';
//import Navbar from 

function Home() {
    return (
      <div className="home-container">
      <Sidebar/>
      <div className='main-content-table'>
    <Table/></div>
        </div>

    );
}

export default Home;
