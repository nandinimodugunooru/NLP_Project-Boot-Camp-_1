
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { GeminiService } from '../services/geminiService';

interface CorrectionViewProps {
  item: HistoryItem;
}

export const CorrectionView: React.FC<CorrectionViewProps> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCtx] = useState(() => new (window.AudioContext || (window as any).webkitAudioContext)());

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const audioBytes = await GeminiService.generateSpeech(item.correctedSentence);
      await GeminiService.playAudio(audioBytes as any, audioCtx);
    } catch (error) {
      console.error("Speech error", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* English Correction Card */}
      <section className="bg-white rounded-2xl p-6 border shadow-sm border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">English Correction</h3>
          <button 
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-spinner fa-spin' : 'fa-volume-high'}`}></i>
            {isPlaying ? 'Synthesizing...' : 'Listen'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-500">
             &quot;{item.originalSentence}&quot;
          </div>
          
          <div className="flex items-center justify-center py-2">
            <div className="h-8 w-px bg-slate-200"></div>
          </div>

          <div className="p-5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 font-medium text-lg leading-relaxed">
            {item.correctedSentence}
          </div>
        </div>

        {item.corrections.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-bold text-slate-700 mb-3">What we fixed:</h4>
            <div className="space-y-3">
              {item.corrections.map((c, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                  <div>
                    <span className="line-through text-slate-400 mr-2">{c.original}</span>
                    <span className="font-semibold text-green-600">{c.fixed}</span>
                    <p className="text-slate-500 mt-1">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Translations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Telugu */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">తె</div>
            <h3 className="font-bold text-slate-800">Telugu Meaning</h3>
          </div>
          <p className="text-slate-700 leading-relaxed text-lg font-medium">
            {item.translations.telugu}
          </p>
        </div>

        {/* Hindi */}
        <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">हिं</div>
            <h3 className="font-bold text-slate-800">Hindi Meaning</h3>
          </div>
          <p className="text-slate-700 leading-relaxed text-lg font-medium">
            {item.translations.hindi}
          </p>
        </div>
      </div>

      {/* Explanation Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
        <div className="text-blue-500 flex-shrink-0">
          <i className="fa-solid fa-circle-info text-xl"></i>
        </div>
        <div>
          <h4 className="text-blue-800 font-bold text-sm mb-1">Language Tip</h4>
          <p className="text-blue-700 text-sm leading-relaxed">{item.explanation}</p>
        </div>
      </div>
    </div>
  );
};
