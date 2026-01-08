'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpenseBreakdown({ data = [], analysis }) {
  const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7f7f',
    '#0088FE',
    '#00C49F',
    '#AA44FF',
  ];

  const [showAI, setShowAI] = useState(false);

  const cleanLabel = (str) =>
    String(str)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  const backendExpenses = Array.isArray(data)
    ? data
        .filter((item) => item?.name && Number(item?.value) > 0)
        .map((item) => ({
          name: cleanLabel(item.name),
          value: Number(item.value),
        }))
    : [];

  const fallbackExpenses = useMemo(() => {
    const f = analysis?.engineeredFeatures;
    if (!f) return [];

    return [
      { name: 'Minimum', value: f.min },
      { name: 'Maximum', value: f.max },
      { name: 'Total Sum', value: f.sum },
      { name: 'Std Dev', value: Number(f.std) },
    ].filter((i) => i.value > 0);
  }, [analysis]);

  let finalData =
    backendExpenses.length > 0 ? backendExpenses : fallbackExpenses;

  finalData = finalData.sort((a, b) => b.value - a.value);

  if (finalData.length > 5) {
    const top = finalData.slice(0, 5);
    const otherSum = finalData.slice(5).reduce((s, i) => s + i.value, 0);
    finalData = [...top, { name: 'Other', value: otherSum }];
  }

  if (finalData.length === 0) {
    return (
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg text-center text-gray-300">
        <h3 className="text-lg font-semibold text-gray-100 mb-3">
          Expense Breakdown
        </h3>
        No financial categories detected in this file.
      </div>
    );
  }

  const total = finalData.reduce((sum, i) => sum + i.value, 0);
  const largest = finalData[0];

  const aiInsights = `
💸 Expense Breakdown Summary

• Categories: ${finalData.length}
• Total Amount: ${total.toLocaleString()}
• Largest: ${largest.name} (${largest.value.toLocaleString()})

${
  largest.value > total * 0.5
    ? '⚠️ Heavily concentrated in one category.'
    : largest.value > total * 0.3
    ? '⚠ Moderate imbalance detected.'
    : '✔ Balanced distribution.'
}
  `;

  return (
    <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-100">Expense Breakdown</h3>

      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie
            data={finalData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={40}
            dataKey="value"
            labelLine={true}
            label={({ name }) => name}
          >
            {finalData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: '#111',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '6px',
            }}
            itemStyle={{ color: '#fff' }}
            formatter={(value, name) => [`${value.toLocaleString()}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700"
        onClick={() => setShowAI(!showAI)}
      >
        {showAI ? 'Hide AI Explanation' : 'AI Explain'}
      </button>

      {showAI && (
        <div className="bg-gray-900 p-3 mt-3 rounded-lg whitespace-pre-wrap text-gray-200">
          {aiInsights}
        </div>
      )}
    </div>
  );
}
