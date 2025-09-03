
import React from 'react';

interface CompanionAvatarProps {
  level: number;
}

const CompanionAvatar: React.FC<CompanionAvatarProps> = ({ level }) => {
  const colors = [
    '#38bdf8', // sky-400
    '#34d399', // emerald-400
    '#fbbf24', // amber-400
    '#f87171', // red-400
    '#c084fc', // purple-400
  ];
  const color = colors[(level - 1) % colors.length];

  return (
    <div className="w-12 h-12 relative animate-float">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="avatarGradient" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="50" cy="95" rx="30" ry="5" fill="black" opacity="0.2" />
        
        {/* Body */}
        <circle cx="50" cy="55" r="40" fill="url(#avatarGradient)" />
        
        {/* Eyes */}
        <circle cx="35" cy="50" r="6" fill="white" />
        <circle cx="65"cy="50" r="6" fill="white" />
        <circle cx="37" cy="52" r="3" fill="black" className="animate-blink" />
        <circle cx="67" cy="52" r="3" fill="black" className="animate-blink" />

        {/* Accessory based on level */}
        {level >= 3 && (
            // A simple hat
            <path d="M 25 35 Q 50 20 75 35 L 80 40 L 20 40 Z" fill={colors[(level) % colors.length]} stroke="#222" strokeWidth="2"/>
        )}
      </svg>
       <style>{`
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            .animate-float { animation: float 3s ease-in-out infinite; }
            
            @keyframes blink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
            }
            .animate-blink { animation: blink 4s infinite; }
        `}</style>
    </div>
  );
};

export default CompanionAvatar;
