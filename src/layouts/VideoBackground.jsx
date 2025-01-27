import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoBackground.css";

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleVideoEnd = () => {
      videoRef.current.pause();
      setShowButton(true);
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener("ended", handleVideoEnd);

    return () => {
      videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  const handleEnterClick = () => {
    navigate("/home"); // Navigate to HomePage
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="background-video"
        src="/MIRASOL.mp4"
        autoPlay
        muted
        playsInline
        loop={false}
      />
      {showButton && (
        <button className="enter-button" onClick={handleEnterClick}>
          Explore Luxury
        </button>
      )}
    </div>
  );
};

export default VideoBackground;
