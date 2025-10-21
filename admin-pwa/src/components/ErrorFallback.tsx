import { Button } from "@/components/ui/button";

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-center">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-2xl w-full">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={resetErrorBoundary}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
};
