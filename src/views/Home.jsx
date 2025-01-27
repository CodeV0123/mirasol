import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { createClient } from "@supabase/supabase-js";
import BackgroundImage from "../layouts/BackgroundImage";
import Answer from "./Answer";

const supabase = createClient(
  "https://ovwhrngiaqsxmcbbkpbf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92d2hybmdpYXFzeG1jYmJrcGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4OTExNTAsImV4cCI6MTk5OTQ2NzE1MH0.0vP4utmLqCP5H8H1AfbE74-4gupbWnGswopRIbSk4Pc"
);

const Flipbook = ({ file }) => {
  console.log(`https://flipbook-rho.vercel.app?query=%22${file}%22`);
  return (
    <div className="w-[100%] h-[100vh]">
      <iframe
        src={`https://flipbook-rho.vercel.app?query=%22${"https://ovwhrngiaqsxmcbbkpbf.supabase.co/storage/v1/object/public/assets/uploads/Mirasol%20Digital%20Brochure_compressed.pdf"}%22`}
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

const HomePage = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState();
  const [fileId, setFileId] = useState("asda");
  const [loader, setLoader] = useState(false);

  // const analyze_documents = async (user_id, files) => {
  //   // create a new FormData instance
  // };

  return (
    <div className="w-[100%] h-[100vh]">
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
            // const requestOptions = {
            //   method: "POST",
            //   body: formData,
            //   redirect: "follow",
            // };

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
          <BackgroundImage />
          <Flipbook file={file} />
        </div>
      )}
      {fileId !== "" && <Answer id={fileId} />}
    </div>
  );
};

export default HomePage;
