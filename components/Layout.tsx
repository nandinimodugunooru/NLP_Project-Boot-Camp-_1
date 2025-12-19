
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar for Desktop */}
      {sidebar && (
        <aside className="hidden md:flex flex-col w-80 border-r bg-white sticky top-0 h-screen">
          <div className="p-6 border-b flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-800">LingoFix</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {sidebar}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 md:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <h1 className="font-bold text-slate-800">LingoFix</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-700">Improve your communication</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://picsum.photos/32/32?random=1" alt="User 1" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://picsum.photos/32/32?random=2" alt="User 2" />
            </div>
            <span className="text-sm font-medium text-slate-500">2.4k users online</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
