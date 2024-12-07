"use client"
import React, { useState, useEffect } from "react";
import { fetchSwears } from "@/utils/generateSwears";

const Form: React.FC = () => {
  const [type, setType] = useState<string>("genZSlang"); // Default to Gen Z Slang
  const [length, setLength] = useState<number>(1); // Default length to 1
  const [result, setResult] = useState<string>(""); // Default result
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedTimer = localStorage.getItem("timer");
      return savedTimer ? parseInt(savedTimer) : 0;
    }
    return 0;
  });
  const disableTimer = process.env.NEXT_PUBLIC_DISABLE_TIMER === 'true';
  const defaultTimer = parseInt(process.env.NEXT_PUBLIC_DEFAULT_TIMER || '60');

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
      if (!disableTimer) setTimer(defaultTimer); // Use default timer from environment
    } catch (error) {
      console.log(error)
      setResult("Failed to generate text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "genZSlang", label: "Gen Z Slang" },
    { value: "aussieBBQ", label: "Aussie BBQ" },
    { value: "aussieSlang", label: "Aussie Slang" },
    { value: "australian", label: "Australian Slang" },
    { value: "breakupTexts", label: "Breakup Texts" },
    { value: "britishTea", label: "British Tea-Drinking" },
    { value: "canadian", label: "Canadian" },
    { value: "passiveAggressiveCanadian", label: "Canadian Passive-Aggressive" },
    { value: "hockeyLovingMoose", label: "Canadian Hockey-Loving Moose" },
    { value: "canadianPoliteness", label: "Canadian politeness" },
    { value: "catMonologue", label: "Cat Monologue" },
    { value: "cheekyBrit", label: "Cheeky Brit" },
    { value: "dogNarration", label: "Dog Narration" },
    { value: "fantasyBard", label: "Fantasy Bard" },
    { value: "foodCritics", label: "Food Critics" },
    { value: "gamerCommentary", label: "Gamer Commentary" },
    { value: "goblinTreasures", label: "Goblin Treasures" },
    { value: "gymTrainer", label: "Gym Trainer" },
    { value: "medievalBlacksmith", label: "Medieval Blacksmith" },
    { value: "millennialStruggles", label: "Millennial Struggles" },
    { value: "motivationalQuotes", label: "Motivational Quotes" },
    { value: "officeGossip", label: "Office Gossip" },
    { value: "outbackAdventurer", label: "Outback Adventurer" },
    { value: "parrotOverhearing", label: "Parrot Overhearing" },
    { value: "pirate", label: "Pirate" },
    { value: "pizzaLover", label: "Pizza Lover" },
    { value: "popCulture90s", label: "90s Sitcom Character" },
    { value: "poshBritish", label: "Posh British" },
    { value: "productReviews", label: "Product Reviews" },
    { value: "quebecois", label: "Quebecois" },
    { value: "romanGraffiti", label: "Roman Graffiti" },
    { value: "romanian", label: "Romanian" },
    { value: "sarcasticLondoner", label: "Sarcastic Londoner" },
    { value: "sarcasticWizard", label: "Sarcastic Wizard" },
    { value: "scottishGranny", label: "Scottish Granny" },
    { value: "scottishPhrases", label: "Scottish Phrases" },
    { value: "scottishRant", label: "Scottish Rant" },
    { value: "southernBBQ", label: "Southern BBQ Pitmaster" },
    { value: "superhero", label: "Superhero" },
    { value: "techSupport", label: "Tech Support Agent" },
    { value: "timeTraveler", label: "Time Traveler" },
    { value: "victorianWriter", label: "Victorian Writer" },
    { value: "viralMeme", label: "Viral Meme" },
    { value: "weirdFood", label: "Weird Food Combinations" },
    { value: "smallTownGossip", label: "Canadian Small-Town Gossip" },

  ];

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
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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
