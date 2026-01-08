'use client';

import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import ExplanationPopup from './ExplanationPopup';

const ANOMALY_THRESHOLD = 0.7;

export default function AnomalyDetectionInsights({ analysis }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [driverLimit, setDriverLimit] = useState(6);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  console.log('Received anomalyScores:', analysis?.anomalyScoresOverTime);

  const anomalyScores = Array.isArray(analysis?.anomalyScoresOverTime)
    ? analysis.anomalyScoresOverTime
    : [];

  const keyDrivers = Array.isArray(analysis?.keyAnomalyDrivers)
    ? analysis.keyAnomalyDrivers
    : [];

  const fraudProbability = Number(analysis?.fraud_probability || 0);

  const processedScores = anomalyScores.map((item, idx) => ({
    id: idx + 1,
    name: item?.name ?? `Point ${idx + 1}`,
    score: Number(item?.score ?? 0),
    threshold: ANOMALY_THRESHOLD,
  }));

  if (processedScores.length === 0) {
    return (
      <div className="bg-gray-800 p-5 rounded-lg text-white shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Anomaly Detection</h3>
        <p className="text-gray-400">No anomaly data available from backend.</p>
      </div>
    );
  }

  const visibleScores = processedScores.slice(0, visibleCount);
  const visibleDrivers = keyDrivers.slice(0, driverLimit);

  const anomalyCount = processedScores.filter(
    (a) => a.score >= ANOMALY_THRESHOLD
  ).length;

  const generateAIExplanation = () => {
    let text = `📊 **Anomaly Detection Summary**\n\n`;
    text += `• Fraud Probability: ${fraudProbability.toFixed(2)}%\n`;
    text += `• Total Points: ${processedScores.length}\n`;
    text += `• Above Threshold: ${anomalyCount}\n\n`;

    text += `### Key Drivers:\n`;
    visibleDrivers.forEach((d, idx) => (text += `${idx + 1}. ${d}\n`));

    setPopupContent(text);
    setPopupOpen(true);
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Anomaly Detection Insights</h3>

      <p className="text-sm text-gray-300 mb-2">
        Showing {visibleScores.length} of {processedScores.length} points
      </p>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis
              dataKey="score"
              domain={[0, 1]}
              stroke="#aaa"
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />

            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                const item = payload[0].payload;
                const itemName = item.name || 'Unknown';
                const rawValue = Number(item.rawValue) || 0;
                const score = Number(item.score) || 0;

                return (
                  <div className="p-3 bg-[#111] border border-[#555] rounded-lg shadow-lg text-white text-sm">
                    <div className="font-bold text-[#00C49F] mb-1">
                      {itemName}
                    </div>

                    <div>
                      <strong>Raw Value:</strong> {rawValue.toLocaleString()}
                    </div>
                    <div>
                      <strong>Anomaly Score:</strong> {(score * 100).toFixed(2)}
                      %
                    </div>
                  </div>
                );
              }}
            />

            <Scatter
              name="Anomaly Scores"
              data={visibleScores}
              fill="#8b5cf6"
            />

            <ReferenceLine
              y={ANOMALY_THRESHOLD}
              stroke="red"
              strokeDasharray="4 2"
              label={{
                value: `Threshold (${ANOMALY_THRESHOLD * 100}%)`,
                fill: 'red',
                position: 'right',
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {visibleCount < processedScores.length && (
        <button
          onClick={() => setVisibleCount(visibleCount + 10)}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg cursor-pointer"
        >
          Load More
        </button>
      )}

      <h4 className="text-md font-medium mt-5 mb-2">Key Drivers</h4>

      {visibleDrivers.length > 0 ? (
        <ul className="list-disc list-inside text-gray-300 text-sm">
          {visibleDrivers.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No key drivers detected.</p>
      )}

      <div className="flex gap-3">
        {driverLimit < keyDrivers.length && (
          <button
            onClick={() => setDriverLimit(driverLimit + 10)}
            className="mt-3 px-3 cursor-pointer bg-indigo-600 rounded-lg"
          >
            Show More Drivers
          </button>
        )}

        <button
          onClick={generateAIExplanation}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 transition"
        >
          AI Explain
        </button>
      </div>

      <ExplanationPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="AI Explanation — Anomaly Analysis"
        content={popupContent}
      />
    </div>
  );
}
