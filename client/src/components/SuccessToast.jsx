// client/src/components/SuccessToast.jsx
import { useEffect, useRef } from "react";

export default function SuccessToast({ message, onClose }) {
  const progressRef = useRef(null);

  // Start 3-second countdown
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Animate progress bar
    const startTime = Date.now();
    const duration = 3000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const width = (remaining / duration) * 100;
      
      if (progressRef.current) {
        progressRef.current.style.width = `${width}%`;
      }

      if (remaining > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="top-6 right-6 z-50 fixed animate-fadeIn">
      <div className="bg-white/95 shadow-2xl backdrop-blur-lg border border-green-200 rounded-2xl max-w-xs overflow-hidden">
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="bg-green-500 h-1 transition-none"
          style={{ width: "100%" }}
        />

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Icon */}
          <div className="bg-green-100 p-1.5 rounded-full text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Message & Button */}
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{message}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="bg-green-100 hover:bg-green-200 mt-2 px-3 py-1 rounded-full text-green-800 text-xs transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}