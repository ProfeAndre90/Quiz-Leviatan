import React, { useRef } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Printer,
  BookOpen,
  ArrowLeft,
  Share2,
  Check,
  AlertCircle
} from 'lucide-react';
import { StudentSubmission } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';

interface FeedbackViewProps {
  submission: StudentSubmission;
  onBackToPortal: () => void;
  onOpenReading: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  submission,
  onBackToPortal,
  onOpenReading
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 4.6) return 'from-emerald-500 to-teal-500 text-slate-950';
    if (score >= 4.0) return 'from-teal-500 to-cyan-500 text-slate-950';
    if (score >= 3.0) return 'from-amber-500 to-yellow-500 text-slate-950';
    return 'from-rose-500 to-red-600 text-white';
  };

  const isPassed = submission.score >= 3.0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-3 sm:px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Top action nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Consultar Lectura
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Comprobante Oficial
          </button>
        </div>
      </div>

      {/* Main Score & Diagnostic Card */}
      <div
        ref={printRef}
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Award className="w-4 h-4" />
              Reporte Oficial de Retroalimentación
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              {submission.studentName}
            </h1>
            <p className="text-xs text-slate-400">
              Identificación / Código: <strong className="text-slate-200">{submission.studentId}</strong> •
              Completado el: <span className="text-slate-200">{new Date(submission.submittedAt).toLocaleString('es-CO')}</span>
            </p>
          </div>

          {/* Grade Big Badge */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Calificación Final (0.0 - 5.0)
            </div>
            <div
              className={`px-6 py-3.5 rounded-2xl bg-gradient-to-br font-serif-title text-4xl sm:text-5xl font-black shadow-xl ${getScoreBadgeColor(
                submission.score
              )}`}
            >
              {submission.score.toFixed(1)} <span className="text-2xl font-bold opacity-80">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
              {isPassed ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> APROBADO (Nivel {submission.performanceLevel})
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> REPROBADO (Nivel {submission.performanceLevel})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Narrative */}
        <div className="py-6 border-b border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Diagnóstico Pedagógico y Nivel de Comprensión
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed font-reading">
            {submission.score === 5.0 && (
              <>
                ¡Excelente desempeño! Has obtenido un <strong>puntaje perfecto (5.0 / 5.0)</strong>, demostrando un dominio cabal tanto de las nociones directas de Thomas Hobbes (las 3 causas de discordia en el estado de naturaleza) como de las deducciones conceptuales más complejas (el carácter artificial y no sinalagmático del pacto con el soberano, la distinción entre <em>ius</em> y <em>lex</em>, y el principio supremo de inalienabilidad de la autodefensa corporal).
              </>
            )}
            {submission.score >= 4.0 && submission.score < 5.0 && (
              <>
                <strong>Desempeño Alto (4.0 / 5.0)</strong>. Has comprendido con solidez los pilares del pensamiento político de Hobbes en el <em>Leviatán</em>. Para perfeccionar tu análisis, revisa detalladamente la justificación de la pregunta que no alcanzaste a acertar en la sección inferior.
              </>
            )}
            {submission.score >= 3.0 && submission.score < 4.0 && (
              <>
                <strong>Desempeño Básico / Aprobado (3.0 / 5.0)</strong>. Demuestras comprensión de los puntos clave del texto, pero presentas dudas en la diferenciación teórica estricta (por ejemplo, entre la ley natural y el derecho natural, o entre la condición jurídica del súbdito frente al soberano). Te recomendamos volver a repasar los capítulos XIV y XVII.
              </>
            )}
            {submission.score < 3.0 && (
              <>
                <strong>Desempeño Bajo ({submission.score.toFixed(1)} / 5.0)</strong>. Tu resultado no alcanza el umbral de aprobación requerido (3.0). Se observa confusión en conceptos fundamentales como las condiciones de la justicia en el estado de guerra y los términos del pacto de institución. Lee nuevamente con detenimiento los Capítulos XIII, XIV, XVII y XXI en el visor de lectura.
              </>
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Aciertos</span>
              <span className="text-base font-bold text-emerald-400">{Math.round(submission.score)} / 5</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Efectividad</span>
              <span className="text-base font-bold text-white">{submission.percentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Tiempo Empleado</span>
              <span className="text-base font-bold text-amber-300">
                {Math.floor(submission.timeTakenSeconds / 60)}m {submission.timeTakenSeconds % 60}s
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase block">Tiempo Máximo</span>
              <span className="text-base font-bold text-slate-400">30:00 min</span>
            </div>
          </div>
        </div>

        {/* Cognitive Dimension Breakdown Cards */}
        <div className="pt-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Desglose por Dimensiones Cognitivas de Comprensión
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { dim: 'Literal', qId: 1, label: 'Causas de Discordia', correct: submission.answers[1] === 'a' },
              { dim: 'Inferencial', qId: 2, label: 'Justicia y Propiedad', correct: submission.answers[2] === 'b' },
              { dim: 'Conceptual', qId: 3, label: 'Ius vs. Lex', correct: submission.answers[3] === 'a' },
              { dim: 'Estructural', qId: 4, label: 'Fórmula del Pacto', correct: submission.answers[4] === 'b' },
              { dim: 'Crítica', qId: 5, label: 'Límites de Sumisión', correct: submission.answers[5] === 'c' }
            ].map(item => (
              <div
                key={item.dim}
                className={`p-3 rounded-xl border text-center transition-all ${
                  item.correct
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase mb-1">
                  {item.correct ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {item.dim}
                </div>
                <div className="text-xs font-medium text-white truncate">{item.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{item.correct ? '1.0 / 1.0 pt' : '0.0 / 1.0 pt'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question-by-Question Detailed Feedback */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-white">
            Revisión Exhaustiva Pregunta a Pregunta
          </h2>
          <span className="text-xs text-slate-400">
            5 preguntas evaluadas con citas textuales de Hobbes
          </span>
        </div>

        {QUIZ_QUESTIONS.map((q, idx) => {
          const studentSelection = submission.answers[q.id];
          const isCorrect = studentSelection === q.correctOptionId;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                isCorrect
                  ? 'bg-slate-900/90 border-slate-800 shadow-xl'
                  : 'bg-slate-900/90 border-rose-500/30 shadow-xl'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {q.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                    {q.dimension}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {q.chapter} ({q.pagesRef})
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isCorrect ? '+1.0 punto' : '0.0 puntos'}
                  </span>
                </div>
              </div>

              {/* Question text */}
              <p className="text-sm text-slate-200 font-reading leading-relaxed mb-5">
                {q.text}
              </p>

              {/* Options breakdown */}
              <div className="space-y-2.5 mb-5">
                {q.options.map((opt) => {
                  const isThisSelected = studentSelection === opt.id;
                  const isThisCorrect = q.correctOptionId === opt.id;

                  let cardStyle = 'bg-slate-950/40 border-slate-800 text-slate-400';
                  if (isThisCorrect) {
                    cardStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-100 ring-1 ring-emerald-500/30';
                  } else if (isThisSelected && !isThisCorrect) {
                    cardStyle = 'bg-rose-950/30 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/30';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed flex items-start gap-3 ${cardStyle}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg text-xs font-bold uppercase flex items-center justify-center shrink-0 ${
                          isThisCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : isThisSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.id}
                      </div>

                      <div className="flex-1">
                        <span>{opt.text}</span>
                        {isThisSelected && !isThisCorrect && (
                          <div className="text-[11px] font-bold text-rose-400 mt-1 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Tu respuesta elegida (Incorrecta)
                          </div>
                        )}
                        {isThisCorrect && (
                          <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Respuesta Correcta
                            {isThisSelected && ' (¡Acertaste!)'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hobbes textual quote & explanation */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Cita Textual del Leviatán (Hobbes):
                </div>
                <blockquote className="text-xs sm:text-sm italic font-reading text-amber-100/90 leading-relaxed pl-3 border-l-2 border-amber-500">
                  {q.hobbesQuote}
                </blockquote>
                <div className="pt-2 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Fundamento Teórico:</strong> {q.explanation}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Official Certificate Footer */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
        <p>
          Certificado de evaluación generado por la plataforma interactiva de comprensión lectora.
        </p>
        <p className="font-mono text-[11px] text-slate-500">
          ID de Transacción: {submission.id} • Hash de Validación: 0x{submission.studentId}HOBBES{submission.score * 10}
        </p>
      </div>

    </div>
  );
};
