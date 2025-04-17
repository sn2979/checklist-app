import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChecklistList from './components/ChecklistList';
import ChecklistPage from './components/ChecklistPage';
import PublicCheckListPage from './components/PublicCheckListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChecklistList />} />
        <Route path="/checklists/:id" element={<ChecklistPage />} />
        <Route path="/checklists/public/:publicId" element={<PublicCheckListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
