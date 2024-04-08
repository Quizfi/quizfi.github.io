import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './HomePage.css';

const HomePage = () => {
  let navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false);
  const [isMouseOverTooltip, setIsMouseOverTooltip] = useState(false);

  const startGame = () => {
    navigate('/saja');
  };

  const handleMouseEnterIcon = () => {
    setIsMouseOverIcon(true);
    setShowEmail(true);
  };

  const handleMouseLeaveIcon = () => {
    setIsMouseOverIcon(false);
    // 메일 주소(툴팁)에 마우스가 없을 때만 툴팁을 숨깁니다.
    if (!isMouseOverTooltip) {
      setShowEmail(false);
    }
  };

  const handleMouseEnterTooltip = () => {
    setIsMouseOverTooltip(true);
    setShowEmail(true);
  };

  const handleMouseLeaveTooltip = () => {
    setIsMouseOverTooltip(false);
    // 이메일 아이콘에 마우스가 없을 때만 툴팁을 숨깁니다.
    if (!isMouseOverIcon) {
      setShowEmail(false);
    }
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>QuizKiwi</title>
        <meta name="description" content="퀴즈키위에서 다양하고 재밌는 퀴즈 게임들을 즐겨보세요!" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="퀴즈, 사자성어, 킬링타임, 학습, 게임, 퀴즈키위" />
        <meta property="og:title" content="QuizKiwi: 퀴즈 게임" />
        <meta
          property="og:description"
          content="QuizKiwi에서 퀴즈를 즐겨보세요. 지식을 테스트하고 새로운 것을 배울 기회를 가질 수 있습니다."
        />
        <meta property="og:image" content="https://gi.esmplus.com/jjumang/quizfi.png" />
        <meta property="og:url" content="https://quizkiwi.netlify.app/" />
        {/* 다른 SEO 관련 태그를 여기에 추가할 수 있습니다. */}
      </Helmet>
      <h1>QuizKiwi</h1>
      <div className="box clickable" onClick={startGame}>
        사자성어
      </div>
      <div className="box">준비중</div>
      <div className="box">준비중</div>
      <div className="box">준비중</div>
      <div
        className="contact"
        onMouseEnter={handleMouseEnterIcon}
        onMouseLeave={handleMouseLeaveIcon}
      >
        <i className="fas fa-envelope"></i>
        {showEmail && (
          <span
            className="email-text"
            onMouseEnter={handleMouseEnterTooltip}
            onMouseLeave={handleMouseLeaveTooltip}
          >
            sceneboxzip@gmail.com
          </span>
        )}
      </div>
    </div>
  );
};

export default HomePage;
