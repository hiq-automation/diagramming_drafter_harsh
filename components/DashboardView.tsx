import React from 'react';
import { AppMetadata } from '../types';

interface DashboardViewProps {
  metadata: AppMetadata;
  greeting: string;
  features: string[];
  isAiLoading: boolean;
}

/**
 * DashboardView is a 'Dumb' component:
 * - It only receives data via props from its container.
 * - It defines the visual layout and style of the dashboard.
 * - Ensures dark mode and responsiveness are applied via Tailwind CSS.
 */
export const DashboardView: React.FC<DashboardViewProps> = ({ metadata, greeting, features, isAiLoading }) => {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden relative dark:bg-slate-800 dark:border-slate-700">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 dark:bg-blue-900/20"></div>
        <div className="relative z-10">
          <h2 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Identity</h2>
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{metadata.name}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">{metadata.description}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-slate-800 dark:border-slate-700">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="p-1 bg-blue-100 rounded text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </span>
            Smart Assistant Greeting
          </h4>
          <div className={`p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-700 transition-opacity duration-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
            "{greeting}"
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-slate-800 dark:border-slate-700">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="p-1 bg-purple-100 rounded text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM6.464 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" />
              </svg>
            </span>
            Dynamic Smart Features
          </h4>
          <ul className="space-y-3">
            {isAiLoading ? (
              [1, 2, 3].map(i => <li key={i} className="h-8 bg-gray-100 animate-pulse rounded dark:bg-slate-700"></li>)
            ) : (
              features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-default dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-purple-700 dark:hover:bg-purple-900/30">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  {feature}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 dark:bg-slate-800 dark:border-slate-700">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Core Capabilities</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Data Tracking', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { label: 'Cloud Sync', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
            { label: 'AI Optimization', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Privacy First', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          ].map((item, idx) => (
            <div key={idx} className="group p-6 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-600 hover:text-white transition-all duration-300 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-4 text-blue-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <h5 className="font-bold">{item.label}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};