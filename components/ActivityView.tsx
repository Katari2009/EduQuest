
import React, { useState, useEffect, useCallback } from 'react';
import type { Activity, Question, User } from '../types';
import { generateQuestions, generatePaesQuestions } from '../services/geminiService';
import { Spinner } from './ui/Spinner';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeftIcon } from './icons/ArrowLeft';
import { CheckCircleIcon } from './icons/CheckCircle';
import { XCircleIcon } from './icons/XCircle';
import { POINTS_PER_CORRECT_ANSWER } from '../constants';

interface ActivityViewProps {
  activity: Activity;
  onComplete: (activity: Activity) => void;
  onBack: () => void;
  user: User;
}

const ActivityView: React.FC<ActivityViewProps> = ({ activity, onComplete, onBack, user }) => {
  const [questions, setQuestions] = useState<Question[]>(activity.questions);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const fetchAndSetQuestions = useCallback(async () => {
    if (activity.questions && activity.questions.length > 0) {
      setQuestions(activity.questions);
      return;
    }
    setLoading(true);

    let fetchedQuestions;
    if (activity.id === 'paes-math-prep') {
      fetchedQuestions = await generatePaesQuestions(activity.title, activity.objective);
    } else {
      fetchedQuestions = await generateQuestions(activity.title, activity.objective);
    }
    
    setQuestions(fetchedQuestions);
    setLoading(false);
  }, [activity.id, activity.title, activity.objective, activity.questions]);

  useEffect(() => {
    fetchAndSetQuestions();
  }, [fetchAndSetQuestions]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + POINTS_PER_CORRECT_ANSWER);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    const finalActivityState: Activity = {
      ...activity,
      questions,
      completed: true,
      score: score,
      totalQuestions: questions.length,
      userAnswers: userAnswers,
    };
    onComplete(finalActivityState);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner />
        <p className="mt-4 text-lg text-slate-300">Generando tu desafío con IA...</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold text-white">¡Actividad Completada!</h2>
        <p className="text-slate-300 mt-4 text-xl">
          Obtuviste {score / POINTS_PER_CORRECT_ANSWER} de {questions.length} respuestas correctas.
        </p>
        <p className="text-cyan-400 font-bold text-2xl mt-4">
          +{score} Puntos
        </p>
        <Button onClick={handleFinish} className="mt-8">
          Volver al Dashboard
        </Button>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p className="text-slate-400">No se pudieron cargar las preguntas. Intenta de nuevo.</p>
        <Button onClick={onBack} className="mt-4">Volver</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500/80 ring-2 ring-green-400';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500/80 ring-2 ring-red-400';
    }
    return 'bg-slate-800 opacity-50';
  };

  return (
    <div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Dashboard
        </button>

        <Card className="max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <p className="text-sm font-medium text-cyan-400">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-6">{currentQuestion.questionText}</h2>

                <div className="mt-8 space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-300 text-white font-medium text-lg ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 rounded-lg bg-slate-800/50">
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                             <div className="flex items-center gap-3">
                                <CheckCircleIcon className="w-8 h-8 text-green-400"/>
                                <div>
                                    <h3 className="font-bold text-green-400 text-lg">¡Correcto!</h3>
                                    <p className="text-slate-300 text-sm mt-1">{currentQuestion.explanation}</p>
                                </div>
                            </div>
                        ) : (
                             <div className="flex items-center gap-3">
                                <XCircleIcon className="w-8 h-8 text-red-400"/>
                                <div>
                                    <h3 className="font-bold text-red-400 text-lg">Incorrecto</h3>
                                    <p className="text-slate-300 text-sm mt-1">La respuesta correcta es: <strong>{currentQuestion.correctAnswer}</strong></p>
                                    <p className="text-slate-400 text-sm mt-2">{currentQuestion.explanation}</p>
                                </div>
                            </div>
                        )}
                         <Button onClick={handleNextQuestion} className="w-full mt-4">
                            {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
};

export default ActivityView;