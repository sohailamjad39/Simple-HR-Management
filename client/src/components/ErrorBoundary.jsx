// client/src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Reset on navigation
      return (
        <div className="flex justify-center items-center bg-gray-50 h-screen">
          <div className="text-center">
            <h2 className="font-semibold text-gray-900 text-xl">Something went wrong.</h2>
            <p className="mt-1 text-gray-600">Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 mt-4 px-4 py-2 rounded-lg text-white"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;