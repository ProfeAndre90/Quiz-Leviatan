import React, { useState } from 'react';
import { X, BookOpen, Search, ExternalLink, FileText, ChevronRight, Bookmark } from 'lucide-react';
import { READING_CHAPTERS } from '../data/readingSummary';
import { QUIZ_CONFIG } from '../data/quizData';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingModal: React.FC<ReadingModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'guia' | 'pdf'>('guia');
  const [selectedChapter, setSelectedChapter] = useState(0);

  if (!isOpen) return null;

  const filteredChapters = READING_CHAPTERS.filter(ch =>
    ch.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ch.coreConcepts.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title text-lg sm:text-xl font-bold text-amber-200">
                Thomas Hobbes: Leviatán
              </h2>
              <p className="text-xs text-slate-400">
                Texto de consulta y guía temática de comprensión lectora (Capítulos I - XXXI)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setActiveTab('guia')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'guia'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Guía y Pasajes Clave
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Visor PDF Original
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'guia' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Chapter Navigator */}
            <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/40">
              <div className="p-3 border-b border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar tema, concepto o capítulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredChapters.map((ch, idx) => {
                  const isSelected = READING_CHAPTERS.indexOf(ch) === selectedChapter;
                  return (
                    <button
                      key={ch.chapter}
                      onClick={() => setSelectedChapter(READING_CHAPTERS.indexOf(ch))}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                          : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                          {ch.chapter}
                        </span>
                        <h4 className="text-xs font-semibold leading-snug line-clamp-2">
                          {ch.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {ch.pages}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chapter Detail View */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 space-y-6">
              {READING_CHAPTERS[selectedChapter] && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                      <Bookmark className="w-3.5 h-3.5" />
                      {READING_CHAPTERS[selectedChapter].chapter} • {READING_CHAPTERS[selectedChapter].pages}
                    </div>
                    <h3 className="font-serif-title text-2xl font-bold text-slate-100">
                      {READING_CHAPTERS[selectedChapter].title}
                    </h3>
                  </div>

                  {/* Core Concepts */}
                  <div>
                    <h5 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-2">
                      Conceptos Clave de la Filosofía Hobbesiana
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {READING_CHAPTERS[selectedChapter].coreConcepts.map((concept, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Synthetic Summary */}
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                    <h5 className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-2">
                      Síntesis Doctrinal
                    </h5>
                    <p className="text-sm text-slate-300 leading-relaxed font-reading">
                      {READING_CHAPTERS[selectedChapter].summary}
                    </p>
                  </div>

                  {/* Textual Citations from Hobbes */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      Pasajes Textuales Destacados de Thomas Hobbes
                    </h5>
                    {READING_CHAPTERS[selectedChapter].keyPassages.map((passage, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-amber-950/20 border-l-4 border-amber-500 text-amber-100/90 text-sm italic font-reading leading-relaxed"
                      >
                        {passage}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Fuente: Leviatán, Edición Freeditorial (Copia de estudio académico)
                    </span>
                    <button
                      onClick={() => setActiveTab('pdf')}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Consultar PDF íntegro <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PDF Viewer Tab */
          <div className="flex-1 flex flex-col bg-slate-950">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Documento adjunto: <strong className="text-white">Thomas Hobbes - Leviatán.pdf</strong>
              </span>
              <a
                href={QUIZ_CONFIG.pdfLocalPath}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md flex items-center gap-1 transition-colors"
              >
                Abrir en nueva pestaña <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex-1 relative">
              <iframe
                src={`${QUIZ_CONFIG.pdfLocalPath}#toolbar=1&navpanes=1`}
                className="w-full h-full border-0"
                title="Lectura Leviatán Thomas Hobbes"
              />
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>
            Lectura obligatoria para responder con éxito las 5 preguntas del quiz.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            Volver al cuestionario
          </button>
        </div>

      </div>
    </div>
  );
};
