
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div
        className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};
