import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import GoogleSheets from './components/GoogleSheets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/google-sheets" element={<GoogleSheets />} />
      </Routes>
    </Router>
  );
}

export default App;