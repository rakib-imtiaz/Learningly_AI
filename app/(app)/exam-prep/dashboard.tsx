"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

// Inline SVG icons
const Icon = {
  quiz: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 1 1 3 3v2"/><path d="M12 17h.01"/></svg>
  ),
  cards: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="13" rx="2"/><rect x="11" y="5" width="10" height="16" rx="2"/></svg>
  ),
  meme: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
  ),
  play: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5,3 19,12 5,21"/></svg>
  )
};

// Types
interface Session {
  topic: string;
  progress: number;
  time: string;
}

interface GeneratedContent {
  mode: 'quiz' | 'flashcards' | 'meme';
  topic: string;
  data?: any;
}

// Components
function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${value}%` }} />
    </div>
  );
}

function StartComposer({ onStart, loadingMode }: { onStart: (mode: string, topic: string) => void; loadingMode: string | null }) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"quiz" | "flashcards" | "meme">("quiz");

  const handleStart = () => {
    if (topic.trim()) {
      onStart(mode, topic.trim());
      setTopic("");
    }
  };

  return (
    <div className="rounded-2xl border p-6 bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to study?</h2>
        <p className="text-slate-600">Generate practice materials for any topic</p>
      </div>

      <div className="space-y-4">
        {/* Mode selector */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setMode("quiz")}
            disabled={loadingMode !== null}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              mode === "quiz" 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white hover:bg-slate-50"
            } ${loadingMode !== null ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon.quiz className="h-4 w-4 inline mr-2" />
            Quiz
          </button>
          <button
            onClick={() => setMode("flashcards")}
            disabled={loadingMode !== null}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              mode === "flashcards" 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white hover:bg-slate-50"
            } ${loadingMode !== null ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon.cards className="h-4 w-4 inline mr-2" />
            Flashcards
          </button>
          <button
            onClick={() => setMode("meme")}
            disabled={loadingMode !== null}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              mode === "meme" 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white hover:bg-slate-50"
            } ${loadingMode !== null ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon.meme className="h-4 w-4 inline mr-2" />
            Meme
          </button>
        </div>

        {/* Topic input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., C programming, Data structures, Calculus)"
            className="flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:border-slate-900"
            disabled={loadingMode !== null}
          />
          <button
            onClick={handleStart}
            disabled={!topic.trim() || loadingMode !== null}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMode === mode ? "Generating..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RightRail({ onStart, loadingMode }: { onStart: (mode: string, topic: string) => void; loadingMode: string | null }) {
  const quickTopics = [
    "C Programming",
    "Data Structures", 
    "Algorithms",
    "Calculus",
    "Linear Algebra",
    "Machine Learning"
  ];

  return (
    <div className="space-y-6">
      {/* Quick start */}
      <div className="rounded-2xl border p-4 bg-white">
        <h4 className="font-medium mb-3">Quick start</h4>
        <div className="space-y-2">
          <button
            onClick={() => onStart("quiz", "C Programming")}
            disabled={loadingMode !== null}
            className="w-full text-left px-3 py-2 rounded-xl border hover:bg-slate-50 text-sm disabled:opacity-50"
          >
            Quiz: C Programming
          </button>
          <button
            onClick={() => onStart("flashcards", "Data Structures")}
            disabled={loadingMode !== null}
            className="w-full text-left px-3 py-2 rounded-xl border hover:bg-slate-50 text-sm disabled:opacity-50"
          >
            Flashcards: Data Structures
          </button>
          <button
            onClick={() => onStart("meme", "Pointers")}
            disabled={loadingMode !== null}
            className="w-full text-left px-3 py-2 rounded-xl border hover:bg-slate-50 text-sm disabled:opacity-50"
          >
            Meme: Pointers
          </button>
        </div>
      </div>

      {/* Popular topics */}
      <div className="rounded-2xl border p-4 bg-white">
        <h4 className="font-medium mb-3">Popular topics</h4>
        <div className="flex flex-wrap gap-2">
          {quickTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onStart("quiz", topic)}
              disabled={loadingMode !== null}
              className="px-3 py-1.5 rounded-full border text-xs bg-white hover:bg-slate-50 disabled:opacity-50"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function ExamPrepDashboard() {
  const router = useRouter();
  const [loadingMode, setLoadingMode] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with real data from your backend
  const lastSession: Session = {
    topic: "C Programming",
    progress: 75,
    time: "2 hours ago"
  };

  const recents = ["Pointers", "Arrays", "Functions", "Memory Management"];

  async function postJSON(path: string, payload?: any) {
    const res = await fetch(path, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload || {}) 
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  async function startTask(mode: string, topic: string) {
    try {
      setLoadingMode(mode);
      setError(null);
      
      let data;
      if (mode === 'quiz') {
        data = await postJSON('/api/quiz', { topic, count: 4, difficulty: 'easy' });
      } else if (mode === 'flashcards') {
        data = await postJSON('/api/flashcards', { topic, count: 8, difficulty: 'easy' });
      } else if (mode === 'meme') {
        data = await postJSON('/api/meme', { topic });
      }

      setGenerated({ mode: mode as 'quiz' | 'flashcards' | 'meme', topic, data });
    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoadingMode(null);
    }
  }

  function openFull() {
    if (generated) {
      // Navigate to the exam prep page with the generated content
      const params = new URLSearchParams({
        mode: generated.mode,
        topic: generated.topic
      });
      router.push(`/exam-prep?${params.toString()}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Exam Prep Dashboard</h1>
              <p className="text-slate-600 mt-2">Generate practice materials, track progress, and study smarter</p>
            </div>
            <button 
              onClick={() => router.push('/exam-prep?mode=quiz&topic=C+programming')}
              className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm font-medium"
            >
              Try Interactive Mode
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1) Single clear entry point */}
            <StartComposer onStart={startTask} loadingMode={loadingMode} />

            {/* 2) Continue (one card only) */}
            <Section title="Continue" action={
              <button 
                onClick={() => router.push('/exam-prep?mode=quiz')}
                className="px-3 py-1.5 rounded-full border text-xs hover:bg-slate-50"
              >
                View all
              </button>
            }>
              <div className="rounded-2xl border p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-content-center text-xs font-bold">
                  {lastSession.topic[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{lastSession.topic}</div>
                  <div className="mt-2"><ProgressBar value={lastSession.progress} /></div>
                  <div className="text-xs text-slate-500 mt-1">{lastSession.progress}% • {lastSession.time}</div>
                </div>
                                 <button 
                   onClick={() => router.push(`/exam-prep?mode=quiz&topic=${encodeURIComponent(lastSession.topic)}`)}
                   className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs inline-flex items-center gap-1"
                 >
                   <Icon.play className="h-3.5 w-3.5"/> Resume
                 </button>
              </div>
            </Section>

            {/* 3) Quick picks (lightweight) */}
            <Section title="Quick picks">
              <div className="flex flex-wrap gap-2">
                {recents.map((t) => (
                  <button 
                    key={t} 
                    disabled={loadingMode === 'quiz'} 
                    onClick={() => startTask('quiz', t)} 
                    className="px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-slate-50 disabled:opacity-50"
                  >
                    {t}
                  </button>
                ))}
                <button 
                  disabled={loadingMode === 'meme'} 
                  onClick={() => startTask('meme', 'Dangling pointer')} 
                  className="px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Make a meme: Dangling pointer
                </button>
              </div>
            </Section>

            {/* 4) Freshly generated preview (from backend) */}
            {generated && (
              <Section title="Just generated" action={<button onClick={openFull} className="px-3 py-1.5 rounded-full border text-xs">Open full</button>}>
                {error && <div className="mb-3 text-xs text-rose-600">{error}</div>}
                {generated.mode === 'quiz' && (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600">Topic: <span className="font-medium">{generated.topic}</span></div>
                    <div className="rounded-xl border p-3 bg-white">
                      <div className="text-xs text-slate-500">First question</div>
                      <div className="mt-1 text-sm">{generated.data?.questions?.[0]?.prompt || 'Example: Every C program begins from the main function.'}</div>
                    </div>
                  </div>
                )}
                {generated.mode === 'flashcards' && (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600">Topic: <span className="font-medium">{generated.topic}</span></div>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {(generated.data?.cards || [{front:'Pointer',back:'address var'}, {front:'main()',back:'entry'}, {front:'&',back:'address-of'}]).slice(0,3).map((c, i) => (
                        <div key={i} className="rounded-xl border p-3 text-sm bg-white">{c.front}</div>
                      ))}
                    </div>
                  </div>
                )}
                {generated.mode === 'meme' && (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-600">Topic: <span className="font-medium">{generated.topic}</span></div>
                    <div className="rounded-xl border overflow-hidden">
                      <div className="aspect-[4/3] grid grid-rows-2">
                        <div className="grid place-items-center text-center px-3 bg-gradient-to-br from-indigo-100 to-indigo-300">
                          <span className="font-bold text-lg sm:text-xl drop-shadow">{generated.data?.topText || `${generated.topic} explained`}</span>
                        </div>
                        <div className="grid place-items-center text-center px-3 bg-gradient-to-tr from-rose-100 to-rose-300">
                          <span className="font-bold text-lg sm:text-xl drop-shadow">{generated.data?.bottomText || 'Memory hook: teach it to a friend'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Right rail (only on lg+) */}
          <div className="hidden lg:block lg:col-span-4">
            <RightRail onStart={startTask} loadingMode={loadingMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
