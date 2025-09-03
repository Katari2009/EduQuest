export interface User {
  name: string;
  course: string;
  profilePic: string | null;
  points: number;
  level: number;
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Activity {
  id: string;
  title: string;
  objective: string;
  content: string;
  questions: Question[];
  completed: boolean;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: number]: string };
}
