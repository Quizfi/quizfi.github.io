import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Home/HomePage'; // HomePage 컴포넌트의 경로에 맞게 조정하세요.
import QuizGame from './components/QuizGame'; // QuizGame 컴포넌트의 경로에 맞게 조정하세요.

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saja" element={<QuizGame />} />
      </Routes>
    </Router>
  );
}

export default App;