import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FakenewsQuiz.css';
import quizData from '../db/fakenewsData.json';

const FakenewsQuiz = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentNews, setCurrentNews] = useState({});
    const navigate = useNavigate();

    const startGame = () => {
        setGameStarted(true);
        setCurrentNews(quizData[0]);
    };

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div>
            {/* 헤더 및 소개 텍스트 */}
            <div className="fakenews-header">
                <h1 onClick={goToHome} style={{ cursor: 'pointer' }}>🥝 QuizKiwi</h1>
                <div className="fakenews-header-title">가짜뉴스 퀴즈</div>
            </div>
            <div className="fakenews-quiz-game-container">
                {gameStarted ? (
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
          <div className="button-container">
          <button className="answer-button true-button">진실</button>
          <button className="answer-button false-button">거짓</button>
                            </div>
                            </div>
                            </div>
                    </>
                ) : (
                    <button onClick={startGame} className="start-button">Start Game</button>
                )}
            </div>
        </div>
    );
};

export default FakenewsQuiz;