import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Sheets from './components/DisplayCollection';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/CardTek" element={<Auth />} />
        <Route path="/card-filter" element={<Sheets />} />
      </Routes>
    </Router>
  );
};

export default App;
