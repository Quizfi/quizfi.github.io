import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizGame.css';
import quizData from '../db/quizData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const QuizGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [selectedQuestions1, setSelectedQuestions1] = useState([]);
  const [selectedQuestions2, setSelectedQuestions2] = useState([]);
  const [selectedQuestionsIndex, setSelectedQuestionsIndex] = useState(1);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const answerInputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let savedScrollPosition = 0;
    let originalHeight = window.innerHeight;
  
    const handleResize = () => {
      const newHeight = window.innerHeight;
      if (newHeight < originalHeight) {
        savedScrollPosition = window.scrollY;
        window.scrollTo({ top: 60, behavior: 'auto' });
      } else {
        window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
      }
      originalHeight = newHeight;
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const selectNextQuestion = useCallback(() => {
    const selectedQuestions = selectedQuestionsIndex === 1 ? selectedQuestions1 : selectedQuestions2;
    const setSelectedQuestions = selectedQuestionsIndex === 1 ? setSelectedQuestions1 : setSelectedQuestions2;

    if (score >= 10) {
      // 게임 성공 종료 조건
      setGameStarted(false);
      setCurrentQuestion('-완- 사자성어 클리어!');
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quizData.length);
    } while (selectedQuestions.includes(randomIndex));

    setSelectedQuestions(prev => [...prev, randomIndex]);
    setCurrentQuestion(quizData[randomIndex].question);
    setAnswer('');
    setIsCorrect(null);
    answerInputRef.current && (answerInputRef.current.disabled = false);
  }, [selectedQuestions1, selectedQuestions2, selectedQuestionsIndex, score]);

  const checkAnswer = () => {
    if (!gameStarted || answer.trim().length === 0) return;

    const currentQuiz = quizData.find((quiz) => quiz.question === currentQuestion);
    if (!currentQuiz) {
      console.error('현재 질문을 찾을 수 없습니다.');
      return;
    }

    const correctAnswer = currentQuiz.correctAnswer.join('');
    setTotalAttempts(prev => prev + 1);

    if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setIsCorrect(true);
      setScore(prevScore => prevScore + 1);
    } else {
      setIsCorrect(false);
      setScore(0); // 점수 초기화
      setResetCount(prev => prev + 1); // 오답 횟수 증가
      setAnswerFeedback(`(정답: ${correctAnswer})`);
    }
    setShowFeedback(true);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setResetCount(0);
    setSelectedQuestions1([]);
    setSelectedQuestions2([]);
    setSelectedQuestionsIndex(1);
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
      setShowFeedback(false);
    }
  };

    // 게임 시작 및 새로운 문제 선택 시 정답 입력 박스에 자동 포커스
    useEffect(() => {
      if (gameStarted && answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }, [gameStarted, currentQuestion]);

  const handleInputChange = (event) => {
    setAnswer(event.target.value);
  };

  const goToHome = () => {
    navigate('/');
  };


  return (
    <div>
      {/* 헤더 및 소개 텍스트 */}
      <div className="header">
      <Helmet>
        <title>Quizfy</title>
        <meta name="description" content="사자성어 퀴즈 게임을 도전해보세요!" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="사자성어, 퀴즈, 킬링타임, 도전, 게임" />
        <meta property="og:title" content="Quizfy: 사자성어 퀴즈 게임" />
        <meta property="og:description" content="Quizfy에서 사자성어 퀴즈를 즐겨보세요. 지식을 테스트하고 새로운 것을 배울 기회를 가질 수 있습니다." />
        <meta property="og:url" content="https://quizfi.github.io/saja" />
        {/* 다른 SEO 관련 태그를 여기에 추가할 수 있습니다. */}
      </Helmet>
  <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>📚 Quizfy</h1>
  <div className="header-title">사자성어</div>
</div>      
      <div ref={containerRef} className="quiz-game-container">
        {/* 현재 문제 표시 */}
        <div className="quiz-box">
        <div className="quiz-box-header">
        <div className="controls-container">
        <span className="control-button"></span>
        <span className="control-button"></span>
        <span className="control-button"></span>
    </div>
  </div>
  {!gameStarted && score === 10 && (
          <div className="results-display">
            <p>-완- 사자성어 클리어!</p>
            <p>총 도전한 문제수: {totalAttempts}</p>
            <p>총 정답 수: {score}</p>
            <p>총 초기화된 횟수: {resetCount}</p>
            <p>정답률: {((score / totalAttempts) * 100).toFixed(2)}%</p>
          </div>
        )}
  <div className="quiz-content">
    {gameStarted ? currentQuestion : (score === quizData.length ? "-완- 당신은 사자성어 왕!!!" : <div>스타트 버튼을 누르면 게임이 시작됩니다. <br /> *클리어조건: 10점</div>)}
    <div className="score-box">SCORE: {score}점</div>
  </div>
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
          disabled={!gameStarted || isCorrect !== null} // 수정된 조건
          autoComplete="new-password" // 자동완성 비활성화
        />

        <div
          className={`box enter-box ${!gameStarted || isCorrect !== null ? 'disabled' : ''}`}
          onClick={() => {
          if(gameStarted && isCorrect === null) {
          checkAnswer();
        }
        }}
        >
  <FontAwesomeIcon icon={faArrowUpFromBracket} />
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
  <FontAwesomeIcon icon={faArrowRight} size="2x" /> {/* 화살표 아이콘 사용 */}
</div>
          </div>
        )}
  
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