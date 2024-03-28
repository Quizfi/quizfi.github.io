import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizGame.css';
import quizData from '../db/quizData.json';

const QuizGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedQuestions1, setSelectedQuestions1] = useState([]);
  const [selectedQuestions2, setSelectedQuestions2] = useState([]);
  const [selectedQuestionsIndex, setSelectedQuestionsIndex] = useState(1);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const answerInputRef = useRef(null);
  const correctSound = useRef(new Audio('/correct.mp3'));

  const playCorrectSound = useCallback(() => {
    correctSound.current.currentTime = 0;
    correctSound.current.play();
  }, []);

  const playIncorrectSound = useCallback(() => {
    const incorrectSound = new Audio('/incorrect.mp3');
    incorrectSound.currentTime = 0;
    incorrectSound.play();
  }, []);

  const selectNextQuestion = useCallback(() => {
    const selectedQuestions = selectedQuestionsIndex === 1 ? selectedQuestions1 : selectedQuestions2;
    const setSelectedQuestions = selectedQuestionsIndex === 1 ? setSelectedQuestions1 : setSelectedQuestions2;

    if (selectedQuestions.length === quizData.length) {
      setGameStarted(false);
      setCurrentQuestion('-완- 당신은 사자성어 왕!!');
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quizData.length);
    } while (selectedQuestions.includes(randomIndex));

    setSelectedQuestions([...selectedQuestions, randomIndex]);
    setCurrentQuestion(quizData[randomIndex].question);
    setAnswer('');
    answerInputRef.current.disabled = false;
    setIsCorrect(null);
  }, [selectedQuestions1, selectedQuestions2, selectedQuestionsIndex]);

  const handleInputChange = (event) => {
    setAnswer(event.target.value);
  };

  const checkAnswer = () => {
    if (!gameStarted || answer.trim().length === 0) return; // 게임이 시작되지 않았거나 입력 필드가 비어있으면 반환
  
    const currentQuiz = quizData.find((item) => item.question === currentQuestion);
    if (!currentQuiz) {
      console.error('현재 질문을 찾을 수 없습니다.');
      return;
    }
  
    const correctAnswer = currentQuiz.correctAnswer.join('');
    if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setIsCorrect(true);
      setScore(score + 1);
      playCorrectSound();
      setShowFeedback(true); // 정답일 때 피드백 박스를 표시합니다.
    } else {
      setIsCorrect(false);
      playIncorrectSound();
      const formattedCorrectAnswer = currentQuiz.correctAnswer.join('');
      setAnswerFeedback(`(정답: ${formattedCorrectAnswer})`);
      setShowFeedback(true); // 오답일 때 피드백 박스를 표시합니다.
    }
  };

  useEffect(() => {
    if (score === quizData.length) {
      setGameStarted(false);
      setCurrentQuestion('-완- 당신은 사자성어 왕!!');
    }
  }, [score]);

  useEffect(() => {
    if (selectedQuestionsIndex === 1) {
      if (selectedQuestions1.length === quizData.length) {
        setSelectedQuestionsIndex(2);
      }
    } else {
      if (selectedQuestions2.length === quizData.length) {
        setSelectedQuestionsIndex(1);
      }
    }
  }, [selectedQuestions1, selectedQuestions2, selectedQuestionsIndex]);

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    selectNextQuestion();
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && gameStarted) {
      checkAnswer();
    }
  };
  
  const handleNextQuestionClick = () => {
    if (isCorrect !== null || !gameStarted) {
      selectNextQuestion();
      setIsCorrect(null);
      setShowFeedback(false); // 다음 문제로 넘어갈 때 피드백 박스를 숨깁니다.
    }
  };

  useEffect(() => {
    if (gameStarted) {
      answerInputRef.current.focus();
    }
  }, [gameStarted, currentQuestion]);

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* 헤더 및 소개 텍스트 */}
      <div className="header">
        <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>📚 Quizfy</h1>
      </div>
      <div className="lion-saying-quiz-text">사자성어 퀴즈</div>
      
      <div className="quiz-game-container">
        {/* 현재 문제 표시 */}
        <div className="box quiz-box">
          {gameStarted ? currentQuestion : (score === quizData.length ? "-완- 당신은 사자성어 왕!!!" : <div>스타트 버튼을 누르면 게임이 시작됩니다.</div>)}
        </div>
  
        {/* 입력 박스 및 ENTER 버튼 */}
        <div className="box-wrapper">
          <input
            ref={answerInputRef}
            type="text"
            className="box answer-input-box"
            value={answer}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
            placeholder="정답을 입력하세요."
            disabled={!gameStarted}
          />
          <div
            className="box enter-box"
            onClick={checkAnswer}
          >
            ENTER
          </div>
        </div>
  
        {/* '정답 확인' 및 '다음 문제' 박스 (조건부 렌더링) */}
        {showFeedback && (
          <div className="feedback-overlay">
            <div className="box answer-check-box">
              {isCorrect === false && <div>❌오답입니다. {answerFeedback}</div>}
              {isCorrect === true && <div>🟢정답입니다.</div>}
              {isCorrect === null && <div>정답확인</div>}
            </div>
            <div
              className={`box next-question-box ${!gameStarted ? 'disabled' : ''}`}
              onClick={handleNextQuestionClick}
            >
              NEXT QUESTION
            </div>
          </div>
        )}
  
        {/* 점수 표시 */}
        <div className="box score-box">
          SCORE: {score}점
        </div>
  
        {/* 게임 시작 버튼 */}
        {!gameStarted && (
          <div className="box start-box" onClick={handleStartGame}>
            START
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;