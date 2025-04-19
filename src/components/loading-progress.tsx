import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

interface LoadingProgress {
    progress: number;
}

export default function LoadingProgress(
    {
        progress
    }: Readonly<LoadingProgress>) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return null if the DOM is not ready
    if (!mounted) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50 z-[600]">
            <div className="progress-circle flex justify-center items-center">
                <svg width="100" height="100" viewBox="0 0 200 200">
                    <circle className="bg" cx="100" cy="100" r="70" />
                    <circle className="progress" cx="100" cy="100" r="70" style={{ strokeDashoffset: 440 - (440 * progress / 100) }} />
                </svg>

                <div className='progress-text text-sm font-semibold text-white'>{progress < 3 ? 0 : progress}%</div>
            </div>
        </div>,
        document.body
    );
};