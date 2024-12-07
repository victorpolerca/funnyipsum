"use client"
import React, { useState, useEffect } from "react";
import { fetchSwears } from "@/utils/generateSwears";

const Form: React.FC = () => {
  const [type, setType] = useState<string>("quebecois"); // Default to Quebecois
  const [length, setLength] = useState<number>(5); // Default length
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedTimer = localStorage.getItem("timer");
      return savedTimer ? parseInt(savedTimer) : 0;
    }
    return 0;
  });
  const disableTimer = false

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          if (typeof window !== "undefined") {
            localStorage.setItem("timer", newTimer.toString());
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("timer");
      }
    }
  }, [timer]);

  const handleGenerate = async () => {
    if (!disableTimer && timer > 0) return;

    setLoading(true);
    try {
      const generated = await fetchSwears(type, length);
      setResult(generated);
      if (!disableTimer) setTimer(300); // 5 minutes timer
    } catch (error) {
      console.log(error)
      setResult("Failed to generate text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-gray-900">
      {/* Dropdown for Slang Type */}
      <label className="block">
        <span className="text-gray-700">Choose Slang Type:</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded mt-1 text-gray-900 bg-gray-200"
        >
          <option value="quebecois">Quebecois</option>
          <option value="canadian">Canadian</option>
          <option value="romanian">Romanian</option>
        </select>
      </label>

      {/* Dropdown for Text Length */}
      <label className="block">
        <span className="text-gray-700">Select Length:</span>
        <select
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full p-2 border rounded mt-1 text-gray-900 bg-gray-200"
        >
          <option value={1}>1 Paragraph</option>
          <option value={2}>2 Paragraphs</option>
          <option value={3}>3 Paragraphs</option>
        </select>
      </label>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || (!disableTimer && timer > 0)}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Display Timer */}
      {!disableTimer && timer > 0 && (
        <div className="mt-2 text-red-500">
          Please wait {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} minutes before generating again.
        </div>
      )}

      {/* Display Result */}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-200 text-gray-900">
          <h2 className="font-bold text-lg mb-2">Generated Text:</h2>
          {result.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-2">{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Form;
