import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmotionQuiz.css';
import quizData from '../db/emoticonQuizData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const EmoticonQuiz = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedQuestions1, setSelectedQuestions1] = useState([]);
  const [answerFeedback, setAnswerFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const answerInputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(null); // 게임 시작 시간
  const [endTime, setEndTime] = useState(null); // 게임 종료 시간
  const [elapsedTime, setElapsedTime] = useState(''); // 소요 시간 문자열
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentHint, setCurrentHint] = useState('');


  const formatQuestionNumber = (number) => {
    return number.toString().padStart(2, '0');
  };

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
    const nextQuestionIndex = selectedQuestions1.findIndex(index => quizData[index].question === currentQuestion) + 1;
    if (nextQuestionIndex < selectedQuestions1.length) {
      // nextQuestion 변수에 할당 없이 직접 quizData에서 문제와 힌트를 가져옵니다.
      const nextQuestion = quizData[selectedQuestions1[nextQuestionIndex]];
      setCurrentQuestion(nextQuestion.question);
      setCurrentHint(nextQuestion.hint); // 힌트 설정
      setAnswer('');
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  const checkAnswer = () => {
    if (!gameStarted || answer.trim().length === 0) return;
  
    const currentQuiz = quizData.find((quiz) => quiz.question === currentQuestion);
    if (!currentQuiz) {
      console.error('현재 질문을 찾을 수 없습니다.');
      return;
    }
  
    // 모든 공백 제거 후 소문자로 변환
    const userAnswer = answer.replace(/\s+/g, '').toLowerCase();
    const correctAnswer = currentQuiz.correctAnswer.join('').replace(/\s+/g, '').toLowerCase();
  
    setTotalAttempts((prev) => prev + 1);
  
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setTotalCorrectAnswers((prev) => prev + 1); // 정답 수 업데이트
      setScore((prevScore) => prevScore + 1); // 점수 업데이트
    } else {
      setIsCorrect(false);
      // 사용자에게 원래의 정답 포맷을 보여주기 위해, 모든 공백을 제거하지 않은 원본 정답을 사용
      setAnswerFeedback(`(정답: ${currentQuiz.correctAnswer.join('')})`);
    }
    setShowFeedback(true);
  
    // 모든 문제가 출제되었는지 확인
    if (totalAttempts + 1 >= 10) {
      setEndTime(new Date()); // 게임 종료 시간 기록
      // 모든 문제를 푼 경우 게임 종료 처리 및 결과창 표시를 위한 상태 업데이트
      setGameStarted(false);
      setShowResult(true); // 결과창 표시를 위한 상태를 true로 설정
    }
  };

  const handleStartGame = () => {
    // 게임 상태, 점수, 시도 횟수 등을 초기화
    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setTotalCorrectAnswers(0); // 정답 수 초기화
    setShowFeedback(false);
  
    // 10개의 랜덤 문제 선정
    const randomQuestions = [];
    while (randomQuestions.length < 10) {
      const randomIndex = Math.floor(Math.random() * quizData.length);
      if (!randomQuestions.includes(randomIndex)) {
        randomQuestions.push(randomIndex);
      }
    }
    setSelectedQuestions1(randomQuestions); // 첫 번째 문제 세트에 랜덤 문제 저장
    const firstQuestion = quizData[randomQuestions[0]]; // 첫 문제 객체 가져오기
    setCurrentQuestion(firstQuestion.question); // 첫 문제로 시작
    setCurrentHint(firstQuestion.hint); // 첫 문제의 힌트 설정
    setShowResult(false);
    setStartTime(new Date()); // 게임 시작 시간 기록
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
      setCurrentQuestionNumber(prev => prev + 1); // 문제 번호 업데이트
    }
  };

  // 게임 재시작 함수
  const handleRestartGame = () => {
    setGameStarted(false);
    setScore(0);
    setTotalAttempts(0);
    setSelectedQuestions1([]);
    setAnswerFeedback('');
    setShowFeedback(false);
    setTotalCorrectAnswers(0);
    setAnswer('');
    setStartTime(null);
    setEndTime(null);
    setElapsedTime('');
    setShowResult(false); // 결과창 숨기기
    setIsCorrect(null); // 여기에 추가
    setCurrentQuestionNumber(1);
    // 추가 초기화 로직 필요 시 여기에 추가
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
          title: 'QuizKiwi 공유하기',
          description: `정답률: ${((totalCorrectAnswers / totalAttempts) * 100).toFixed(
            2,
          )}%, 도전 시간: ${elapsedTime}`,
          imageUrl: 'https://gi.esmplus.com/jjumang/quizfi.png',
          link: {
            mobileWebUrl: 'https://quizkiwi.netlify.app/emoticon',
            webUrl: 'https://quizkiwi.netlify.app/emoticon',
          },
        },
        buttons: [
          {
            title: '게임하기',
            link: {
              mobileWebUrl: 'https://quizkiwi.netlify.app/emoticon',
              webUrl: 'https://quizkiwi.netlify.app/emoticon',
            },
          },
        ],
      });
    } else {
      console.error('Kakao SDK not loaded or initialized');
    }
  };

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
          <title>QuizKiwi</title>
          <meta name="description" content="퀴즈키위에서 이모티콘 퀴즈 게임을 도전해보세요!" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="keywords" content="이모티콘, 문장 만들기, 퀴즈, 킬링타임, 도전, 게임, 퀴즈키위, 키위, 컨텐츠" />
          <meta property="og:title" content="QuizKiwi: 이모티콘 퀴즈 게임" />
          <meta
            property="og:description"
            content="퀴즈키위에서 이모티콘 퀴즈를 즐겨보세요! 이모티콘 문장 만들기로 창의력을 키워보세요!!."
          />
          <meta property="og:image" content="https://gi.esmplus.com/jjumang/quizfi.png" />
          <meta property="og:url" content="https://quizkiwi.netlify.app/emoticon" />
          {/* 다른 SEO 관련 태그를 여기에 추가할 수 있습니다. */}
        </Helmet>
        <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>
          🥝 QuizKiwi
        </h1>
        <div className="header-title">이모티콘 퀴즈</div>
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
          {showResult && (
            <div className="results-display">
              <p>이모티콘 퀴즈 클리어!!</p>
              <p>나의 점수: {score}</p>
              <p>정답률: {((totalCorrectAnswers / totalAttempts) * 100).toFixed(2)}%</p>
              <p>총 도전 시간: {elapsedTime}</p> {/* 소요 시간 추가 */}
              <button className="restart-button" onClick={handleRestartGame}>
                재도전하기
              </button>
              <button className="share-button" onClick={shareOnKakao}>
                공유하기
              </button>
              <button className="home-button" onClick={() => navigate('/')}>
                홈으로
              </button>
            </div>
          )}
          
          <div className="quiz-content">
           {gameStarted ? (
    currentQuestion
  ) : !showResult && (
    <>
      <div className="box start-box" onClick={handleStartGame}>
        START
      </div>
      <div>
        스타트 버튼을 누르면 게임이 시작됩니다.
        <br />
        <span style={{ fontSize: '0.7em' }}>
          (문제 수: 10개)
        </span>
      </div>
    </>
    
  )
}            
        {gameStarted && (
    <>
      <div className="hint">(힌트: {currentHint})</div>
    </>
)}

<div className="score-box" style={{ visibility: gameStarted ? 'visible' : 'hidden' }}>
  - {formatQuestionNumber(currentQuestionNumber)} -
</div>
          </div>
        </div>
        {/* 입력 박스 및 ENTER 버튼 */}
        {gameStarted && !showResult && (
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
              if (gameStarted && isCorrect === null) {
                checkAnswer();
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
        </div>
)}

        {/* '정답 확인' 및 '다음 문제' 박스 (조건부 렌더링) */}
        {showFeedback && gameStarted && score < 10 && (
          <div className="feedback-overlay">
            <div className="box answer-check-box">
              {isCorrect === false && <div>❌오답! {answerFeedback}</div>}
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

        {/* 게임 시작 버튼 (목표점수에 도달하면 숨김) */}
        {!gameStarted && !showResult && (
        <div className="box start-box" onClick={handleStartGame}>
            START
        </div>
)}
        {!gameStarted && score === 10 && (
          <div className="feedback-overlay">
            <div className="box answer-check-box">{answerFeedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmoticonQuiz;
