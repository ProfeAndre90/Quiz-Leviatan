import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentPortal } from './components/StudentPortal';
import { FeedbackView } from './components/FeedbackView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ReadingModal } from './components/ReadingModal';
import { StudentSubmission } from './types';
import { getActiveSessions, subscribeToSync } from './services/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<'student' | 'teacher' | 'feedback'>('student');
  const [activeSubmission, setActiveSubmission] = useState<StudentSubmission | null>(null);
  const [isReadingOpen, setIsReadingOpen] = useState(false);
  const [activeStudentsCount, setActiveStudentsCount] = useState(0);

  const updateActiveCount = () => {
    const list = getActiveSessions();
    setActiveStudentsCount(list.length);
  };

  useEffect(() => {
    updateActiveCount();
    const unsubscribe = subscribeToSync(() => {
      updateActiveCount();
    });
    const interval = setInterval(updateActiveCount, 4000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleExamCompleted = (submission: StudentSubmission) => {
    setActiveSubmission(submission);
    setCurrentView('feedback');
    updateActiveCount();
  };

  const handleInspectSubmission = (submission: StudentSubmission) => {
    setActiveSubmission(submission);
    setCurrentView('feedback');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Global Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'student' && !activeSubmission) {
            setCurrentView('student');
          } else if (view === 'student' && activeSubmission) {
            // let them choose to view feedback or portal
            setCurrentView('feedback');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenReading={() => setIsReadingOpen(true)}
        activeCount={activeStudentsCount}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentView === 'student' && (
          <StudentPortal
            onExamCompleted={handleExamCompleted}
            onOpenReading={() => setIsReadingOpen(true)}
            onViewExistingSubmission={(prevSub) => {
              setActiveSubmission(prevSub);
              setCurrentView('feedback');
            }}
          />
        )}

        {currentView === 'feedback' && activeSubmission && (
          <FeedbackView
            submission={activeSubmission}
            onBackToPortal={() => {
              setActiveSubmission(null);
              setCurrentView('student');
            }}
            onOpenReading={() => setIsReadingOpen(true)}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            onOpenReading={() => setIsReadingOpen(true)}
            onInspectSubmission={handleInspectSubmission}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950/90 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Plataforma Académica de Comprensión Lectora • Texto: <em>Leviatán</em> (Thomas Hobbes, 1651)
          </span>
          <span>
            Evaluación calibrada: 5 Preguntas • Escala 0.0 - 5.0 • Tiempo límite: 30:00 min
          </span>
        </div>
      </footer>

      {/* Modal for PDF and Summary Exploration */}
      <ReadingModal
        isOpen={isReadingOpen}
        onClose={() => setIsReadingOpen(false)}
      />

    </div>
  );
}
