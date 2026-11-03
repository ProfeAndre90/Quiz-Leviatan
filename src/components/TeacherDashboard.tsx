import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlayCircle,
  FileSpreadsheet,
  BookOpen,
  HelpCircle,
  PlusCircle,
  RefreshCw,
  Trash2,
  Sparkles
} from 'lucide-react';
import { StudentSubmission, ActiveStudentSession, CourseMetrics } from '../types';
import { QUIZ_QUESTIONS, QUIZ_CONFIG } from '../data/quizData';
import {
  getSubmissions,
  getActiveSessions,
  computeCourseMetrics,
  resetStudentAttempt,
  resetAllDataToDemo,
  exportSubmissionsToCSV,
  subscribeToSync
} from '../services/storage';

interface TeacherDashboardProps {
  onOpenReading: () => void;
  onInspectSubmission: (submission: StudentSubmission) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenReading,
  onInspectSubmission
}) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveStudentSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aprobado' | 'reprobado'>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'date_desc' | 'name'>('score_desc');
  const [selectedSubmissionForModal, setSelectedSubmissionForModal] = useState<StudentSubmission | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  const refreshData = () => {
    const subs = getSubmissions();
    const actives = getActiveSessions();
    setSubmissions([...subs]);
    setActiveSessions([...actives]);
    setLastSyncTime(new Date().toLocaleTimeString('es-CO'));
  };

  useEffect(() => {
    refreshData();

    // Subscribe to cross-tab updates (real-time updates when student submits or starts!)
    const unsubscribe = subscribeToSync(() => {
      refreshData();
    });

    // Also poll every 3 seconds for active timers
    const interval = setInterval(refreshData, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const metrics: CourseMetrics = computeCourseMetrics(submissions, activeSessions);

  // Filtered & sorted student list
  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'aprobado') return s.score >= 3.0;
    if (statusFilter === 'reprobado') return s.score < 3.0;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'score_desc') return b.score - a.score;
    if (sortBy === 'score_asc') return a.score - b.score;
    if (sortBy === 'date_desc') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
    return 0;
  });

  const handleResetStudent = (studentId: string, name: string) => {
    if (window.confirm(`¿Estás seguro de autorizar un reintento para ${name} (${studentId})? Esto eliminará su intento previo y le permitirá presentar el examen nuevamente.`)) {
      resetStudentAttempt(studentId);
      refreshData();
    }
  };

  const handleExportCSV = () => {
    const csvContent = exportSubmissionsToCSV(submissions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_quiz_hobbes_leviatan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreDemo = () => {
    if (window.confirm('¿Deseas recargar los datos de prueba con estudiantes simulados para evaluar los reportes?')) {
      resetAllDataToDemo();
      refreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-3 sm:px-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Reportes en Tiempo Real
            </span>
            <span className="text-xs text-slate-400">
              Última sincronización: <span className="font-mono text-slate-200">{lastSyncTime || 'En vivo'}</span>
            </span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            Panel Docente: Control de Evaluación y Métricas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitoreo en vivo de alumnos, distribución de notas sobre 5.0, análisis de aciertos por capítulo y gestión de intentos únicos.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenReading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Ver Lectura PDF
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV / Excel
          </button>

          <button
            onClick={handleRestoreDemo}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors flex items-center gap-1.5"
            title="Cargar cohorte de 6 estudiantes muestra para ver estadísticas"
          >
            <RefreshCw className="w-4 h-4" />
            Recargar Datos Muestra
          </button>
        </div>
      </div>

      {/* Live KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Promedio General */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Promedio</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-serif-title">
            {metrics.averageScore.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Escala académica 0.0 - 5.0
          </span>
        </div>

        {/* Tasa de Aprobación */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Aprobación</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-serif-title">
            {metrics.passRate}%
          </div>
          <span className="text-[11px] text-slate-500 block">
            Estudiantes con nota ≥ 3.0
          </span>
        </div>

        {/* Evaluaciones Finalizadas */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Completados</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-serif-title">
            {metrics.totalCompleted}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Intentos registrados
          </span>
        </div>

        {/* Estudiantes En Curso (Live) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1 relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <span>En Curso</span>
            <PlayCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-serif-title">
            {metrics.totalInProgress}
          </div>
          <span className="text-[11px] text-emerald-400/80 block">
            Rindiendo el quiz ahora
          </span>
        </div>

        {/* Tiempo Promedio */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Tiempo Prom.</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-serif-title">
            {Math.floor(metrics.averageTimeSeconds / 60)}m {metrics.averageTimeSeconds % 60}s
          </div>
          <span className="text-[11px] text-slate-500 block">
            Límite: 30 minutos
          </span>
        </div>

        {/* Rango de Notas */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Rango Notas</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-black text-white font-serif-title pt-1">
            {metrics.lowestScore.toFixed(1)} - {metrics.highestScore.toFixed(1)}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Mínima y máxima
          </span>
        </div>

      </div>

      {/* Active Students in Real Time Section */}
      {activeSessions.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Estudiantes Activos en este Momento ({activeSessions.length})
            </h3>
            <span className="text-xs text-slate-400">
              Sincronizado vía canal en vivo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeSessions.map((session) => (
              <div
                key={session.studentId}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{session.studentName}</div>
                  <div className="text-slate-400 text-[11px]">ID: {session.studentId}</div>
                  <div className="text-amber-400 mt-1 font-medium">
                    Pregunta actual: #{session.currentQuestion} ({session.answeredCount}/5 respondidas)
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-slate-800 font-mono text-emerald-400 font-bold block">
                    {Math.floor(session.remainingSeconds / 60)}:{Math.floor(session.remainingSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">restantes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Accuracy Diagnostics */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-serif-title text-lg font-bold text-white">
              Análisis Pedagógico por Pregunta (Tasa de Acierto y Errores)
            </h3>
            <p className="text-xs text-slate-400">
              Identifica los conceptos de Thomas Hobbes que presentaron mayor dificultad en el grupo.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
            5 Preguntas Clave
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {QUIZ_QUESTIONS.map((q) => {
            const acc = metrics.questionAccuracy[q.id];
            const pct = acc ? acc.accuracyPercentage : 0;
            const isHigh = pct >= 75;
            const isLow = pct < 50;

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-400">Pregunta {q.questionNumber}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{q.dimension}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                    {q.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {q.chapter}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tasa de Acierto:</span>
                    <span
                      className={`font-bold font-mono ${
                        isHigh ? 'text-emerald-400' : isLow ? 'text-rose-400' : 'text-amber-300'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isHigh ? 'bg-emerald-400' : isLow ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {acc?.commonMistakeOption && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      Distractor frecuente: <strong className="text-rose-300">Opción {acc.commonMistakeOption.toUpperCase()}</strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student List & Submissions Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        
        {/* Table Filters & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por estudiante o identificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Todos ({submissions.length})
              </button>
              <button
                onClick={() => setStatusFilter('aprobado')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === 'aprobado' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                Aprobados (≥ 3.0)
              </button>
              <button
                onClick={() => setStatusFilter('reprobado')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === 'reprobado' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
                }`}
              >
                Reprobados (&lt; 3.0)
              </button>
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="score_desc">Mayor Nota (5.0 → 0.0)</option>
              <option value="score_asc">Menor Nota (0.0 → 5.0)</option>
              <option value="date_desc">Más recientes primero</option>
              <option value="name">Alfabético Nombre</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Estudiante / Identificación</th>
                <th className="py-3 px-4 text-center">Nota (sobre 5.0)</th>
                <th className="py-3 px-4 text-center">Desempeño</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Tiempo</th>
                <th className="py-3 px-4 text-center">Respuestas (P1 - P5)</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No se encontraron evaluaciones con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isPass = sub.score >= 3.0;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{sub.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {sub.studentId}</div>
                        {sub.email && <div className="text-[10px] text-slate-500">{sub.email}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-base font-black font-serif-title ${
                          sub.score >= 4.0 ? 'text-amber-300' : sub.score >= 3.0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {sub.score.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/ 5.0</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-200">
                          {sub.performanceLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPass
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isPass ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400">
                        {Math.floor(sub.timeTakenSeconds / 60)}m {sub.timeTakenSeconds % 60}s
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {QUIZ_QUESTIONS.map(q => {
                            const isCorrect = sub.answers[q.id] === q.correctOptionId;
                            return (
                              <span
                                key={q.id}
                                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono ${
                                  isCorrect
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                                title={`P${q.id}: ${sub.answers[q.id]?.toUpperCase() || '-'} (${isCorrect ? 'Correcta' : 'Incorrecta'})`}
                              >
                                {sub.answers[q.id]?.toUpperCase() || '-'}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSubmissionForModal(sub)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Ver retroalimentación completa de este estudiante"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleResetStudent(sub.studentId, sub.studentName)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                            title="Autorizar nuevo intento (eliminar bloqueo)"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Mostrando {filteredSubmissions.length} de {submissions.length} evaluaciones
          </span>
          <span>
            * Las notas se calculan en escala de 0.0 a 5.0 (1.0 punto por pregunta acertada).
          </span>
        </div>
      </div>

      {/* Modal to view single student's answers & diagnostic */}
      {selectedSubmissionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Detalle del Examen: {selectedSubmissionForModal.studentName}
                </h3>
                <p className="text-xs text-slate-400">
                  ID: {selectedSubmissionForModal.studentId} • Nota:{' '}
                  <strong className="text-amber-300 text-sm font-bold font-serif-title">
                    {selectedSubmissionForModal.score.toFixed(1)} / 5.0
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionForModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {QUIZ_QUESTIONS.map(q => {
                const ans = selectedSubmissionForModal.answers[q.id];
                const isCorrect = ans === q.correctOptionId;
                const selectedOpt = q.options.find(o => o.id === ans);
                const correctOpt = q.options.find(o => o.id === q.correctOptionId);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect ? 'bg-slate-950/60 border-emerald-500/30' : 'bg-slate-950/60 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-amber-300">Pregunta {q.questionNumber}: {q.title}</span>
                      <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                        {isCorrect ? '1.0 pt (Correcta)' : '0.0 pts (Incorrecta)'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3">{q.text}</p>

                    <div className="text-xs space-y-1.5 p-3 rounded-xl bg-slate-900">
                      <div>
                        <span className="text-slate-400">Opción elegida por el alumno:</span>{' '}
                        <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                          ({ans?.toUpperCase() || 'Sin responder'}) {selectedOpt?.text || 'No contestó'}
                        </strong>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="text-slate-400">Respuesta correcta según Hobbes:</span>{' '}
                          <strong className="text-emerald-300">
                            ({q.correctOptionId.toUpperCase()}) {correctOpt?.text}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <button
                onClick={() => {
                  handleResetStudent(selectedSubmissionForModal.studentId, selectedSubmissionForModal.studentName);
                  setSelectedSubmissionForModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Desbloquear e Iniciar Nuevo Intento
              </button>

              <button
                onClick={() => setSelectedSubmissionForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
