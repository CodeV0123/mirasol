import { Power4 } from "gsap";
import { gsap } from "gsap";
import React, { useRef } from "react";
import { Tween } from "react-gsap";
import { useSelector } from "react-redux";

const Loader = ({ children }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();

  const transition = {
    duration: 0.8,
    from: 0,
    to: 1,
  };

  React.useEffect(() => {
    gsap.to(ref1.current, {
      keyframes: [{ opacity: transition.from }, { opacity: transition.to }],
      duration: transition.duration,
      repeat: -1,
      delay: 0.1,
      ease: Power4.easeOut,
    });
    gsap.to(ref2.current, {
      keyframes: [{ opacity: transition.from }, { opacity: transition.to }],
      duration: transition.duration,
      repeat: -1,
      delay: 0.2,
      ease: Power4.easeOut,
    });
    gsap.to(ref3.current, {
      keyframes: [{ opacity: transition.from }, { opacity: transition.to }],
      duration: transition.duration,
      repeat: -1,
      delay: 0.3,
      ease: Power4.easeOut,
    });
    gsap.to(ref4.current, {
      keyframes: [{ opacity: transition.from }, { opacity: transition.to }],
      duration: transition.duration,
      repeat: -1,
      delay: 0.4,
      ease: Power4.easeOut,
    });
    gsap.to(ref5.current, {
      keyframes: [{ opacity: transition.from }, { opacity: transition.to }],
      duration: transition.duration,
      repeat: -1,
      delay: 0.5,
      ease: Power4.easeOut,
    });
  }, []);

  const state = useSelector((state) => state.three);
  return (
    <>
      <Tween
        from={{
          clipPath: "inset(0px 0vw 0vh 1px)",
        }}
        to={{
          clipPath: state.loading
            ? "inset(0px 0px 0% 1px)"
            : "inset(0px 0vw 100vh 1px)",
          // clipPath: !showed ? "inset(0px 100% 0px 1px)" : "inset(0px 0px 0% 1px)",
        }}
        duration={1.7}
        ease={Power4.easeInOut}
      >
        <div
          className="fixed w-full h-[100vh] bg-white top-0 left-0 flex justify-center items-center"
          style={{
            zIndex: 100000000000000,
          }}
        >
          <img className="w-[300px]  " ref={ref1} src="/bib.png" />
          {/* <img className="w-[30px] " ref={ref2} src="/i.svg" />
          <img className="w-[30px] " ref={ref3} src="/b2.svg" />
          <img className="w-[30px] " ref={ref4} src="/l.svg" />
          <img className="w-[30px]" ref={ref5} src="/o.svg" /> */}
        </div>
      </Tween>
      {children}
    </>
  );
};

export default Loader;
