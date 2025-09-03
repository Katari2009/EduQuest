import React, { useEffect } from 'react';
import type { User, Activity } from '../types';
import Header from './Header';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CURRICULUM, CURRICULUM_PAES, FOOTER_TEXT } from '../constants';
import { BookOpenIcon } from './icons/BookOpen';
import ActivityView from './ActivityView';
import ReportView from './ReportView';

interface DashboardProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    onStartActivity: (activity: Activity) => void;
    onViewReport: () => void;
    onLogout: () => void;
    currentView: 'dashboard' | 'activity' | 'report';
    selectedActivity: Activity | null;
    onReturnToDashboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    user, setUser, activities, setActivities, onStartActivity, 
    onViewReport, onLogout, currentView, selectedActivity, onReturnToDashboard 
}) => {
  useEffect(() => {
    // Initialize activities only if they don't exist
    if (activities.length === 0) {
      setActivities([
        {
          id: 'stats-position-measures',
          title: CURRICULUM.topic,
          objective: CURRICULUM.objective,
          content: CURRICULUM.contents,
          questions: [],
          completed: false,
          score: 0,
          totalQuestions: 0,
          userAnswers: {},
        },
        {
          id: 'paes-math-prep',
          title: CURRICULUM_PAES.topic,
          objective: CURRICULUM_PAES.objective,
          content: CURRICULUM_PAES.contents,
          questions: [],
          completed: false,
          score: 0,
          totalQuestions: 0,
          userAnswers: {},
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.completed).length;
  const progress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  const renderDashboardContent = () => (
    <>
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Bienvenido de nuevo, {user.name}!</h1>
        <p className="text-slate-400 mt-2 text-lg max-w-2xl mx-auto">EduQuest es una aplicación de aprendizaje interactiva y gamificada que transforma el currículum en desafíos atractivos. Domina nuevos conceptos, sigue tu progreso y celebra tus logros.</p>
      </div>

      <Card className="mb-10 p-6 bg-slate-900/30">
        <h2 className="text-2xl font-bold text-white mb-4">Acerca de la App</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Información Curricular</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><span className="font-bold">Asignatura:</span> Matemática</li>
                    <li><span className="font-bold">Nivel:</span> 4° Medio / Preparación PAES</li>
                    <li><span className="font-bold">Contenidos:</span> Estadística Descriptiva, Medidas de Posición, Gráficos de Cajón.</li>
                     <li><span className="font-bold">Temáticas PAES:</span> Números, Álgebra, Geometría, Probabilidad y Estadística.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-cyan-400 mb-2">Habilidades del Siglo XXI</h3>
                 <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><span className="font-bold">Pensamiento Crítico:</span> Analiza y evalúa problemas complejos.</li>
                    <li><span className="font-bold">Resolución de Problemas:</span> Aplica conceptos para encontrar soluciones efectivas.</li>
                    <li><span className="font-bold">Creatividad:</span> Fomenta la generación de ideas y soluciones originales.</li>
                    <li><span className="font-bold">Comunicación:</span> Mejora la capacidad de expresar ideas y resultados de forma clara.</li>
                    <li><span className="font-bold">Autonomía:</span> Monitorea tu propio progreso y gestiona tu aprendizaje.</li>
                    <li><span className="font-bold">Alfabetización Digital:</span> Utiliza la tecnología para potenciar tu educación.</li>
                </ul>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map(activity => (
          <Card key={activity.id} className="transform hover:-translate-y-2 transition-transform duration-300">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <BookOpenIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{activity.title}</h2>
                <p className="text-slate-400 mt-2 text-sm">{activity.objective}</p>
              </div>
              <div className="mt-6 flex-grow"></div>
              <Button onClick={() => onStartActivity(activity)} className="w-full mt-4">
                {activity.completed ? 'Revisar Actividad' : 'Empezar Actividad'}
              </Button>
            </div>
          </Card>
        ))}
        {/* Add more cards for future activities */}
      </div>
    </>
  );

  const renderActiveView = () => {
    switch (currentView) {
      case 'activity':
        if (!selectedActivity) return renderDashboardContent();
        return <ActivityView 
            activity={selectedActivity} 
            onComplete={(updatedActivity) => {
                const newActivities = activities.map(a => a.id === updatedActivity.id ? updatedActivity : a);
                setActivities(newActivities);
                const oldUser = user;
                if(oldUser){
                  const updatedPoints = oldUser.points + updatedActivity.score;
                  const newLevel = Math.floor(updatedPoints / 100) + 1;
                  setUser({...oldUser, points: updatedPoints, level: newLevel});
                }
                onReturnToDashboard();
            }}
            onBack={onReturnToDashboard}
            user={user}
        />;
      case 'report':
        return <ReportView user={user} activities={activities} onBack={onReturnToDashboard} />;
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <Header 
        user={user} 
        progress={progress} 
        onViewReport={onViewReport}
        onLogout={onLogout}
        onDashboardClick={onReturnToDashboard}
      />
      <main className="container mx-auto mt-8">
        {renderActiveView()}
      </main>
      <footer className="text-center text-xs text-slate-500 py-8 mt-16">
        {FOOTER_TEXT}
      </footer>
    </div>
  );
};

export default Dashboard;