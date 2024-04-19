import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FakenewsQuiz.css';
import quizData from '../db/fakenewsData.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const FakenewsQuiz = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [currentNews, setCurrentNews] = useState({});
    const [isAnswerShown, setIsAnswerShown] = useState(false);
    const [answerMessage, setAnswerMessage] = useState('');
    const navigate = useNavigate();

    // 페이지 로드 시 자동으로 게임 시작
    useEffect(() => {
        setCurrentNews(quizData[currentNewsIndex]);
    }, [currentNewsIndex]);

    const checkAnswer = (userAnswer) => {
        if (userAnswer === currentNews.answer) {
            setAnswerMessage(`정답! ${userAnswer ? "진실" : "거짓"}입니다!`);
        } else {
            setAnswerMessage(`오답! ${!userAnswer ? "진실" : "거짓"}입니다!`);
        }
        setIsAnswerShown(true);
    };

    const nextQuestion = () => {
        if (currentNewsIndex < quizData.length - 1) {
            setCurrentNewsIndex(currentNewsIndex + 1);
            setIsAnswerShown(false);
            setAnswerMessage('');
        } else {
            // 모든 문제를 마쳤을 때의 로직
        }
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="fakenews-header">
                <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>🥝 QuizKiwi</h1>
                <div className="fakenews-header-title">가짜뉴스 퀴즈</div>
            </div>
            <div className="fakenews-quiz-game-container">
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
                    </div>
                    {isAnswerShown && (
                        <button className="next-question-button" onClick={nextQuestion}>
                            <FontAwesomeIcon icon={faArrowRight} /> 
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FakenewsQuiz;