import { StudentSubmission, ActiveStudentSession, CourseMetrics } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';

const SUBMISSIONS_KEY = 'hobbes_leviatan_submissions_v1';
const ACTIVE_SESSIONS_KEY = 'hobbes_leviatan_active_sessions_v1';
const QUIZ_STATE_KEY = 'hobbes_leviatan_quiz_status_v1';

// Broadcast Channel for true inter-tab real-time updates
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('hobbes_quiz_channel');
  }
} catch {
  // fallback if not supported
}

export function notifySync(action: string, payload?: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ action, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn('Broadcast failed', e);
    }
  }
}

export function subscribeToSync(callback: (action: string, payload?: any) => void): () => void {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    callback(event.data.action, event.data.payload);
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}

// Initial demo students so the teacher has a vivid real-time report right away
const INITIAL_DEMO_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-001',
    studentId: '1098765432',
    studentName: 'Sofía Valentina Morales',
    email: 'sofia.morales@universidad.edu.co',
    startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1210, // ~20 mins
    answers: { 1: 'a', 2: 'b', 3: 'a', 4: 'b', 5: 'c' },
    score: 5.0,
    percentage: 100,
    status: 'completed',
    performanceLevel: 'Superior',
    dimensionBreakdown: { literal: 1, inferencial: 1, conceptual: 1, estructural: 1, critica: 1 }
  },
  {
    id: 'sub-002',
    studentId: '1012345678',
    studentName: 'Camilo Andrés Restrepo',
    email: 'camilo.restrepo@universidad.edu.co',
    startedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1480, // ~24 mins
    answers: { 1: 'a', 2: 'b', 3: 'a', 4: 'a', 5: 'c' }, // missed Q4
    score: 4.0,
    percentage: 80,
    status: 'completed',
    performanceLevel: 'Alto',
    dimensionBreakdown: { literal: 1, inferencial: 1, conceptual: 1, estructural: 0, critica: 1 }
  },
  {
    id: 'sub-003',
    studentId: '1034567890',
    studentName: 'María Paula Echeverri',
    email: 'maria.echeverri@universidad.edu.co',
    startedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1650, // ~27 mins
    answers: { 1: 'a', 2: 'b', 3: 'd', 4: 'b', 5: 'c' }, // missed Q3
    score: 4.0,
    percentage: 80,
    status: 'completed',
    performanceLevel: 'Alto',
    dimensionBreakdown: { literal: 1, inferencial: 1, conceptual: 0, estructural: 1, critica: 1 }
  },
  {
    id: 'sub-004',
    studentId: '1076543210',
    studentName: 'Juan Diego Henao',
    email: 'juan.henao@universidad.edu.co',
    startedAt: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1520,
    answers: { 1: 'a', 2: 'a', 3: 'a', 4: 'a', 5: 'c' }, // missed Q2, Q4
    score: 3.0,
    percentage: 60,
    status: 'completed',
    performanceLevel: 'Básico',
    dimensionBreakdown: { literal: 1, inferencial: 0, conceptual: 1, estructural: 0, critica: 1 }
  },
  {
    id: 'sub-005',
    studentId: '1088992233',
    studentName: 'Daniel Felipe Guzmán',
    email: 'daniel.guzman@universidad.edu.co',
    startedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 66 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1140,
    answers: { 1: 'b', 2: 'b', 3: 'a', 4: 'b', 5: 'c' }, // missed Q1
    score: 4.0,
    percentage: 80,
    status: 'completed',
    performanceLevel: 'Alto',
    dimensionBreakdown: { literal: 0, inferencial: 1, conceptual: 1, estructural: 1, critica: 1 }
  },
  {
    id: 'sub-006',
    studentId: '1045671234',
    studentName: 'Valentina Ospina Gómez',
    email: 'valentina.ospina@universidad.edu.co',
    startedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 82 * 60 * 1000).toISOString(),
    timeTakenSeconds: 1080,
    answers: { 1: 'a', 2: 'a', 3: 'b', 4: 'a', 5: 'b' }, // scored 1.0
    score: 1.0,
    percentage: 20,
    status: 'completed',
    performanceLevel: 'Bajo',
    dimensionBreakdown: { literal: 1, inferencial: 0, conceptual: 0, estructural: 0, critica: 0 }
  }
];

// Active mock student solving the quiz right now
const INITIAL_DEMO_ACTIVE: ActiveStudentSession[] = [
  {
    studentId: '1099887766',
    studentName: 'Mateo Cárdenas Silva',
    startedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    currentQuestion: 3,
    answeredCount: 2,
    remainingSeconds: 18 * 60 - 20,
    lastActive: new Date().toISOString()
  }
];

export function getSubmissions(): StudentSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_DEMO_SUBMISSIONS));
      return INITIAL_DEMO_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_SUBMISSIONS;
  }
}

export function saveSubmissions(list: StudentSubmission[]) {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
    notifySync('submissions_updated', list);
  } catch (e) {
    console.error('Error saving submissions', e);
  }
}

export function getActiveSessions(): ActiveStudentSession[] {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(INITIAL_DEMO_ACTIVE));
      return INITIAL_DEMO_ACTIVE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ACTIVE;
  }
}

export function saveActiveSessions(list: ActiveStudentSession[]) {
  try {
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(list));
    notifySync('active_sessions_updated', list);
  } catch (e) {
    console.error('Error saving active sessions', e);
  }
}

// Student Attempt Checks
export function checkStudentAttempt(studentId: string): StudentSubmission | null {
  const cleanId = studentId.trim().toLowerCase();
  const list = getSubmissions();
  return list.find(s => s.studentId.trim().toLowerCase() === cleanId) || null;
}

export function registerActiveSession(studentId: string, studentName: string) {
  const sessions = getActiveSessions().filter(s => s.studentId.trim().toLowerCase() !== studentId.trim().toLowerCase());
  const newSession: ActiveStudentSession = {
    studentId: studentId.trim(),
    studentName: studentName.trim(),
    startedAt: new Date().toISOString(),
    currentQuestion: 1,
    answeredCount: 0,
    remainingSeconds: 30 * 60,
    lastActive: new Date().toISOString()
  };
  sessions.push(newSession);
  saveActiveSessions(sessions);
}

export function updateActiveProgress(studentId: string, currentQuestion: number, answeredCount: number, remainingSeconds: number) {
  const sessions = getActiveSessions();
  const session = sessions.find(s => s.studentId.trim().toLowerCase() === studentId.trim().toLowerCase());
  if (session) {
    session.currentQuestion = currentQuestion;
    session.answeredCount = answeredCount;
    session.remainingSeconds = remainingSeconds;
    session.lastActive = new Date().toISOString();
    saveActiveSessions(sessions);
  }
}

export function removeActiveSession(studentId: string) {
  const sessions = getActiveSessions().filter(s => s.studentId.trim().toLowerCase() !== studentId.trim().toLowerCase());
  saveActiveSessions(sessions);
}

// Calculate submission result
export function calculateSubmission(
  studentId: string,
  studentName: string,
  startedAt: string,
  answers: Record<number, string>,
  email?: string
): StudentSubmission {
  const submittedAt = new Date().toISOString();
  const startMs = new Date(startedAt).getTime();
  const submitMs = new Date(submittedAt).getTime();
  const timeTakenSeconds = Math.max(1, Math.floor((submitMs - startMs) / 1000));

  let totalPoints = 0;
  const breakdown = {
    literal: 0,
    inferencial: 0,
    conceptual: 0,
    estructural: 0,
    critica: 0
  };

  QUIZ_QUESTIONS.forEach(q => {
    const selected = answers[q.id];
    if (selected === q.correctOptionId) {
      totalPoints += q.points;
      if (q.dimension === 'Literal') breakdown.literal = 1;
      if (q.dimension === 'Inferencial') breakdown.inferencial = 1;
      if (q.dimension === 'Conceptual') breakdown.conceptual = 1;
      if (q.dimension === 'Estructural') breakdown.estructural = 1;
      if (q.dimension === 'Crítica-Aplicada') breakdown.critica = 1;
    }
  });

  // Score on 5.0 scale (formatted with 1 decimal)
  const score = Number(totalPoints.toFixed(1));
  const percentage = Math.round((score / 5.0) * 100);

  let performanceLevel: 'Superior' | 'Alto' | 'Básico' | 'Bajo' = 'Bajo';
  if (score >= 4.6) performanceLevel = 'Superior';
  else if (score >= 4.0) performanceLevel = 'Alto';
  else if (score >= 3.0) performanceLevel = 'Básico';
  else performanceLevel = 'Bajo';

  const submission: StudentSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    studentId: studentId.trim(),
    studentName: studentName.trim(),
    email,
    startedAt,
    submittedAt,
    timeTakenSeconds,
    answers,
    score,
    percentage,
    status: 'completed',
    performanceLevel,
    dimensionBreakdown: breakdown
  };

  // Save to submissions
  const existingList = getSubmissions().filter(s => s.studentId.trim().toLowerCase() !== studentId.trim().toLowerCase());
  existingList.push(submission);
  saveSubmissions(existingList);

  // Remove from active sessions
  removeActiveSession(studentId);

  return submission;
}

// Instructor: Reset student attempt
export function resetStudentAttempt(studentId: string): boolean {
  const list = getSubmissions().filter(s => s.studentId.trim().toLowerCase() !== studentId.trim().toLowerCase());
  saveSubmissions(list);
  removeActiveSession(studentId);
  return true;
}

// Reset all to demo
export function resetAllDataToDemo() {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_DEMO_SUBMISSIONS));
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(INITIAL_DEMO_ACTIVE));
  notifySync('data_reset_demo');
}

// Compute Course Metrics
export function computeCourseMetrics(submissions: StudentSubmission[], activeSessions: ActiveStudentSession[]): CourseMetrics {
  const completed = submissions.filter(s => s.status === 'completed');
  const totalCompleted = completed.length;
  const totalInProgress = activeSessions.length;
  const totalRegistered = totalCompleted + totalInProgress;

  if (totalCompleted === 0) {
    return {
      totalRegistered,
      totalCompleted: 0,
      totalInProgress,
      averageScore: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
      averageTimeSeconds: 0,
      questionAccuracy: {}
    };
  }

  const totalScoreSum = completed.reduce((acc, s) => acc + s.score, 0);
  const averageScore = Number((totalScoreSum / totalCompleted).toFixed(2));
  const passingCount = completed.filter(s => s.score >= 3.0).length;
  const passRate = Math.round((passingCount / totalCompleted) * 100);

  const scores = completed.map(s => s.score);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);

  const totalTimeSum = completed.reduce((acc, s) => acc + s.timeTakenSeconds, 0);
  const averageTimeSeconds = Math.round(totalTimeSum / totalCompleted);

  // Question by question accuracy
  const questionAccuracy: Record<number, any> = {};
  QUIZ_QUESTIONS.forEach(q => {
    let correct = 0;
    const optionCounts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    completed.forEach(sub => {
      const ans = sub.answers[q.id];
      if (ans) optionCounts[ans] = (optionCounts[ans] || 0) + 1;
      if (ans === q.correctOptionId) {
        correct++;
      }
    });

    // find most common wrong option
    let mostCommonWrong = '';
    let maxWrongCount = 0;
    Object.entries(optionCounts).forEach(([opt, count]) => {
      if (opt !== q.correctOptionId && count > maxWrongCount) {
        maxWrongCount = count;
        mostCommonWrong = opt;
      }
    });

    questionAccuracy[q.id] = {
      questionId: q.id,
      title: q.title,
      correctCount: correct,
      totalAttempts: totalCompleted,
      accuracyPercentage: Math.round((correct / totalCompleted) * 100),
      commonMistakeOption: mostCommonWrong || undefined
    };
  });

  return {
    totalRegistered,
    totalCompleted,
    totalInProgress,
    averageScore,
    passRate,
    highestScore,
    lowestScore,
    averageTimeSeconds,
    questionAccuracy
  };
}

// Export Submissions as CSV
export function exportSubmissionsToCSV(submissions: StudentSubmission[]): string {
  const headers = [
    'ID Estudiante',
    'Nombre Completo',
    'Nota Final (sobre 5.0)',
    'Porcentaje (%)',
    'Nivel Desempeño',
    'Estado',
    'Tiempo Empleado (min)',
    'Fecha de Envío',
    'P1 (Literal)',
    'P2 (Inferencial)',
    'P3 (Conceptual)',
    'P4 (Estructural)',
    'P5 (Crítica)'
  ];

  const rows = submissions.map(s => [
    `"${s.studentId}"`,
    `"${s.studentName}"`,
    s.score.toFixed(1),
    `${s.percentage}%`,
    `"${s.performanceLevel}"`,
    s.score >= 3.0 ? 'APROBADO' : 'REPROBADO',
    Math.round(s.timeTakenSeconds / 60),
    `"${new Date(s.submittedAt).toLocaleString('es-CO')}"`,
    s.answers[1] === 'a' ? '1.0 (Correcto)' : `0.0 (${s.answers[1]?.toUpperCase() || '-'})`,
    s.answers[2] === 'b' ? '1.0 (Correcto)' : `0.0 (${s.answers[2]?.toUpperCase() || '-'})`,
    s.answers[3] === 'a' ? '1.0 (Correcto)' : `0.0 (${s.answers[3]?.toUpperCase() || '-'})`,
    s.answers[4] === 'b' ? '1.0 (Correcto)' : `0.0 (${s.answers[4]?.toUpperCase() || '-'})`,
    s.answers[5] === 'c' ? '1.0 (Correcto)' : `0.0 (${s.answers[5]?.toUpperCase() || '-'})`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
