'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const ALLOWED_EXTENSIONS_ALL = [
  'csv',
  'txt',
  'xlsx',
  'xls',
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'bmp',
  'tiff',
  'doc',
  'docx',
  'rtf',
  'odt',
  'ods',
  'html',
  'htm',
  'json',
  'xml',
];
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff'];
const NON_IMAGE_EXTENSIONS = [
  'csv',
  'txt',
  'xlsx',
  'xls',
  'pdf',
  'doc',
  'docx',
  'rtf',
  'odt',
  'ods',
  'html',
  'htm',
  'json',
  'xml',
];

export default function AttachFilesModal() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false); // New state to track analysis completion
  const [activeTab, setActiveTab] = useState('my-computer');
  const fileInputRef = useRef();
  const router = useRouter();

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  const validateFile = (file) => {
    if (!file) {
      toast.error('No file selected!', {
        position: 'top-right',
        theme: 'colored',
      });
      return false;
    }

    const fileExtension = getFileExtension(file.name);
    const isImage = IMAGE_EXTENSIONS.includes(fileExtension);
    const isNonImage = NON_IMAGE_EXTENSIONS.includes(fileExtension);

    if (!ALLOWED_EXTENSIONS_ALL.includes(fileExtension)) {
      toast.error(`Unsupported file type: ${fileExtension}.`, {
        position: 'top-right',
        theme: 'colored',
      });
      return false;
    }

    if (activeTab === 'files' && isImage) {
      toast.error('This tab only accepts non-image files!', {
        position: 'top-right',
        theme: 'colored',
      });
      return false;
    }
    if (activeTab === 'photos' && !isImage) {
      toast.error('This tab only accepts image files!', {
        position: 'top-right',
        theme: 'colored',
      });
      return false;
    }
    return true;
  };

  const handleFileUploadToBackend = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.', {
        position: 'top-right',
        theme: 'colored',
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setAnalysisComplete(false);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/analyze-document`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.data.status === 'success') {
        console.log('Backend response:', response.data);
        toast.success(
          'File analyzed successfully! Click "Analyse" to view the dashboard.',
          {
            position: 'top-right',
            theme: 'colored',
          }
        );
        setAnalysisComplete(true);
        localStorage.setItem('analysisResults', JSON.stringify(response.data));
      } else if (response.data.status === 'failure') {
        const errorMessage =
          response.data.error || 'Analysis failed due to an unknown error.';
        toast.error(`Analysis failed: ${errorMessage}`, {
          position: 'top-right',
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error('Error during document analysis:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred.';
      toast.error(`Analysis failed: ${errorMessage}`, {
        position: 'top-right',
        theme: 'colored',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setAnalysisComplete(false);
      setProgress(0);
    } else {
      setSelectedFile(null);
      setAnalysisComplete(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setAnalysisComplete(false);
      setProgress(0);
    } else {
      setSelectedFile(null);
      setAnalysisComplete(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleAnalyseClick = () => {
    if (analysisComplete) {
      router.push('/dashboard');
    } else {
      handleFileUploadToBackend();
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} hideProgressBar transition={Slide} />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl w-[720px] max-w-[95vw] flex flex-col overflow-hidden p-6">
          <div className="flex items-center justify-between px-1 pb-0">
            <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Attach Files
            </span>
          </div>

          <div className="grid grid-cols-2 px-1 py-8 pt-6 gap-6">
            <aside className="flex flex-col gap-3 min-w-[200px]">
              {['my-computer', 'files', 'photos'].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 pl-4 w-[70%] rounded-lg text-lg font-medium cursor-pointer transition ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                >
                  {tab === 'my-computer'
                    ? 'My Computer'
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))}
            </aside>

            <main className="flex-1 flex items-center justify-center">
              <div
                className="border-2 border-dashed border-indigo-200 rounded-2xl bg-slate-50 w-[360px] h-[240px] flex flex-col items-center justify-center gap-4"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="mb-2">
                  <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="12" fill="#E0E7FF" />
                    <path
                      d="M12 8v8m0 0-3-3m3 3 3-3"
                      stroke="#6366F1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept={
                    activeTab === 'photos'
                      ? IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(',')
                      : NON_IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(',')
                  }
                />
                <button
                  className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white rounded-md px-6 py-3 font-medium text-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition disabled:opacity-60 cursor-pointer"
                  onClick={handleAttachClick}
                  disabled={uploading}
                >
                  {uploading ? 'Analyzing...' : 'Attach File'}{' '}
                </button>

                {uploading && (
                  <div className="w-full px-6 mt-2">
                    <div className="h-3 bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-indigo-600 mt-1 text-center">
                      {progress}%
                    </div>
                  </div>
                )}
                <div className="text-slate-500 text-sm">or Drag & Drop</div>
              </div>
            </main>
          </div>

          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 border-t border-slate-200">
            <span className="text-slate-500 text-base">
              {selectedFile ? selectedFile.name : '0 files selected'}
            </span>
            <button
              onClick={handleAnalyseClick}
              disabled={uploading || !selectedFile}
              className={`rounded-md py-1 px-4 font-medium text-lg shadow-md transition disabled:opacity-60 ${
                uploading || !selectedFile
                  ? 'bg-slate-300 text-blue-900 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:from-green-500 hover:to-green-700 cursor-pointer'
              }`}
            >
              {analysisComplete ? 'View Dashboard' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
