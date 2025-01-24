import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { createClient } from "@supabase/supabase-js";
import { FiMic } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudioResponse } from "../services/audio";
import axios from "axios";
import "./Answer.css";

const supabase = createClient(
  "https://ovwhrngiaqsxmcbbkpbf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92d2hybmdpYXFzeG1jYmJrcGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4OTExNTAsImV4cCI6MTk5OTQ2NzE1MH0.0vP4utmLqCP5H8H1AfbE74-4gupbWnGswopRIbSk4Pc"
);

const Flipbook = ({ file }) => {
  console.log(`https://flipbook-rho.vercel.app?query=%22${file}%22`);
  return (
    <div className="w-[100%] h-[100vh]">
      <iframe
        src={`https://flipbook-rho.vercel.app?query=%22${file}%22`}
        className="w-[100%] h-[100vh]"
      ></iframe>
    </div>
  );
};

const Dropped = ({ setFile }) => {
  const handleDrop = (e) => {
    console.log(e);
    setFile(e[0]);
  };
  return (
    <>
      <div
        className="w-[100%] h-[100vh]  bg-[#fff90] backdrop-blur-[5px] flex items-center justify-center"
        style={{
          zIndex: 999999999999,
        }}
      >
        <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [] }}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
          }) => (
            <div
              {...getRootProps()}
              className="cursor-pointer border-white border-dashed border-[2px] w-[50%] h-[70vh] md:h-[300px] rounded-[5px] flex items-center justify-center duration-100 bg-[#ffffff10] backdrop-blur-[10px] good-fonted"
            >
              {/* move input element outside of the text container */}
              <input {...getInputProps()} />
              <p className="good-fonted text-[#fff] good-fonted font-bold text-[15px] md:text-[24px]">
                Please Upload the pdf file here
              </p>
            </div>
          )}
        </Dropzone>
      </div>
    </>
  );
};

const Loader = () => {
  return (
    <div className="w-[100%] h-[100vh] fixed z-50 bg-[#00000090] backdrop-blur-sm  flex items-center justify-center top-0 left-0">
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-12 h-12 mr-2 text-gray-200 ease-in-out animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#ffffff10"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill={"#34b87d"}
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

const Answer = ({ id }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState({
    show: false,
    title: "",
    loading: false,
  });
  // const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState("");

  const { base64, error } = useSelector((state) => state.audio);

  // const playAudioFromBase64 = (base64String) => {
  //   const audioBlob = new Blob(
  //     [Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))],
  //     { type: "audio/mp3" }
  //   );
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  // };

  const playAudioFromBase64 = (base64String) => {
    console.log("we reaching here");
    try {
      // Strip the data URI prefix if present
      const strippedBase64 = base64String.startsWith("data:")
        ? base64String.split(",")[1]
        : base64String;

      // Decode the base64 string
      const byteCharacters = atob(strippedBase64);

      // Convert to byte numbers
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Create a Uint8Array from byte numbers
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob object from the byte array with MIME type `audio/mpeg`
      const blob = new Blob([byteArray], { type: "audio/mpeg" });

      // Generate an object URL for the Blob
      const audioUrl = URL.createObjectURL(blob);

      // Create an Audio object using the Blob URL and play the audio
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });

      console.log("Audio is playing...");
    } catch (error) {
      console.error("Error playing audio from base64:", error);
    }
  };
  const handleFetchAudio = async () => {
    try {
      // Fetch the answer from the first API
      const res = await axios.post(
        "https://filegptmolotov.ngrok.app/ask-question",
        {
          question: input,
        }
      );

      const answer = res.data.answer;

      const audio_response = await axios.post(
        "https://backend.scans.codes/scrap/binaryTobase64",
        {
          id: "CwhRBWXzGAHq8TQ4Fs17",
          text: answer,
        }
      );

      const byteCharacters = atob(audio_response.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/octet-stream",
      });

      const file = new File([blob], "aud.mp3", {
        type: "application/octet-stream",
      });

      // console.log(file);

      // Create a download link
      const link = window.URL.createObjectURL(blob);

      const audio = new Audio(link);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });

      setShow({
        show: true,
        loading: false,
        title: answer,
      });

      // Trigger the fetchAudioResponse with the answer
      // dispatch(
      //   fetchAudioResponse({
      //     id: "CwhRBWXzGAHq8TQ4Fs17", // Replace with dynamic `id` if needed
      //     text: answer,
      //   })
      // );
    } catch (error) {
      console.error("Error fetching answer or audio:", error);
      setShow({
        show: false,
        loading: false,
        title: "",
      });
    }
  };

  useEffect(() => {
    if (base64) {
      console.log("Base64 updated:", base64);
      playAudioFromBase64(base64);
    }
  }, [base64]);

  const generate = async (transcript) => {
    console.log(transcript,"generate function",show)
    if (!show.loading) {
      setShow({ show: true, loading: true });
      const formData = new FormData();
      formData.append("question", input);
      // formData.append("user_id", "Molotov");
      // formData.append("file_id", id);

      // define the request options
      const requestOptions = {
        method: "POST",
        body: { question: input },
        redirect: "follow",
      };

      console.log({
        question: input,
      });
      // send the request to the API and set the response for the current message
      try {
        const res = await axios.post(
          "https://filegptmolotov.ngrok.app/ask-question",
          {
            question: transcript,
          }
        );

        // const response = await fetch(
        //   "https://filegptmolotov.ngrok.app/ask-question",
        //   requestOptions
        // );
        // const result = await
        // response.json();

        const audio_response = await axios.post(
          "https://backend.scans.codes/scrap/binaryTobase64",
          {
            id: "CwhRBWXzGAHq8TQ4Fs17",
            text: res.data.answer,
          }
        );

        const byteCharacters = atob(audio_response.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });

        const file = new File([blob], "aud.mp3", {
          type: "application/octet-stream",
        });

        // console.log(file);

        // Create a download link
        const link = window.URL.createObjectURL(blob);

        const audio = new Audio(link);
        audio.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });

        setShow({
          show: true,
          loading: false,
          title: res.data.answer,
        });
        // Create an array of all the answers

        // Push a new message object to history containing the question and all corresponding answers
      } catch (error) {
        setShow({
          show: false,
          loading: false,
          title: "",
        });
      }
    }
  };

  // Speech Recognition to capture input
  const startListening = () => {
    setIsListening(true);

    // Check for browser support and fallback to vendor-prefixed version
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US, es-ES";

    recognition.onresult = (event) => {
      console.log("can you hear me?")
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      generate(transcript);
      setIsListening(false);
      // handleFetchAudio();
    };

    recognition.onerror = (error) => {
      console.error("Speech recognition error:", error);
      setIsListening(false);
    };

    recognition.start();
  };

  // const [input, setInput] = useState("");

  return (
    <div className="w-[100%] h-[80px] absolute z-20 bottom-0 left-0 flex items-center justify-center">
      {show.show && (
        <div className="w-[70%]  h-[500px] absolute bg-[#00000090] rounded-md overflow-hidden bottom-[15vh] backdrop-blur-sm ">
          <img
            onClick={() => {
              setShow({
                ...show,
                show: false,
              });
            }}
            src="/closed.svg"
            className="absolute cursor-pointer z-30 top-[5px] right-[10px] w-[30px] h-[30px] "
            alt=""
          />
          {show.loading ? (
            <div className="w-[100%] flex items-center justify-center h-[100%] backdrop-blur-sm">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-12 h-12 mr-2 text-gray-200 ease-in-out animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#ffffff10"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill={"#34b87d"}
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="w-[100%] h-[100%] px-[28px] py-[20px] text-white font-medium text-[20px]">
              {show.title}
            </div>
          )}
        </div>
      )}
      <div className=" flex items-center w-[500px] h-[50px] rounded-md border-[2px] border-[#34b87d] bg-[#00000060] backdrop-blur-sm">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              generate(input);
            }
          }}
          placeholder="Ask Questions"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="w-[100%] h-[100%] bg-transparent outline-none border-none font-medium px-[14px] placeholder-black::placeholder text-white"
        />
        <FiMic
          className={`cursor-pointer text-white text-[24px] mx-[10px] ${
            isListening ? "animate-pulse text-[#34b87d]" : ""
          }`}
          onClick={startListening}
        />
      </div>
      {/* <button
        className="rounded bg-black text-white"
        onClick={handleFetchAudio}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch and Play Audio"}
      </button> */}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

const HomePage = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState();
  const [fileId, setFileId] = useState("");
  const [loader, setLoader] = useState(false);

  const analyze_documents = async (user_id, files) => {
    // create a new FormData instance
  };

  return (
    <div className="w-[100%] h-[100vh] bg-black">
      {loader && <Loader />}
      {step === 0 && (
        <Dropped
          setFile={async (e) => {
            setLoader(true);
            const { data, error } = await supabase.storage
              // .from("flipbooktest")
              .from("assets")
              .upload(`learn-test${Date.now()}.pdf`, e, {
                upsert: true,
              });
            console.log(data, error);
            if (error === null) {
              setFile(
                `https://ovwhrngiaqsxmcbbkpbf.supabase.co/storage/v1/object/public/assets/${data.path}?not-from-cache-please`
              );
              // setStep(1);
              // setTimeout(() => {
              //   setLoader(false);
              // }, 5000);
            }

            const formData = new FormData();

            // append the file to the FormData instance

            formData.append("file", e, e.name);
            formData.append("user_id", "Molotov");
            // formData.append("file", file, file.name);

            // define the request options
            const requestOptions = {
              method: "POST",
              body: formData,
              redirect: "follow",
            };

            // try {
            //   const response = await fetch(
            //     "https://pdfgptmolotov.ngrok.app/analyze_multiple_documents",
            //     requestOptions
            //   );
            //   const result = await response.json();
            //   //   setFileid(result.file_id);
            //   console.log(result.file_id);
            //   setFileId(result.file_id);
            //   setStep(1);
            //   setLoader(false);
            //   // setTimeout(() => {
            //   //
            //   // }, 5000);
            // } catch (error) {
            //   console.log("error", error);
            // }

            setFileId("sdfs");
            setStep(1);
            setLoader(false);

            // if (error === null) {
            //   setTimeout(() => {
            //     const { data: data1 } = supabase.storage
            //       .from("assets")
            //       .getPublicUrl("learn-test.pdf");
            //     setFile(data1.publicUrl);
            //     setStep(1);
            //     setTimeout(() => {
            //       setLoader(false);
            //     }, 5000);
            //   },5000);
            // }
          }}
        />
      )}
      {step === 1 && (
        <div className="w-[100%] h-[100vh] relative flex items-center justify-center">
          <Flipbook file={file} />
        </div>
      )}
      {fileId !== "" && <Answer id={fileId} />}
    </div>
  );
};

export default HomePage;
