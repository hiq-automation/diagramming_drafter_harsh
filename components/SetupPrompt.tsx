
import React from 'react';

export const SetupPrompt: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="bg-amber-100 p-4 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuration Required</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The application metadata is currently set to <code className="bg-gray-100 px-1 rounded text-red-600">NOTSET</code>. 
        Please update the <span className="font-mono font-semibold">metadata.json</span> file with your app's name and description to proceed.
      </p>
      
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-xl text-left font-mono text-sm max-w-xl w-full">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-gray-400">metadata.json</span>
        </div>
        <pre>{`{
  "name": "Your Awesome App",
  "description": "A powerful tool to help users manage..."
}`}</pre>
      </div>
      
      <p className="mt-8 text-sm text-gray-500 italic">
        The AI will automatically generate features and interfaces based on your definition once you reload.
      </p>
    </div>
  );
};
