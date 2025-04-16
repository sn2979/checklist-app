import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChecklistList from './components/ChecklistList';
import ChecklistPage from './components/ChecklistPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChecklistList />} />
        <Route path="/checklists/:id" element={<ChecklistPage />} />
      </Routes>
    </Router>
  );
}

export default App;
