import { useState } from 'react';

const InfoBanner = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm p-3 px-4 shadow-sm relative">
            <p className="text-center font-medium">
                ⏳ This is a free tier app — data may take up to 50 seconds to load.
            </p>
            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 top-2 text-yellow-800 font-bold hover:text-red-500 transition"
            >
                ✕
            </button>
        </div>
    );
};

export default InfoBanner;
