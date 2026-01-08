'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExplanationPopup from './ExplanationPopup';

export default function FraudProbabilityScore({ analysis }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const score = Number(analysis?.fraud_probability ?? 0);
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const end = Math.min(Math.max(score, 0), 100);
    const speed = end / 60;

    const interval = setInterval(() => {
      start += speed;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setAnimatedScore(Math.round(start));
    }, 16);

    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    const safeScore = Math.min(Math.max(score, 0), 100);
    const newOffset = circumference - (safeScore / 100) * circumference;
    setOffset(newOffset);
  }, [score]);

  const getColor = () => {
    if (score > 80) return '#ef4444';
    if (score > 50) return '#facc15';
    return '#22c55e';
  };

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://127.0.0.1:5000/explain-fraud',
        analysis
      );
      setExplanation(res.data.explanation || 'No explanation available.');
    } catch (err) {
      console.error('Fraud explanation error:', err);
      setExplanation('Failed to load explanation from server.');
    }
    setLoading(false);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    if (!explanation) fetchExplanation();
  };

  return (
    <>
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">Fraud Probability</h3>

        <div className="flex items-center justify-center gap-10">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#2d2d2d"
                strokeWidth={strokeWidth}
                fill="none"
              />

              <defs>
                <linearGradient id="fraudGradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getColor()} />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>

              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#fraudGradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
              />
            </svg>

            <div className="absolute text-4xl font-bold text-indigo-300">
              {animatedScore}%
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm text-gray-300 mt-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
              <span>Low Risk (0–50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
              <span>Medium Risk (50–80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500"></span>
              <span>High Risk (80–100%)</span>
            </div>
          </div>
        </div>

        <button
          className="mt-4 px-4 py-2 w-fit bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          onClick={openPopup}
        >
          AI Explain
        </button>
      </div>

      <ExplanationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="AI Fraud Probability Explanation"
        content={loading ? 'Analyzing document...' : explanation}
      />
    </>
  );
}
