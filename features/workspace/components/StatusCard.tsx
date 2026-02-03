import React from 'react';

interface StatusCardProps {
    label: string;
    value: string;
    colorClass: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, colorClass }) => {
    return (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-left">
            <p className={`text-xs font-bold uppercase mb-1 ${colorClass}`}>
                {label}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
                {value}
            </p>
        </div>
    );
};

export default StatusCard;