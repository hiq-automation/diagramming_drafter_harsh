
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {title.charAt(0)}
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                {title === 'NOTSET' ? 'App Template' : title}
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium">Insights</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 text-sm font-medium">Settings</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-xs">
          Powered by Gemini AI & Dynamic Metadata Template
        </div>
      </footer>
    </div>
  );
};
