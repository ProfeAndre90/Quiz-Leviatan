import React from 'react';
import { BookOpen, GraduationCap, LayoutDashboard, Shield, Clock } from 'lucide-react';
import { QUIZ_CONFIG } from '../data/quizData';

interface HeaderProps {
  currentView: 'student' | 'teacher' | 'feedback';
  onNavigate: (view: 'student' | 'teacher') => void;
  onOpenReading: () => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenReading,
  activeCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-title font-bold text-white text-base tracking-wide">
                LEVIATÁN
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                Quiz Hobbes
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Comprensión Lectora • 5 Preguntas (5.0 pts) • Límite 30 min
            </p>
          </div>
        </div>

        {/* Navigation Switch & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Reading helper */}
          <button
            onClick={onOpenReading}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Abrir resumen y PDF de Hobbes"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Consultar</span> Lectura
          </button>

          {/* Role Switcher Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onNavigate('student')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'student' || currentView === 'feedback'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Estudiante</span>
            </button>

            <button
              onClick={() => onNavigate('teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative ${
                currentView === 'teacher'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Docente</span>
              {activeCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
