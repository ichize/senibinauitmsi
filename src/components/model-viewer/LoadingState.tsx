
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, error, onRetry }) => {
  if (!isLoading && !error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500">Loading model...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center px-4">
          <p className="text-lg text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            The model file may not be available or could be experiencing loading issues.
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              Retry Loading
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingState;
