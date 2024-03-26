import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';


const HomePage = () => {
  let navigate = useNavigate();
  const [showEmail, setShowEmail] = useState(false);
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false);
  const [isMouseOverTooltip, setIsMouseOverTooltip] = useState(false);


  const startGame = () => {
    navigate('/game');
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
      <h1>Quizfy</h1>
      <div className="box clickable" onClick={startGame}>사자성어</div>
      <div className="box">준비중</div>
      <div className="box">준비중</div>
      <div className="box">준비중</div>
      <div className="contact"
           onMouseEnter={handleMouseEnterIcon}
           onMouseLeave={handleMouseLeaveIcon}>
        <i className="fas fa-envelope"></i>
        {showEmail && (
          <span className="email-text"
                onMouseEnter={handleMouseEnterTooltip}
                onMouseLeave={handleMouseLeaveTooltip}>
            quizfy777@gmail.com
          </span>
        )}
      </div>
    </div>
  );
};


export default HomePage;
