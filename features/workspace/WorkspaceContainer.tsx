import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { isStudioMode } from '../../services/apiUtils';
import MainContainer from '../../containers/MainContainer';
import WorkspaceView from './WorkspaceView';

/**
 * WorkspaceContainer handles the 'Smart' logic:
 * - Authentication state monitoring
 * - Redirections
 * - Data fetching/preparation for the View
 */
const WorkspaceContainer: React.FC = () => {
    const { authState, user, workspaceUrl, signOutUrl } = useAuth();

    useEffect(() => {
        if (authState === 'unauthorized' && !isStudioMode()) {
            window.location.href = '/home/login';
        }
    }, [authState]);

    if (authState === 'checking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
                <p className="mt-4 text-lg font-medium">Verifying access...</p>
            </div>
        );
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

    return (
        <MainContainer user={user} workspaceUrl={workspaceUrl} signOutUrl={signOutUrl}>
            <WorkspaceView user={user} />
        </MainContainer>
    );
};

export default WorkspaceContainer;