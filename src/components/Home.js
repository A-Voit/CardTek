import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';  // Importing the new CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1 className="hero-title">Welcome to Card-Tek</h1>
        <p className="hero-subtitle">Your hub for the hobby</p>
        <Link to="/google-sheets">
          <button className="hero-button">View Sports Cards</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;