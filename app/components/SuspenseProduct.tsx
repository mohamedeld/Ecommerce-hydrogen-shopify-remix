import React from 'react';

export const SuspenseProduct = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({length: 3}).map((_, index) => (
        <div key={index} className="animate-pulse flex flex-wrap gap-4">
          <div className="h-20 w-20 bg-gray-200 rounded"></div>
          <div className="h-20 w-20 bg-gray-200 rounded"></div>
          <div className="h-20 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};
