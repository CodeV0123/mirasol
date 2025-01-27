import React from "react";

const BackgroundVideo = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <video
        className="min-w-full min-h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/public/bgvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Optional overlay to control brightness/contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
    </div>
  );
};

export default BackgroundVideo;
