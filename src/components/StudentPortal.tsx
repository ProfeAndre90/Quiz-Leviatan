import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Send,
  User,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_CONFIG } from '../data/quizData';
import {
  checkStudentAttempt,
  registerActiveSession,
  updateActiveProgress,
  calculateSubmission,
  removeActiveSession
} from '../services/storage';
import { StudentSubmission } from '../types';

interface StudentPortalProps {
  onExamCompleted: (submission: StudentSubmission) => void;
  onOpenReading: () => void;
  onViewExistingSubmission: (submission: StudentSubmission) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onExamCompleted,
  onOpenReading,
  onViewExistingSubmission
}) => {
  // Login / Registration state
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [existingSubmission, setExistingSubmission] = useState<StudentSubmission | null>(null);

  // Exam state
  const [isExamActive, setIsExamActive] = useState(false);
  const [startTime, setStartTime] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(QUIZ_CONFIG.timeLimitSeconds);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeUpWarning, setTimeUpWarning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Login / Identity Verification
  const handleStartExamAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanName = studentName.trim();
    const cleanId = studentId.trim();

    if (!cleanName || !cleanId) {
      setLoginError('Por favor ingresa tu nombre completo y tu documento / código de estudiante.');
      return;
    }

    if (cleanName.length < 3) {
      setLoginError('Por favor ingresa un nombre válido.');
      return;
    }

    if (cleanId.length < 4) {
      setLoginError('El código o identificación debe tener al menos 4 caracteres.');
      return;
    }

    // Check single attempt restriction!
    const previous = checkStudentAttempt(cleanId);
    if (previous) {
      setExistingSubmission(previous);
      return;
    }

    // Initialize Exam
    const nowIso = new Date().toISOString();
    setStartTime(nowIso);
    setRemainingSeconds(QUIZ_CONFIG.timeLimitSeconds);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsExamActive(true);

    // Register in active sessions for real-time teacher monitor
    registerActiveSession(cleanId, cleanName);
  };

  // Timer countdown
  useEffect(() => {
    if (!isExamActive) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimeUpWarning(true);
          // Auto submit when time runs out
          finalizeExamSubmission();
          return 0;
        }

        // Periodic sync to teacher dashboard
        if (prev % 5 === 0) {
          const answeredCount = Object.keys(selectedAnswers).length;
          updateActiveProgress(studentId, currentQuestionIndex + 1, answeredCount, prev - 1);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, currentQuestionIndex, selectedAnswers, studentId]);

  // Update answer selection
  const handleSelectOption = (questionId: number, optionId: string) => {
    const updated = { ...selectedAnswers, [questionId]: optionId };
    setSelectedAnswers(updated);

    // Real-time update to active session
    updateActiveProgress(studentId, currentQuestionIndex + 1, Object.keys(updated).length, remainingSeconds);
  };

  // Finalize Submission
  const finalizeExamSubmission = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);
    setShowConfirmModal(false);

    const submission = calculateSubmission(
      studentId,
      studentName,
      startTime || new Date(Date.now() - (QUIZ_CONFIG.timeLimitSeconds - remainingSeconds) * 1000).toISOString(),
      selectedAnswers,
      studentEmail || undefined
    );

    onExamCompleted(submission);
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const answeredTotal = Object.keys(selectedAnswers).length;
  const isTimeCritical = remainingSeconds <= 300; // < 5 mins
  const isTimeUrgent = remainingSeconds <= 60; // < 1 min

  // ================= VIEW: BLOCKED DUE TO PREVIOUS ATTEMPT =================
  if (existingSubmission) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Control de Intento Único
            </span>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              Evaluación Ya Realizada
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Hola, <strong className="text-amber-200">{existingSubmission.studentName}</strong> (ID: {existingSubmission.studentId}).
              Según los parámetros establecidos, esta prueba cuenta con un <strong>único intento estricto</strong>.
            </p>
          </div>

          {/* Previous result card */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs text-slate-400">Calificación obtenida:</span>
              <span className="text-2xl font-black text-amber-300 font-serif-title">
                {existingSubmission.score.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Nivel de Desempeño:</span>
                <span className="font-semibold text-white">{existingSubmission.performanceLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tiempo Empleado:</span>
                <span className="font-semibold text-white">{Math.round(existingSubmission.timeTakenSeconds / 60)} minutos</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Fecha de Presentación:</span>
                <span className="font-semibold text-white">
                  {new Date(existingSubmission.submittedAt).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onViewExistingSubmission(existingSubmission)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Ver Mi Retroalimentación Detallada
            </button>
            <button
              onClick={() => {
                setExistingSubmission(null);
                setStudentId('');
                setStudentName('');
              }}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Ingresar con otro documento
            </button>
          </div>

          <p className="text-xs text-slate-500">
            * Si tuviste algún inconveniente técnico, el docente a cargo puede autorizar un nuevo intento desde el Panel Docente.
          </p>
        </div>
      </div>
    );
  }

  // ================= VIEW: REGISTRATION / WELCOME =================
  if (!isExamActive) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Welcome Info Banner */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                Evaluación Académica de Filosofía Política
              </div>
              <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Quiz de Comprensión Lectora: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  Leviatán de Thomas Hobbes
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed font-reading">
                Bienvenido al portal oficial de evaluación. Esta prueba mide tu comprensión literal, inferencial, conceptual y crítica del texto fundamental de Thomas Hobbes sobre el estado de naturaleza, el contrato social y los derechos de la soberanía.
              </p>
            </div>

            {/* Assessment Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Tiempo Límite
                </div>
                <div className="text-lg font-bold text-white">30 Minutos</div>
                <p className="text-xs text-slate-400">
                  Temporizador continuo. Podrás concluir antes si terminas tus respuestas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Sistema de Calificación
                </div>
                <div className="text-lg font-bold text-white">5 Preguntas (5.0 pts)</div>
                <p className="text-xs text-slate-400">
                  1.0 punto por pregunta. Calificación estándar de 0.0 a 5.0 (Aprobación: 3.0).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" /> Intento Único
                </div>
                <div className="text-lg font-bold text-white">1 Sola Oportunidad</div>
                <p className="text-xs text-slate-400">
                  Tu documento quedará registrado al entregar y no podrás reiniciarlo libremente.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" /> Retroalimentación
                </div>
                <div className="text-lg font-bold text-white">Inmediata y Textual</div>
                <p className="text-xs text-slate-400">
                  Al enviar recibirás análisis pregunta a pregunta con citas exactas de Hobbes.
                </p>
              </div>
            </div>

            {/* Quick reading access button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-200">¿Deseas repasar la lectura antes de iniciar?</h4>
                  <p className="text-xs text-slate-400">Consulta los resúmenes de los capítulos o el PDF completo.</p>
                </div>
              </div>
              <button
                onClick={onOpenReading}
                className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                Abrir Lectura
              </button>
            </div>
          </div>

          {/* Student Login Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Identificación del Estudiante
                </h3>
                <p className="text-xs text-slate-400">
                  Ingresa tus datos verídicos para asociar tu intento y calificación.
                </p>
              </div>

              <form onSubmit={handleStartExamAttempt} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nombre Completo <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Laura Victoria Gómez"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Documento de Identidad / Código <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1020304050"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Se utiliza para verificar la política de un único intento.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Correo Institucional (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="estudiante@universidad.edu.co"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Iniciar Evaluación (30 Minutos)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-[11px] text-slate-500 text-center leading-relaxed">
                Al presionar Iniciar, comenzará el conteo regresivo de 30 minutos. Asegúrate de contar con una conexión estable.
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ================= VIEW: ACTIVE EXAM =================
  return (
    <div className="max-w-4xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      
      {/* Exam Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30">
        
        {/* Student info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold text-white leading-tight">
              {studentName}
            </div>
            <div className="text-[11px] text-slate-400">
              ID: {studentId} • Progreso: <strong className="text-amber-400">{answeredTotal}/5</strong>
            </div>
          </div>
        </div>

        {/* Question Pills Navigator */}
        <div className="flex items-center gap-1.5">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 scale-105'
                    : isAnswered
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
                title={`Pregunta ${idx + 1}: ${isAnswered ? 'Respondida' : 'Pendiente'}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Timer & Actions */}
        <div className="flex items-center gap-3">
          {/* Reading helper */}
          <button
            onClick={onOpenReading}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            title="Consultar texto y notas"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Lectura</span>
          </button>

          {/* Timer Display */}
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm tracking-wide ${
              isTimeUrgent
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : isTimeCritical
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-700 text-slate-200'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-amber-400 animate-spin-slow' : 'text-slate-400'}`} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Finish Button */}
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Entregar</span>
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300"
          style={{ width: `${(answeredTotal / 5) * 100}%` }}
        />
      </div>

      {/* Active Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              Pregunta {currentQuestionIndex + 1} de 5
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-medium">
              Dimensión: {currentQ.dimension}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400/90 text-xs font-semibold">
              Valor: 1.0 punto
            </span>
          </div>

          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            {currentQ.chapter} ({currentQ.pagesRef})
          </span>
        </div>

        {/* Question Title & Stem */}
        <div className="space-y-3">
          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-reading">
            {currentQ.text}
          </p>

          {currentQ.quotePrompt && (
            <div className="p-3 rounded-xl bg-slate-950/60 border-l-2 border-amber-500/60 text-xs italic text-amber-200/80 font-reading">
              {currentQ.quotePrompt}
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option) => {
            const isSelected = selectedAnswers[currentQ.id] === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, option.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 scale-105'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {option.id}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed flex-1 pt-0.5">
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation bottom bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentQuestionIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {selectedAnswers[currentQ.id] ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Respuesta guardada
              </span>
            ) : (
              <span className="text-slate-500">Sin responder</span>
            )}
          </span>

          {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(QUIZ_QUESTIONS.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              Concluir y Entregar
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Early Finish Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-title text-xl font-bold text-white">
                ¿Deseas finalizar y entregar tu examen?
              </h3>
              <p className="text-xs text-slate-300">
                Has respondido <strong className="text-amber-300">{answeredTotal} de 5</strong> preguntas.
                {answeredTotal < 5 && (
                  <span className="block text-rose-300 mt-1 font-semibold">
                    Atención: Tienes {5 - answeredTotal} pregunta(s) sin responder todavía.
                  </span>
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 text-left space-y-1">
              <div>• Tiempo restante disponible: <strong className="text-white">{formatTime(remainingSeconds)}</strong></div>
              <div>• Solo dispones de <strong className="text-amber-300">1 intento oficial</strong>. Al confirmar, tu nota quedará registrada en el sistema.</div>
              <div>• A continuación se generará tu reporte y retroalimentación con citas de Hobbes.</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Continuar revisando
              </button>
              <button
                onClick={finalizeExamSubmission}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Sí, entregar ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time up alert */}
      {timeUpWarning && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs flex items-center gap-3 shadow-2xl">
          <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
          <span>Tiempo agotado (30 minutos). Se han enviado automáticamente tus respuestas registradas.</span>
        </div>
      )}

    </div>
  );
};
