import React, { useState, useEffect, useRef } from 'react';
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
  const [startTime, setStartTime] = useState(null); // 게임 시작 시간
  const [endTime, setEndTime] = useState(null); // 게임 종료 시간
  const [elapsedTime, setElapsedTime] = useState(''); // 소요 시간 문자열
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);


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

  const selectNextQuestion = () => {
    let currentQuestions = selectedQuestionsIndex === 1 ? selectedQuestions1 : selectedQuestions2;
    let otherQuestions = selectedQuestionsIndex === 1 ? selectedQuestions2 : selectedQuestions1;
    const updateQuestions = selectedQuestionsIndex === 1 ? setSelectedQuestions1 : setSelectedQuestions2;
  
    // 사용 가능한 문제 인덱스들을 찾습니다.
    let availableIndexes = quizData
      .map((_, index) => index)
      .filter(index => !currentQuestions.includes(index) && !otherQuestions.includes(index));
  
    if (availableIndexes.length === 0) {
      // 모든 문제가 사용되었다면, 현재 문제 배열을 초기화합니다.
      updateQuestions([]);
      // 사용 가능한 인덱스를 다시 계산합니다.
      availableIndexes = quizData
        .map((_, index) => index)
        .filter(index => !otherQuestions.includes(index));
    }
  
    // 사용 가능한 문제 중 랜덤으로 하나를 선택합니다.
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  
    // 선택된 문제 인덱스를 현재 문제 배열에 추가합니다.
    updateQuestions(prev => [...prev, randomIndex]);
  
    // 새로운 문제를 설정합니다.
    setCurrentQuestion(quizData[randomIndex].question);
    setAnswer('');
    setIsCorrect(null);
  };

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
      setTotalCorrectAnswers(prev => prev + 1); // 전체 정답 수 업데이트
      setScore(prevScore => {
        const updatedScore = prevScore + 1;
        // 점수가 10점에 도달하면 게임 종료
        if (updatedScore === 5) {
          setGameStarted(false);
          setCurrentQuestion('-완- 사자성어 클리어!');
          // 추가적으로 사용자에게 성공 메시지 표시할 수 있음
          setAnswerFeedback("축하합니다! 🎉🥳"); // 축하 메시지 설정
          setShowFeedback(true); // 정답 확인 박스에 메시지를 보여주기 위해
          setEndTime(new Date()); // 게임 종료 시간 기록
        }
        return updatedScore;
      });
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
    setStartTime(new Date());
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

  // 게임 재시작 함수
const handleRestartGame = () => {
  setGameStarted(false);
  setScore(0);
  setTotalAttempts(0);
  setResetCount(0);
  setSelectedQuestions1([]);
  setSelectedQuestions2([]);
  setSelectedQuestionsIndex(1);
  setAnswerFeedback('');
  setShowFeedback(false);
  setTotalCorrectAnswers(0); // 추가: 전체 정답 수도 리셋
  setAnswer(''); // 추가: 입력 필드 초기화
  setStartTime(null); // 시작 시간 초기화
  setEndTime(null); // 종료 시간 초기화
  setElapsedTime(''); // 소요 시간 문자열 초기화
  // 여기에 게임을 초기 상태로 리셋하는 로직 추가
};

useEffect(() => {
  // Kakao SDK 스크립트 로드 확인
  if (window.Kakao && !window.Kakao.isInitialized()) {
    // Kakao SDK 초기화
    window.Kakao.init('f3438471c74bd17d21dabd6e2009c64c');
  }
}, []);

const shareOnKakao = () => {
  // Kakao 공유 기능이 준비되었는지 확인
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: 'Quizfy 게임 공유하기',
        description: `정답률: ${((totalCorrectAnswers / totalAttempts) * 100).toFixed(2)}%, 도전 시간: ${elapsedTime}`,
        imageUrl: 'https://quizfi.github.io/saja',
        link: {
          mobileWebUrl: 'https://quizfi.github.io/saja',
          webUrl: 'https://quizfi.github.io/saja'
        },
      },
      buttons: [
        {
          title: '게임하기',
          link: {
            mobileWebUrl: 'https://quizfi.github.io/saja',
            webUrl: 'https://quizfi.github.io/saja'
          },
        },
      ],
    });
  } else {
    console.error('Kakao SDK not loaded or initialized');
  }
}

    // 게임 시작 및 새로운 문제 선택 시 정답 입력 박스에 자동 포커스
    useEffect(() => {
      if (gameStarted && answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }, [gameStarted, currentQuestion]);

      // 게임 종료 시 소요된 시간 계산
  useEffect(() => {
    if (startTime && endTime) {
      const duration = endTime - startTime; // 밀리초 단위
      const seconds = Math.floor((duration / 1000) % 60);
      const minutes = Math.floor((duration / (1000 * 60)) % 60);
      setElapsedTime(`${minutes}분 ${seconds}초`);
    }
  }, [startTime, endTime]); // endTime이 변경될 때마다 실행

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
  {!gameStarted && score === 5 && (
          <div className="results-display">
            <p>사자성어 클리어!!</p>
            <p>-총 도전 시간: {elapsedTime}</p> {/* 소요 시간 추가 */}
            <p>-총 도전한 문제수: {totalAttempts} 문제</p>
            <p>-총 정답 수: {totalCorrectAnswers} 문제</p>
            <p>-총 오답 수: {resetCount} 문제</p>
            <p>-정답률: {((totalCorrectAnswers / totalAttempts) * 100).toFixed(2)}%</p>
<button className="restart-button" onClick={handleRestartGame}>재도전하기</button>
<button className="share-button" onClick={shareOnKakao}>공유하기</button>
<button className="home-button" onClick={() => navigate('/')}>홈으로</button>
          </div>
        )}
  <div className="quiz-content">
  {gameStarted ? currentQuestion : score === 5 ? "" : "스타트 버튼을 누르면 게임이 시작됩니다."}
  <div className="score-box" style={{ visibility: gameStarted ? 'visible' : 'hidden' }}>
              SCORE: {score}점 
            </div>
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
        {showFeedback && gameStarted && score < 5 && (
          <div className="feedback-overlay">
            <div className="box answer-check-box">
              {isCorrect === false && <div>❌오답입니다. {answerFeedback}</div>}
              {isCorrect === true && <div>🟢정답입니다.</div>}
              {isCorrect === null && <div>정답확인</div>}
            </div>
            <div
         className={`box next-question-box ${!gameStarted ? 'disabled' : ''}`}
        onClick={handleNextQuestionClick}>
  <FontAwesomeIcon icon={faArrowRight} size="2x" /> {/* 화살표 아이콘 사용 */}
</div>
          </div>
        )}
  
      {/* 게임 시작 버튼 (목표점수에 도달하면 숨김) */}
      {!gameStarted && score < 5 && (
        <div className="box start-box" onClick={handleStartGame}>START</div>
      )}



{!gameStarted && score === 5 && (
        <div className="feedback-overlay">
          <div className="box answer-check-box">
            {answerFeedback}
          </div>
        </div>
      )}


      </div>
    </div>
  );
};

export default QuizGame;