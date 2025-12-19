
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CorrectionView } from './components/CorrectionView';
import { GeminiService } from './services/geminiService';
import { HistoryItem } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lingofix_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) setActiveItem(parsed[0]);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('lingofix_history', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await GeminiService.correctAndTranslate(inputText);
      const newItem: HistoryItem = {
        ...result,
        id: crypto.randomUUID(),
        originalSentence: inputText,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50
      setActiveItem(newItem);
      setInputText('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const SidebarContent = (
    <div className="space-y-1">
      <div className="px-2 py-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Recent Corrections</h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 italic px-2">No history yet.</p>
        ) : (
          history.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all group ${
                activeItem?.id === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activeItem?.id === item.id ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-400'}`}></div>
                <span className="truncate flex-1 text-sm">{item.originalSentence}</span>
              </div>
            </button>
          ))
        )}
      </div>
      
      {history.length > 0 && (
        <button 
          onClick={() => { setHistory([]); setActiveItem(null); }}
          className="w-full mt-4 text-xs font-semibold text-red-500 hover:text-red-600 p-2 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-trash-can"></i> Clear History
        </button>
      )}
    </div>
  );

  return (
    <Layout sidebar={SidebarContent}>
      <div className="space-y-8 pb-20">
        {/* Intro section */}
        <section className="text-center max-w-2xl mx-auto py-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Master English with <span className="gradient-text">Context</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Paste any sentence to get instant corrections, detailed grammar rules, and translations in Telugu and Hindi.
          </p>
        </section>

        {/* Input Area */}
        <section className="bg-white rounded-3xl p-2 md:p-3 border shadow-2xl shadow-indigo-100/50 sticky top-20 z-20">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="How to improve my communication?"
                className="w-full py-4 pl-6 pr-12 text-lg bg-transparent border-none focus:ring-0 placeholder:text-slate-300 text-slate-700"
              />
              <div className="absolute left-0 bottom-0 h-0.5 bg-indigo-500 transition-all duration-300" style={{ width: inputText ? '100%' : '0%' }}></div>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fa-solid fa-paper-plane"></i>
              )}
              <span className="hidden sm:inline">{isLoading ? 'Processing' : 'Correct'}</span>
            </button>
          </form>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
            <i className="fa-solid fa-circle-exclamation text-xl"></i>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results / Active View */}
        {activeItem ? (
          <div key={activeItem.id}>
            <CorrectionView item={activeItem} />
          </div>
        ) : !isLoading && (
          <div className="text-center py-20 opacity-40">
            <div className="text-6xl mb-6 text-slate-300">
              <i className="fa-solid fa-keyboard"></i>
            </div>
            <p className="text-slate-500 font-medium">Type something above to get started!</p>
          </div>
        )}

        {isLoading && !activeItem && (
          <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-slate-200 rounded-2xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-slate-100 rounded-2xl"></div>
              <div className="h-32 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
