import { useState } from 'react';

const InfoBanner = () => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;
    return (
        <div className="info-banner">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span>Free tier — data may take up to 50 seconds to load on first request.</span>
            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-violet-400 hover:text-violet-700 hover:bg-violet-100 transition-colors text-xs font-bold"
            >
                ✕
            </button>
        </div>
    );
};

export default InfoBanner;
