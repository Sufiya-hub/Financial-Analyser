'use client';

import React, { useState } from 'react';
import axios from 'axios';
import ExplanationPopup from './ExplanationPopup';

export default function BalanceSheetOverview({ data }) {
  const totalAssets = Number(data?.totalAssets || 0);
  const totalLiabilities = Number(data?.totalLiabilities || 0);
  const totalEquity = Number(data?.totalEquity || 0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

  const fetchAIExplanation = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/explain-balance-sheet`, {
        totalAssets,
        totalLiabilities,
        totalEquity,
      });

      setAiExplanation(res.data.explanation || 'No explanation available');
    } catch (err) {
      console.error('EXPLANATION ERROR:', err);
      setAiExplanation('Failed to fetch AI explanation.');
    }

    setLoading(false);
  };

  const openPopup = () => {
    fetchAIExplanation();
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-100">
          Balance Sheet Overview
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-indigo-400 text-lg font-bold">
              {totalAssets.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Total Assets</p>
          </div>

          <div>
            <p className="text-red-400 text-lg font-bold">
              {totalLiabilities.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Total Liabilities</p>
          </div>

          <div>
            <p className="text-green-400 text-lg font-bold">
              {totalEquity.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Total Equity</p>
          </div>
        </div>

        <button
          onClick={openPopup}
          className="mt-4 px-4 py-2 cursor-pointer bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
        >
          AI Explain
        </button>
      </div>

      <ExplanationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="AI Balance Sheet Explanation"
        content={loading ? 'Analyzing...' : aiExplanation}
      />
    </>
  );
}
