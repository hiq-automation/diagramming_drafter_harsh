import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isStudioMode } from '../services/apiUtils';
import MainContainer from './MainContainer';
import { Dashboard } from '../components/Dashboard';
import { SetupPrompt } from '../components/SetupPrompt';
import metadata from '../metadata.json'; // Directly import metadata for initial check
import { AppMetadata } from '../types';

/**
 * DashboardContainer handles the 'Smart' logic for the dashboard:
 * - Authentication state monitoring and redirection
 * - Checks for metadata configuration
 * - Delegates rendering to Dashboard (for authenticated, configured state)
 *   or SetupPrompt (for unconfigured state)
 */
export const DashboardContainer: React.FC = () => {
    const { authState, user, workspaceUrl, signOutUrl } = useAuth();
    const [appMetadata, setAppMetadata] = useState<AppMetadata | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);

    useEffect(() => {
        // Perform initial check on metadata.json values
        if (metadata.name === "Diagram Drafting Studio" || metadata.description === "An AI-powered application for drafting diagrams and generating code from prompts.") {
            setIsConfigured(false);
            setAppMetadata({ name: 'NOTSET', description: 'NOTSET' }); // Indicate unconfigured state
        } else {
            setIsConfigured(true);
            setAppMetadata(metadata as AppMetadata);
        }
    }, []);

    // Handle authentication states
    if (authState === 'checking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-medium">Verifying access...</p>
            </div>
        );
    }
    
    if (authState === 'unauthorized' && !isStudioMode()) {
        window.location.href = '/home/login'; // Redirect to login for deployed mode
        return null; // Don't render anything while redirecting
    }

    if (authState === 'unauthorized' && isStudioMode()) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">You do not have permission to access this application.</p>
                </div>
            </div>
        );
    }

    // Render the setup prompt if metadata is not configured
    if (!isConfigured || !appMetadata) {
      return (
        <MainContainer user={user} workspaceUrl={workspaceUrl} signOutUrl={signOutUrl} >
            <SetupPrompt />
        </MainContainer>
      );
    }

    // Render the dashboard if authenticated and configured
    return (
        <MainContainer user={user} workspaceUrl={workspaceUrl} signOutUrl={signOutUrl}>
            <Dashboard metadata={appMetadata} />
        </MainContainer>
    );
};