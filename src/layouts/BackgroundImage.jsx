import React from "react";

const BackgroundImage = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <img
        src="/bib.png"
        alt="Background"
        className="w-full h-full object-cover"
      />
      {/* Optional overlay to control brightness/contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
    </div>
  );
};

export default BackgroundImage;
