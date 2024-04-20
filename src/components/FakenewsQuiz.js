import React, { useState, useEffect } from 'react';
import './FakenewsQuiz.css';
import quizData from '../db/fakenewsData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const FakenewsQuiz = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [currentNews, setCurrentNews] = useState({});
    const [isAnswerShown, setIsAnswerShown] = useState(false);
    const [answerMessage, setAnswerMessage] = useState('');
    const [startTime] = useState(Date.now());
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const selectedQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, 10);
        setRandomQuestions(selectedQuestions);
        setCurrentNews(selectedQuestions[0] || {});
    }, []);

    useEffect(() => {
        setCurrentNews(randomQuestions[currentNewsIndex] || {});
    }, [currentNewsIndex, randomQuestions]);

    const checkAnswer = (userAnswer) => {
        const isCorrect = userAnswer === currentNews.answer;
        setAnswerMessage(isCorrect ? `정답! ${userAnswer ? "진실" : "거짓"}입니다!` : `오답! ${!userAnswer ? "진실" : "거짓"}입니다!`);
        setIsAnswerShown(true);
        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }
        if (currentNewsIndex === randomQuestions.length - 1) {
            setShowResults(true);
        }
    };

    const nextQuestion = () => {
        if (currentNewsIndex < randomQuestions.length - 1) {
            setCurrentNewsIndex(currentNewsIndex + 1);
            setIsAnswerShown(false);
            setAnswerMessage('');
        }
    };

    const handleRestartGame = () => {
        setCurrentNewsIndex(0); // 첫 번째 뉴스 인덱스로 재설정
        setIsAnswerShown(false); // 답변 표시 상태 초기화
        setAnswerMessage(''); // 답변 메시지 초기화
        setCorrectAnswers(0); // 정답 수 초기화
        setShowResults(false); // 결과 표시 상태 초기화
        // 랜덤 질문 재설정
        const newQuestions = quizData.sort(() => 0.5 - Math.random()).slice(0, 10);
        setRandomQuestions(newQuestions);
        setCurrentNews(newQuestions[0]);
    };

    const shareOnKakao = () => {
        // Kakao 공유 기능이 준비되었는지 확인
        if (window.Kakao && window.Kakao.isInitialized()) {
          window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: 'QuizKiwi 공유하기',
              description: `정답률: ${((correctAnswers / randomQuestions.length) * 100).toFixed(2)}%, 도전 시간: ${((Date.now() - startTime) / 1000).toFixed(2)}초`,
              imageUrl: 'https://gi.esmplus.com/jjumang/quizfi.png',
              link: {
                mobileWebUrl: 'https://quizkiwi.netlify.app/fakenews',
                webUrl: 'https://quizkiwi.netlify.app/fakenews',
              },
            },
            buttons: [
              {
                title: '게임하기',
                link: {
                  mobileWebUrl: 'https://quizkiwi.netlify.app/fakenews',
                  webUrl: 'https://quizkiwi.netlify.app/fakenews',
                },
              },
            ],
          });
        } else {
          console.error('Kakao SDK not loaded or initialized');
        }
      };
     

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="fakenews-header">
            <Helmet>
          <title>QuizKiwi</title>
          <meta name="description" content="퀴즈키위에서 가짜뉴스 퀴즈 게임을 도전해보세요!" />
          <meta name="robots" content="index, follow" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="keywords" content="이모티콘, 문장 만들기, 퀴즈, 킬링타임, 도전, 게임, 퀴즈키위, 키위, 컨텐츠" />
          <meta property="og:title" content="QuizKiwi: 이모티콘 퀴즈 게임" />
          <meta
            property="og:description"
            content="퀴즈키위에서 이모티콘 퀴즈를 즐겨보세요! 이모티콘 문장 만들기로 창의력을 키워보세요!!."
          />
          <meta property="og:image" content="https://gi.esmplus.com/jjumang/quizfi.png" />
          <meta property="og:url" content="https://quizkiwi.netlify.app/fakenews" />
          {/* 다른 SEO 관련 태그를 여기에 추가할 수 있습니다. */}
        </Helmet>
                <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>🥝 QuizKiwi</h1>
                <div className="fakenews-header-title">가짜뉴스 퀴즈</div>
            </div>
            <div className="fakenews-quiz-game-container">
                {showResults ? (
                    <>
                    <div className="fake-results-container">
                    <div className="fakenewsresult-quiz-box-header">
                      <div className="fakenewsresult-controls-container">
                        <span className="fakenewsresult-control-button"></span>
                        <span className="fakenewsresult-control-button"></span>
                        <span className="fakenewsresult-control-button"></span>
                      </div>
                    </div>
                    <h2>성적표🎉</h2>
                    <p>총 문제 수: {randomQuestions.length}</p>
                    <p>정답 수: {correctAnswers}</p>
                    <p>정답률: {((correctAnswers / randomQuestions.length) * 100).toFixed(2)}%</p>
                    <p>소요 시간: {((Date.now() - startTime) / 1000).toFixed(2)}초</p>
                   </div>
                   <button className="fakenews-restart-button" onClick={handleRestartGame}>
                   재도전하기
                 </button>
                 <button className="fakenews-share-button" onClick={shareOnKakao}>
                   공유하기
                 </button>
                 <button className="fakenews-home-button" onClick={() => navigate('/')}>
                   홈으로
                 </button>        
                 </>           
                ) : (
                    <>
                        <div className="news-image">
                            <img src={currentNews.imageUrl} alt="News Visual" width="500" height="500" />
                        </div>
                        <div className="fakenews-quiz-box">
                        <div className="fakenews-quiz-box-header">
                        <div className="fakenews-controls-container">
                            <span className="fakenews-control-button"></span>
                            <span className="fakenews-control-button"></span>
                            <span className="fakenews-control-button"></span>
                        </div>
                    </div>
                            <div className="news-question">
                                <h2 className="news-title">{currentNews.title}</h2>
                                <p className="news-body">{currentNews.body}</p>
                                {!isAnswerShown ? (
                                    <div className="button-container">
                                        <button className="answer-button true-button" onClick={() => checkAnswer(true)}>진실</button>
                                        <button className="answer-button false-button" onClick={() => checkAnswer(false)}>거짓</button>
                                    </div>
                                ) : (
                                    <div className="answer-feedback">{answerMessage}</div>
                                )}
                                {isAnswerShown && (
                                    <button className="next-question-button" onClick={nextQuestion}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FakenewsQuiz;