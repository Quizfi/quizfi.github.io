import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import 합니다.
import './QuizGame.css';
import quizData from '../db/quizData.json';




const QuizGame = () => {
  const [countdown, setCountdown] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeoutText, setTimeoutText] = useState(false);
  const [score, setScore] = useState(0);
  const [restartVisible, setRestartVisible] = useState(false);
  const [selectedQuestions1, setSelectedQuestions1] = useState([]);
  const [selectedQuestions2, setSelectedQuestions2] = useState([]);
  const [selectedQuestionsIndex, setSelectedQuestionsIndex] = useState(1);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const answerInputRef = useRef(null);
  const timerRef = useRef(null);
  const correctSound = useRef(new Audio('/correct.mp3'));
  const ticTokSound = useRef(null);




  const playCorrectSound = useCallback(() => {
    correctSound.current.currentTime = 0;
    correctSound.current.play();
  }, []);


//주석

  const playIncorrectSound = useCallback(() => {
    const incorrectSound = new Audio('/incorrect.mp3');
    incorrectSound.currentTime = 0;
    incorrectSound.play();
  }, []);




  const playTicTokSound = useCallback(() => {
    // 기존에 재생 중인 사운드가 있다면 중지합니다.
    if (ticTokSound.current) {
      ticTokSound.current.pause();
      ticTokSound.current.currentTime = 0;
    }
 
    // 새 사운드 재생을 준비합니다.
    ticTokSound.current = new Audio('/tictok.mp3');
    ticTokSound.current.play().catch(error => console.log(error));
  }, []);


  useEffect(() => {
    // 컴포넌트가 언마운트될 때, 오디오 재생을 정리합니다.
    return () => {
      if (ticTokSound.current) {
        ticTokSound.current.pause();
        ticTokSound.current = null;
      }
    };
  }, []);


  const startCountdown = useCallback(() => {
    if (!gameStarted || countdown <= 0) {
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 1) {
          playTicTokSound();
          return prevCountdown - 1;
        } else {
          setIsCorrect(null);
          clearInterval(timerRef.current);
          answerInputRef.current.disabled = true;
          setRestartVisible(true);
          playIncorrectSound();
          setTimeoutText(true);
          return 0;
        }
      });
    }, 1000);
  }, [gameStarted, countdown, playTicTokSound, playIncorrectSound, answerInputRef, setIsCorrect, setRestartVisible, setTimeoutText]);




  const handleStartGame = () => {
    setGameStarted(true);
    setCountdown(5);
    setScore(0);
    setTimeout(() => {
      answerInputRef.current.focus();
    }, 10);
    selectNextQuestion();
  };




  const selectNextQuestion = () => {
    const selectedQuestions = selectedQuestionsIndex === 1 ? selectedQuestions1 : selectedQuestions2;
    const setSelectedQuestions = selectedQuestionsIndex === 1 ? setSelectedQuestions1 : setSelectedQuestions2;




    if (selectedQuestions.length === quizData.length) {
      setGameStarted(false);
      return;
    }




    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quizData.length);
    } while (selectedQuestions.includes(randomIndex));




    setSelectedQuestions([...selectedQuestions, randomIndex]);
    setCurrentQuestion(quizData[randomIndex].question);
    setAnswer('');
    setCountdown(5);
    startCountdown();
  };




  const handleInputChange = (event) => {
    setAnswer(event.target.value);
  };




  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      // 게임이 시작되지 않았거나 종료되었으면, 아무 동작도 하지 않습니다.
      if (!gameStarted) {
        return;
      }
      checkAnswer();
    }
  };




  const checkAnswer = () => {
    const currentQuiz = quizData.find((item) => item.question === currentQuestion);
    if (!currentQuiz) {
      console.error('현재 질문을 찾을 수 없습니다.');
      return;
    }




    const correctAnswer = currentQuiz.correctAnswer.join('');
    if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setIsCorrect(true);
      setScore(score + 1);
      clearInterval(timerRef.current);
      setTimeout(() => {
        setIsCorrect(null);
        selectNextQuestion();
      }, 1000);
      setRestartVisible(false);
      playCorrectSound();
    } else {
      if (!timeoutText) {
        clearInterval(timerRef.current);
        answerInputRef.current.disabled = true;
        setRestartVisible(true);
        playIncorrectSound();
        setIsCorrect(false);
        const formattedCorrectAnswer = currentQuiz.correctAnswer.join('');
        setAnswerFeedback(`(정답: ${formattedCorrectAnswer})`);
      }
    }
    setTimeout(() => {
      answerInputRef.current.focus();
    }, 10);
  };




  const handleRestartClick = () => {
    setGameStarted(true);
    setCountdown(5);
    setScore(0);
    setIsCorrect(null);
    setRestartVisible(false);
    setTimeoutText(false);
    answerInputRef.current.disabled = false;
    setAnswer('');
    setTimeout(() => {
      answerInputRef.current.focus();
    }, 10);
    if (selectedQuestionsIndex === 1) {
      setSelectedQuestions2([]);
      selectNextQuestion();
    } else {
      setSelectedQuestions1([]);
      selectNextQuestion();
    }
  };




  useEffect(() => {
    if (gameStarted) {
      startCountdown();
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, startCountdown]);




  useEffect(() => {
    if (timeoutText || isCorrect === false) {
      const currentQuiz = quizData.find((item) => item.question === currentQuestion);
      if (currentQuiz) {
        const formattedCorrectAnswer = currentQuiz.correctAnswer.join('');
        setAnswerFeedback(`(정답: ${formattedCorrectAnswer})`);
      }
    }
  }, [timeoutText, isCorrect, currentQuestion]);




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


  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.


  // 홈 화면으로 돌아가는 함수
  const goToHome = () => {
    navigate('/'); // 홈 화면으로 이동
  };






  return (
    <div>
      <div className="header">
        {/* "Quizfy" 텍스트에 onClick 이벤트 핸들러를 추가합니다. */}
        <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>📚 Quizfy</h1>
      </div>
      <div className="lion-saying-quiz-text">사자성어 퀴즈</div>
      <div className="quiz-game-container">
      <div className="box quiz-box">
  {gameStarted ? currentQuestion : (score === quizData.length ? "-완- 당신은 사자성어 왕!!!" : <div>스타트 버튼을 누르면 게임이 시작됩니다. <br />(제한시간: 5초)</div>)}
</div>
        <div className="box-wrapper">
          <input
            ref={answerInputRef}
            type="text"
            className="box answer-input-box"
            value={answer}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
            placeholder="정답을 입력하세요."
            disabled={!gameStarted || timeoutText}
          />
        <div
          className={`box enter-box ${!gameStarted || timeoutText ? 'disabled' : ''}`}
          onClick={!gameStarted || timeoutText ? null : checkAnswer}
        >
            ENTER
        </div>
          <div className="box score-box">
            SCORE: {score}점
          </div>
        </div>
        <div className="box answer-check-box">
          {isCorrect === null && timeoutText && <div>⏰시간 초과! {answerFeedback}</div>}
          {isCorrect === false && <div>❌오답입니다. {answerFeedback}</div>}
          {isCorrect === true && <div>🟢정답입니다.</div>}
          {isCorrect === null && !timeoutText && (
        <div>{gameStarted || score !== quizData.length ? '정답 확인' : '🎉축하합니다! 🥳'}</div>
        )}
        </div>
        {!gameStarted && (
          <div className="box start-box" onClick={handleStartGame}>
            START
          </div>
        )}
        {(restartVisible && (timeoutText || isCorrect !== null)) && (
          <div className="box restart-box" onClick={handleRestartClick}>
            🔄RESTART
          </div>
        )}
        <div className="box countdown-box">
          {countdown === 0 ? '0' : countdown}
        </div>
      </div>
    </div>
  );
};




export default QuizGame;
