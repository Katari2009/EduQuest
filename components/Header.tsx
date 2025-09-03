import React from 'react';
import type { User } from '../types';
import { ProgressBar } from './ui/ProgressBar';
import CompanionAvatar from './CompanionAvatar';
import { LogoutIcon } from './icons/Logout';
import { DocumentReportIcon } from './icons/DocumentReport';
import { LogoIcon } from './icons/Logo';
import { POINTS_TO_LEVEL_UP } from '../constants';

interface HeaderProps {
  user: User;
  progress: number;
  onViewReport: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, progress, onViewReport, onLogout, onDashboardClick }) => {
  const pointsForCurrentLevel = user.points % POINTS_TO_LEVEL_UP;
  const levelProgress = (pointsForCurrentLevel / POINTS_TO_LEVEL_UP) * 100;

  return (
    <header className="container mx-auto">
      <div className="bg-slate-800/20 backdrop-blur-lg border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onDashboardClick} className="flex items-center gap-2 flex-shrink-0">
             <LogoIcon className="h-10 w-10 text-cyan-400" />
          </button>
          <div className="flex items-center gap-4">
             {user.profilePic ? (
               <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xl font-bold">{user.name.charAt(0)}</span>
                </div>
            )}
            <div>
              <h2 className="font-bold text-white text-lg">{user.name}</h2>
              <p className="text-sm text-slate-400">{user.course}</p>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex items-center gap-6">
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-cyan-400">Nivel {user.level}</span>
                    <span className="text-xs text-slate-400">{user.points} Puntos</span>
                </div>
                <ProgressBar progress={levelProgress} />
            </div>

            <CompanionAvatar level={user.level} />

            <div className="flex items-center gap-2">
                <button onClick={onViewReport} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors" aria-label="Ver Reporte">
                    <DocumentReportIcon className="w-6 h-6 text-slate-300" />
                </button>
                <button onClick={onLogout} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors" aria-label="Cerrar Sesión">
                    <LogoutIcon className="w-6 h-6 text-slate-300" />
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
