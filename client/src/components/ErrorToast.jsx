// client/src/components/ErrorToast.jsx
export default function ErrorToast({ message, onClose }) {
    return (
      <div className="top-6 right-6 z-50 fixed animate-fadeIn">
        <div className="flex items-center gap-3 bg-white/95 shadow-2xl backdrop-blur-lg px-4 py-3 border border-red-200 rounded-2xl max-w-xs">
          <div className="bg-red-100 p-1.5 rounded-full text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="font-medium text-gray-900 text-sm">{message}</p>
        </div>
      </div>
    );
  }