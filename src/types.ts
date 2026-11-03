export interface Option {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
}

export interface Question {
  id: number;
  questionNumber: number;
  chapter: string;
  pagesRef: string;
  dimension: 'Literal' | 'Inferencial' | 'Conceptual' | 'Estructural' | 'Crítica-Aplicada';
  title: string;
  text: string;
  quotePrompt?: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
  hobbesQuote: string;
  points: number; // 1.0 each for total 5.0
}

export interface StudentAnswer {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface StudentSubmission {
  id: string;
  studentId: string; // Cédula o Código
  studentName: string;
  email?: string;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number; // e.g. 1250 seconds out of 1800
  answers: Record<number, string>; // questionId -> selectedOptionId
  score: number; // 0.0 to 5.0
  percentage: number; // 0 to 100%
  status: 'completed' | 'in_progress';
  performanceLevel: 'Superior' | 'Alto' | 'Básico' | 'Bajo';
  dimensionBreakdown: {
    literal: number; // 0 or 1
    inferencial: number; // 0 or 1
    conceptual: number; // 0 or 1
    estructural: number; // 0 or 1
    critica: number; // 0 or 1
  };
}

export interface ActiveStudentSession {
  studentId: string;
  studentName: string;
  startedAt: string;
  currentQuestion: number;
  answeredCount: number;
  remainingSeconds: number;
  lastActive: string;
}

export interface CourseMetrics {
  totalRegistered: number;
  totalCompleted: number;
  totalInProgress: number;
  averageScore: number; // e.g. 4.1
  passRate: number; // percentage >= 3.0
  highestScore: number;
  lowestScore: number;
  averageTimeSeconds: number;
  questionAccuracy: Record<number, {
    questionId: number;
    title: string;
    correctCount: number;
    totalAttempts: number;
    accuracyPercentage: number;
    commonMistakeOption?: string;
  }>;
}
