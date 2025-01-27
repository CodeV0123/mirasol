import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudioResponse } from "../services/audio";
import { Conversation } from "@11labs/client";
import { FiMic } from "react-icons/fi";

const Answer = () => {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [show, setShow] = useState({ show: false, title: "", loading: false });

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    // Start visualization
    if (canvasRef.current) {
      visualize(analyser);
    }

    return () => {
      if (audioContext) audioContext.close();
    };
  }, []);
  const { answer, error } = useSelector((state) => state.audio);
  const agentId = "fAkhxBgDoCISiufJiDOo";

  const getSignedUrl = async () => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": "sk_34f7128aa1b5e881d360949758c66afa6b6696c704aee35a",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch signed URL");
      }
      const data = await response.json();
      return data.signed_url;
    } catch (err) {
      console.error("Failed to fetch signed URL:", err);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      console.error("Microphone permission denied");
      return false;
    }
  };

  const startConversation = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const signedUrl = await getSignedUrl();

    visualize(analyserRef.current);

    const websocket = new WebSocket(signedUrl);

    websocket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected.");
    };

    websocket.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const arrayBuffer = await event.data.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;

        // Connect to analyser for visualization
        source.connect(analyserRef.current);
        source.connect(audioContextRef.current.destination);

        source.start(0);
      } else {
        console.log("Text response:", event.data);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert("An error occurred during the conversation.");
    };

    websocket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket closed.");
    };

    const conversation = await Conversation.startSession({
      signedUrl,
      onConnect: () => {
        setIsConnected(true);
        setIsSpeaking(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.error("Conversation error:", error);
        alert("An error occured during the conversation");
      },
      onModeChange: ({ mode }) => {
        setIsListening(mode === "listening");
        setIsSpeaking(mode === "speaking");
      },
    });
    setConversation(conversation);
  };

  const visualize = (analyser) => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radiusBase = Math.min(width, height) / 4;

      analyser.getByteFrequencyData(dataArray);

      const maxIntensity = Math.max(...dataArray) / 255.0; // Normalized intensity
      const dynamicRadius = radiusBase + maxIntensity * 20; // Dynamic pulsing

      canvasCtx.clearRect(0, 0, width, height);

      // Create dynamic gradient based on intensity
      const gradient = canvasCtx.createRadialGradient(
        centerX,
        centerY,
        dynamicRadius * 0.5,
        centerX,
        centerY,
        dynamicRadius * 1.5
      );
      gradient.addColorStop(
        0,
        `rgba(${Math.floor(maxIntensity * 255)}, 100, 180, 1)`
      );
      gradient.addColorStop(1, "#002f1a");

      canvasCtx.fillStyle = gradient;
      canvasCtx.beginPath();

      const angleStep = (Math.PI * 2) / bufferLength;
      let angle = 0;

      // Draw blob with dynamic scaling
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] / 200.0;
        const radius = dynamicRadius + value * 10; // React dynamically to frequency
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        angle += angleStep;
      }

      canvasCtx.closePath();
      canvasCtx.fill();

      // Add ripple effect with outer glow
      canvasCtx.strokeStyle = `rgba(${Math.floor(
        maxIntensity * 255
      )}, 180, 240, 0.5)`;
      canvasCtx.lineWidth = 2 + maxIntensity * 5; // Line width based on intensity
      canvasCtx.stroke();

      // Smooth animation
      requestAnimationFrame(draw);
    };
    draw();
  };

  const handleGenerate = async (question) => {
    setShow({ show: true, loading: true, title: "" });
    try {
      // Dispatch the Redux action to fetch the audio response
      dispatch(fetchAudioResponse({ question }));
      setInput("");
    } catch (err) {
      console.error("Error generating question:", err);
      setShow({ show: false, loading: false, title: "" });
    }
  };

  useEffect(() => {
    if (answer) {
      setShow({ show: true, loading: false, title: answer });
    }
  }, [answer, dispatch]);

  return (
    <div className="w-[100%] h-[80px] absolute z-20 bottom-0 left-0 flex items-center justify-center">
      {show.show && (
        <div className="w-[70%] h-[500px] absolute bg-[#00000090] rounded-md overflow-hidden bottom-[15vh] backdrop-blur-sm">
          <img
            onClick={() => setShow({ ...show, show: false })}
            src="/closed.svg"
            className="absolute cursor-pointer z-30 top-[5px] right-[10px] w-[30px] h-[30px]"
            alt=""
          />
          {show.loading ? (
            <div className="w-[100%] flex items-center justify-center h-[100%]">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-12 h-12 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#ffffff10"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#34b87d"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="px-[28px] py-[20px] text-white text-[20px]">
              {show.title}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center w-[500px] h-[50px] rounded-md border-[2px] border-[#34b87d] bg-[#00000060] backdrop-blur-sm">
        <input
          placeholder="Ask Questions?"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate(input)}
          className="w-[100%] h-[100%] bg-transparent outline-none border-none font-medium px-[14px] text-white"
        />
        <FiMic
          className={`cursor-pointer text-white text-[24px] mx-[10px] ${
            isListening ? "animate-pulse text-[#34b87d]" : ""
          }`}
          onClick={startConversation}
        />
        <canvas
          ref={canvasRef}
          width="85"
          height="85"
          className="absolute right-[-110px] bg-transparent"
        ></canvas>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default Answer;
