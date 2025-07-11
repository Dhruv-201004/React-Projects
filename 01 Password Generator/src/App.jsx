import React, { useState, useCallback, useEffect, useRef } from "react";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const passwordRef = useRef(null);

  // Generate a random password
  const generatePassword = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      let pass = "";
      let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      if (numberAllowed) str += "0123456789";
      if (charAllowed) str += "!@#$%^&*()_+-=[]{}|;:,.<>?";

      for (let i = 1; i <= length; i++) {
        const char = Math.floor(Math.random() * str.length);
        pass += str.charAt(char);
      }

      setPassword(pass);
      setIsGenerating(false);
    }, 200);
  }, [length, numberAllowed, charAllowed]);

  // Copy password text to clipboard
  const copyPasswordToClipboard = () => {
    if (!password) return;

    passwordRef.current.select();

    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // Basic strength meter
  const getPasswordStrength = () => {
    let score = 0;
    let label = "Very Weak";
    let color = "text-red-500";

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (numberAllowed) score += 1;
    if (charAllowed) score += 1;
    if (length >= 16 && numberAllowed && charAllowed) score += 1;

    if (score >= 4) {
      label = "Very Strong";
      color = "text-emerald-500";
    } else if (score >= 3) {
      label = "Strong";
      color = "text-green-500";
    } else if (score >= 2) {
      label = "Medium";
      color = "text-yellow-500";
    } else if (score >= 1) {
      label = "Weak";
      color = "text-orange-500";
    }

    return { label, color, score };
  };

  const strength = getPasswordStrength();

  // Regenerate password when dependencies change
  useEffect(() => {
    generatePassword();
  }, [length, numberAllowed, charAllowed, generatePassword]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 bg-gray-300 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-gray-300 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-blue-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Password Generator
            </h1>
            <p className="text-gray-500">
              Create ultra‑secure passwords instantly
            </p>
          </div>

          <div className="space-y-6">
            {/* Display */}
            <div className="relative">
              <input
                ref={passwordRef}
                type="text"
                readOnly
                value={isGenerating ? "Generating..." : password}
                placeholder="Your secure password will appear here"
                onClick={(e) => e.target.select()}
                className={`w-full pr-20 font-mono bg-gray-100 border border-gray-300 rounded-xl py-4 px-4 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 select-all ${
                  isGenerating ? "animate-pulse" : ""
                }`}
              />
              <button
                onClick={copyPasswordToClipboard}
                disabled={!password || isGenerating}
                className={`absolute right-2 top-2 h-10 px-4 rounded-lg flex items-center text-sm font-medium transition-all duration-300 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Length slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center text-gray-800 font-medium">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Length
                </label>
                <span className="text-blue-600 font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
                  {length}
                </span>
              </div>

              <input
                type="range"
                min="6"
                max="50"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${
                    ((length - 6) / (50 - 6)) * 100
                  }%, rgba(0,0,0,0.1) ${
                    ((length - 6) / (50 - 6)) * 100
                  }%, rgba(0,0,0,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>6</span>
                <span>50</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300 cursor-pointer transition-all duration-300 hover:bg-gray-200">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <span className="text-gray-800 font-medium">
                    Include Numbers
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={numberAllowed}
                  onChange={() => setNumberAllowed((prev) => !prev)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    numberAllowed ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                      numberAllowed ? "translate-x-6" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300 cursor-pointer transition-all duration-300 hover:bg-gray-200">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span className="text-gray-800 font-medium">
                    Include Symbols
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={charAllowed}
                  onChange={() => setCharAllowed((prev) => !prev)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    charAllowed ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                      charAllowed ? "translate-x-6" : "translate-x-0.5"
                    } translate-y-0.5`}
                  />
                </div>
              </label>
            </div>

            {/* Generate button */}
            <button
              onClick={generatePassword}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Generate New Password
                </div>
              )}
            </button>

            {/* Strength indicator */}
            {password && (
              <div className="p-4 bg-gray-100 rounded-xl border border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 font-medium">
                    Password Strength
                  </span>
                  <span className={`font-bold ${strength.color}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      strength.score >= 4
                        ? "bg-gradient-to-r from-emerald-500 to-green-400"
                        : strength.score >= 3
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : strength.score >= 2
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                        : strength.score >= 1
                        ? "bg-gradient-to-r from-orange-500 to-orange-400"
                        : "bg-gradient-to-r from-red-500 to-red-400"
                    }`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Keep your passwords safe and never reuse them
          </p>
        </div>
      </div>

      {/* Slider thumb styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: rgb(37 99 235);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transition: transform 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: rgb(37 99 235);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transition: transform 0.3s ease;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }
      `}</style>
    </div>
  );
};

export default PasswordGenerator;
