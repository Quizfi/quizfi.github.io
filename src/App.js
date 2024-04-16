import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Home/HomePage';
import QuizGame from './components/QuizGame';
import EmotionQuiz from './components/EmotionQuiz';
import FakenewsQuiz from './components/FakenewsQuiz'; // FakenewsQuiz 컴포넌트 임포트

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saja" element={<QuizGame />} />
        <Route path="/emoticon" element={<EmotionQuiz />} />
        <Route path="/fakenews" element={<FakenewsQuiz />} /> 
      </Routes>
    </Router>
  );
}

export default App;