import React from 'react';
import { User } from '../../../types';
import StatusCard from './StatusCard';

interface StatusGridProps {
    user: User | null;
}

const StatusGrid: React.FC<StatusGridProps> = ({ user }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <StatusCard 
                label="Auth" 
                value={`Verified for ${user?.name || 'Guest'}`} 
                colorClass="text-blue-600" 
            />
            <StatusCard 
                label="Theme" 
                value="Dark mode & a11y integrated" 
                colorClass="text-purple-600" 
            />
            <StatusCard 
                label="AI" 
                value="Gemini API ready" 
                colorClass="text-green-600" 
            />
        </div>
    );
};

export default StatusGrid;