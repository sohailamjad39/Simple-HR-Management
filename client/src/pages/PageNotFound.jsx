// client/src/components/PageNotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-indigo-50 px-4 min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute bg-indigo-100 opacity-70 blur-xl rounded-full w-80 h-80 animate-pulse mix-blend-multiply filter"></div>
        <div className="-bottom-40 -left-40 absolute bg-purple-100 opacity-70 blur-xl rounded-full w-80 h-80 animate-pulse delay-1000 mix-blend-multiply filter"></div>
        <div className="top-1/2 left-1/2 absolute bg-pink-100 opacity-70 blur-xl rounded-full w-80 h-80 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000 transform mix-blend-multiply filter"></div>
      </div>

      <div className="relative w-full max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-lg font-bold text-transparent text-9xl">
              404
            </div>
            <div className="-top-4 -right-4 absolute bg-yellow-400 opacity-20 rounded-full w-24 h-24 animate-bounce"></div>
            <div className="-bottom-2 -left-2 absolute bg-pink-400 opacity-20 rounded-full w-16 h-16 animate-bounce delay-500"></div>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="mb-4 font-bold text-gray-900 text-4xl md:text-6xl">
          Page Not Found
        </h1>
        <p className="mb-8 text-gray-600 text-xl leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Decorative Line */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-24 h-1"></div>
        </div>

        {/* Description */}
        <p className="mx-auto mb-12 max-w-lg text-gray-500">
          Don't worry, our HR system is still running smoothly. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex sm:flex-row flex-col justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50 shadow-sm px-8 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer transform"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-purple-600 hover:to-purple-700 shadow-lg px-8 py-3 rounded-xl font-medium text-white hover:scale-105 transition-all duration-200 cursor-pointer transform"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Fun Illustration */}
        <div className="mt-16 text-6xl">
          <span className="inline-block animate-bounce delay-0">📁</span>
          <span className="inline-block animate-bounce delay-200">🔍</span>
          <span className="inline-block animate-bounce delay-400">🤷‍♂️</span>
        </div>

        {/* Footer Tip */}
        <div className="bg-white/60 backdrop-blur-sm mx-auto mt-12 p-4 border border-gray-200 rounded-xl max-w-md">
          <p className="text-gray-500 text-sm">
            <strong>Tip:</strong> Check the URL for typos or use the navigation menu to find what you need.
          </p>
        </div>
      </div>
    </div>
  );
}