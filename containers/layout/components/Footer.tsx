import React from 'react';

interface FooterProps {
    version: string | null;
}

const Footer: React.FC<FooterProps> = ({ version }) => {
    return (
        <footer className="flex-shrink-0 relative z-10 w-full p-3 text-center text-slate-600 dark:text-slate-400 text-xs border-t border-slate-200 dark:border-slate-800">
            <p>© 2025 HumanizeIQ. All Rights Reserved. {version && `v${version}`}</p>
        </footer>
    );
};

export default Footer;