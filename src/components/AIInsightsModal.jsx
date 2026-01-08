'use client';

import React from 'react';

export default function AIInsightsModal({ visible, summary, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 text-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
        >
          Close
        </button>

        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          AI Dashboard Explanation
        </h2>

        <div className="max-h-[60vh] overflow-y-auto pr-4 text-gray-300 leading-relaxed">
          {summary ? (
            <p className="whitespace-pre-line">{summary}</p>
          ) : (
            <p>No AI explanation available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
