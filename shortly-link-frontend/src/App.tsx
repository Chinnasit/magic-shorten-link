import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

interface BodyRequest {
  url: string;
  custom?: string;
}

const App: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCloseResult = () => {
    setShortUrl("");
    setValidationError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShortUrl("");
    setValidationError(null);

    const bodyRequest: BodyRequest = {
      url: originalUrl,
      custom: customUrl,
    };

    const urlRegex = /^(http|https):\/\/\S+$/;
    if (!urlRegex.test(originalUrl)) {
      setValidationError(
        "Please enter a valid URL (starting with http:// or https://)"
      );
      return; // Prevent further processing if URL is invalid
    }

    if (bodyRequest.url === "") {
      setValidationError(
        "Please enter a valid URL (starting with http:// or https://)"
      );
      return; // Prevent further processing if URL is invalid
    }

    try {
      const response = await axios.post(`/shorted`, bodyRequest);
      const { short_url } = response.data;
      setShortUrl(short_url);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setValidationError("This URL already exist");
        } else {
          console.log(error);
        }
      } else {
        console.log(error);
      }
    }
  };

  const handleCopyUrl = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(`http://127.0.0.1:8000/${shortUrl}`);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-4 mx-4 md:mx-14">
        {/* Header */}
        <div className="col-span-12 mb-5 mt-36">
          <h1 className="text-3xl text-black font-bold text-center md:text-5xl">
            Create a short link
          </h1>
        </div>

        {/* Form */}
        <form
          className="grid col-span-12 col-start-2 col-end-12  md:grid-cols-subgrid md:col-span-12"
          onSubmit={handleSubmit}
        >
          <div className="col-span-7 md:col-start-2 md:col-span-5">
            <label className="block text-base font-light text-gray-900">
              Type or paste a link (URL)
            </label>
            <input
              type="text"
              name="originalUrl"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value);
                setValidationError(null);
              }}
              className={`block font-light rounded-lg py-3 pl-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 drop-shadow-custom ${
                validationError ? "ring-red-500" : ""
              }`}
            />
          </div>

          <div className="col-span-7 md:col-span-3">
            <label className="block text-base w-full font-light text-gray-900">
              Custom short URL
            </label>
            <input
              type="text"
              name="customUrl"
              id="customUrl"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="(Optional)"
              className="block font-light rounded-lg py-3 pl-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 drop-shadow-custom"
            />
          </div>

          {/* Shorten button  */}
          <div className="content-end col-span-2 col-start-6 md:row-start-1 md:col-start-10">
            <button
              type="submit"
              className="font-bold text-xl text-white my-3 rounded-lg py-1.5 w-full bg-black md:text-2xl md:my-0.5"
            >
              Shorten
            </button>
          </div>

          {validationError && (
            <div className="col-span-7 md:col-start-2 md:col-span-8 md:row-start-2">
              <p
                id="url-validation-error"
                className="text-red-500 text-xs mt-1"
              >
                {validationError}
              </p>
            </div>
          )}
        </form>
      </div>

      {shortUrl && (
        <div className="grid grid-cols-12 gap-x-4 mx-4 md:mx-14">
          {/* Result col-span-9 col-start-2*/}
          <div className="col-start-2 col-span-9 rounded-lg my-5 py-3 pl-2 ring-1 ring-inset ring-gray-300">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-col w-10/12">
                <div className="w-96">
                  <a
                    href={`http://127.0.0.1:8000/${shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="text-black group-hover:text-white text-md font-semibold">
                      https://domain/{shortUrl}
                    </h3>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 group-hover:text-white text-sm truncate">
                    https://www.figma.com/file/gFCOgPzF2KltrsXWRkMcPh/CoE2023-13-Glaucoma-Screening-Web-App?type=design&node-id=0-1&mode=design&t=7VC0vRzofYIs9xSC-0
                  </p>
                </div>
              </div>
              <div className="text-black content-center items-center mr-5">
                {/* Copy button */}
                <button onClick={handleCopyUrl}>
                  {isCopied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.354 8.493-12.739a.75.75 0 011.04-.208z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="col-start-11 text-black content-center">
            <button className="text-black" onClick={handleCloseResult}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
