'use client';

import React, { useState } from 'react';
import axios from 'axios';
import ExplanationPopup from './ExplanationPopup';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

export default function FinancialTrends({ data }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const numericTrends = Array.isArray(data?.numericTrends)
    ? data.numericTrends
    : [];

  const chartData = numericTrends.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  const API_URL = 'http://127.0.0.1:5000';

  const openPopup = () => {
    setPopupOpen(true);
    if (!aiText) fetchAIExplanation();
  };

  const fetchAIExplanation = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/explain-visual`, {
        numericTrends,
      });

      setAiText(res.data.explanation);
    } catch {
      setAiText('AI analysis failed.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex flex-col gap-8">
      <h3 className="text-lg text-white mb-3 font-semibold">
        Financial Trends
      </h3>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: '#222', borderColor: '#555' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00c8a3"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400">No trend data available.</p>
      )}

      <button
        onClick={openPopup}
        className="mt-4 bg-indigo-600 px-4 py-2 rounded w-fit cursor-pointer hover:bg-indigo-700 transition"
      >
        AI Explain
      </button>

      <ExplanationPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Trend Analysis"
        content={loading ? 'Analysing...' : aiText}
      />
    </div>
  );
}
