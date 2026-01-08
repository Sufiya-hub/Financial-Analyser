'use client';

import { useEffect } from 'react';

export default function ExplanationPopup({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white w-11/12 max-w-lg p-6 rounded-lg shadow-lg relative border border-gray-700">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>

        <div
          className="text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-scroll pr-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {content}
        </div>
        <button
          onClick={onClose}
          className="absolute bottom-3 right-3 cursor-pointer text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
