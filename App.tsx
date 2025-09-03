
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, Activity } from './types';

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('eduquest-user', null);
  const [activities, setActivities] = useLocalStorage<Activity[]>('eduquest-activities', []);
  const [currentView, setCurrentView] = useState<'dashboard' | 'activity' | 'report' | 'login'>('login');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  const backgrounds = [
    'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
    'bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900',
  ];
  const [backgroundClass, setBackgroundClass] = useState('');

  useEffect(() => {
    setBackgroundClass(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActivities([]);
    setCurrentView('login');
  };

  const startOrResumeActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentView('activity');
  };

  const viewReport = () => {
    setCurrentView('report');
  };
  
  const returnToDashboard = () => {
    setSelectedActivity(null);
    setCurrentView('dashboard');
  }

  const renderContent = () => {
    if (currentView === 'login' || !user) {
      return <Login onLogin={handleLogin} />;
    }
    return (
        <Dashboard 
            user={user}
            setUser={setUser}
            activities={activities}
            setActivities={setActivities}
            onStartActivity={startOrResumeActivity}
            onViewReport={viewReport}
            onLogout={handleLogout}
            currentView={currentView}
            selectedActivity={selectedActivity}
            onReturnToDashboard={returnToDashboard}
        />
    )
  };

  return (
    <main className={`min-h-screen w-full text-white transition-all duration-500 ${backgroundClass}`}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
