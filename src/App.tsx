import { useState } from 'react'
import { BrowseView } from './components/BrowseView'
import { QuizView } from './components/QuizView'
import { ThemeToggle } from './components/ThemeToggle'

type ViewMode = 'browse' | 'quiz'

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('browse')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">한글 Hangul</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
              {(['browse', 'quiz'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                    viewMode === mode
                      ? 'bg-white text-slate-900 shadow dark:bg-slate-600 dark:text-slate-50'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main>{viewMode === 'browse' ? <BrowseView /> : <QuizView />}</main>
      </div>
    </div>
  )
}
