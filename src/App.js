import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use BrowserRouter
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './components/Home';
import CardFilter from './components/CardFilter';
import Auth from './components/Auth';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}> {/* Replace with your Client ID */}
      <Router>
        <Routes>
          <Route path="/CardTek" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/card-filter" element={<CardFilter />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
