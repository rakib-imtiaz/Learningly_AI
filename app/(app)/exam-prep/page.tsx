"use client"

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ExamPrepDashboard from "./dashboard";

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
  send: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  shuffle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20 20 4"/><path d="M21 16v5h-5"/><path d="M15 15 21 21"/></svg>
  )
};

// -------------------- Types --------------------
interface QuizQuestion {
  id: string;
  type: "fill" | "single";
  prompt: string;
  answer: string;
  choices?: string[];
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

interface Flashcard {
  front: string;
  back: string;
}

interface MemeIdea {
  top: string;
  bottom: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// -------------------- Helpers --------------------
function classNames(...s: (string | boolean | undefined | null)[]): string { 
  return s.filter(Boolean).join(" "); 
}

function routeIntent(text: string) {
  const t = text.toLowerCase();
  if (/(flash|cards|flashcards)/.test(t)) return { action: "flashcards" };
  if (/(quiz|test|exam)/.test(t)) return { action: "quiz" };
  if (/(meme|joke)/.test(t)) return { action: "meme" };
  return { action: "chat" };
}

async function postJSON(path: string, payload?: Record<string, unknown>) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload || {}) });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// -------------------- Mock Data (fallbacks) --------------------
const FALLBACK_QUIZ: Quiz = {
  title: "C Programming — Quick Check",
  questions: [
    { id: "q1", type: "fill", prompt: "Every C program begins execution from the ________ function.", answer: "main" },
    { id: "q2", type: "single", prompt: "Which type stores whole numbers?", choices: ["float", "double", "int", "char"], answer: "int" },
    { id: "q3", type: "single", prompt: "Which operator gets the address of a variable?", choices: ["*", "&", "->", "%"], answer: "&" },
    { id: "q4", type: "fill", prompt: "The operator used to dereference a pointer is ________.", answer: "*" },
  ],
};

const FALLBACK_CARDS: Flashcard[] = [
  { front: "Pointer", back: "A variable that stores a memory address." },
  { front: "main()", back: "The entry point function of a C program." },
  { front: "& (address-of)", back: "Returns the address of a variable." },
  { front: "* (dereference)", back: "Accesses the value at a memory address." },
  { front: "Stack vs Heap", back: "Automatic vs dynamic memory regions." },
];

// -------------------- Quiz --------------------
function Quiz({ topic }: { topic: string }) {
  const [quiz, setQuiz] = useState<Quiz>(FALLBACK_QUIZ);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const q = quiz.questions[idx];

  function normalize(s: unknown): string { return (s||"").toString().trim().toLowerCase(); }

  async function generateWithAI() {
    try {
      setLoading(true);
      const data = await postJSON('/api/quiz', { topic, count: 4, difficulty: 'easy' });
      if (data?.questions?.length) {
        setQuiz({ title: `${topic} — Quick Check`, questions: data.questions });
        setIdx(0); setAnswer(""); setScore(0); setDone(false);
      }
    } catch (e) {
      console.error(e);
      alert('Using fallback quiz. (API not reachable)');
      setQuiz(FALLBACK_QUIZ);
    } finally { setLoading(false); }
  }

  function submit() {
    if (!q) return;
    const ok = q.type === "fill" ? normalize(answer) === normalize(q.answer) : answer === q.answer;
    if (ok) setScore((s) => s + 1);
    if (idx + 1 >= quiz.questions.length) { setDone(true); }
    else { setIdx(idx + 1); setAnswer(""); }
  }

  if (done) {
    return (
      <div className="rounded-2xl border p-5 bg-white">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-lg font-semibold">Great job!</div>
            <div className="text-slate-700 mt-1">Your score: <span className="font-semibold">{score} / {quiz.questions.length}</span></div>
          </div>
          <button onClick={generateWithAI} disabled={loading} className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm">{loading ? 'Generating…' : 'New quiz with AI'}</button>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => { setIdx(0); setAnswer(""); setScore(0); setDone(false); }} className="px-3 py-2 rounded-xl border">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-500">Question {idx + 1} / {quiz.questions.length}</div>
        <button onClick={generateWithAI} disabled={loading} className="px-3 py-1.5 rounded-xl border bg-white hover:bg-slate-50 text-xs">{loading ? 'Generating…' : 'Generate with AI'}</button>
      </div>
      <div className="text-slate-900 text-base mb-4">{q.prompt}</div>

      {q.type === "fill" ? (
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
          className="w-full sm:w-80 border-b border-slate-300 focus:border-slate-900 outline-none bg-transparent py-1"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-2">
          {q.choices?.map((c) => (
            <label key={c} className={classNames(
              "cursor-pointer rounded-xl border px-3 py-2 text-sm",
              answer === c ? "border-slate-900 bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
            )}>
              <input type="radio" name="choice" value={c} className="hidden" onChange={() => setAnswer(c)} />
              {c}
            </label>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <button onClick={submit} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white">
          <Icon.check className="h-4 w-4"/> Submit
        </button>
        <button onClick={() => setAnswer("")} className="px-3 py-2 rounded-xl border">Clear</button>
      </div>
    </div>
  );
}

// -------------------- Flashcards --------------------
function Flashcards({ topic }: { topic: string }) {
  const [cards, setCards] = useState<Flashcard[]>(FALLBACK_CARDS);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [loading, setLoading] = useState(false);

  const c = cards[i];

  async function generateWithAI() {
    try {
      setLoading(true);
      const data = await postJSON('/api/flashcards', { topic, count: 8, difficulty: 'easy' });
      if (data?.cards?.length) {
        setCards(data.cards);
        setI(0); setFlipped(false); setKnown(0);
      }
    } catch (e) {
      console.error(e);
      alert('Using fallback flashcards. (API not reachable)');
      setCards(FALLBACK_CARDS);
    } finally { setLoading(false); }
  }

  function next(knownIt: boolean) {
    if (knownIt) setKnown((k) => k + 1);
    setFlipped(false);
    setI((x) => (x + 1) % cards.length);
  }
  function prev() { setFlipped(false); setI((x) => (x - 1 + cards.length) % cards.length); }
  function shuffle() { setCards((arr) => [...arr].sort(() => Math.random() - 0.5)); setI(0); setFlipped(false); }

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
        <div>Card {i + 1} / {cards.length}</div>
        <div className="flex items-center gap-2">
          <span>Known: <span className="font-medium">{known}</span></span>
          <button onClick={generateWithAI} disabled={loading} className="px-3 py-1.5 rounded-xl border bg-white hover:bg-slate-50 text-xs">{loading ? 'Generating…' : 'Generate with AI'}</button>
        </div>
      </div>

      <button onClick={() => setFlipped(!flipped)} className="w-full h-40 sm:h-48 rounded-2xl border grid place-content-center text-center text-lg font-semibold bg-gradient-to-br from-slate-50 to-white hover:shadow">
        {flipped ? c.back : c.front}
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={prev} className="px-3 py-2 rounded-xl border"><span className="mr-1">←</span>Prev</button>
        <button onClick={() => next(false)} className="px-3 py-2 rounded-xl border">Skip</button>
        <button onClick={() => next(true)} className="px-3 py-2 rounded-xl bg-slate-900 text-white inline-flex items-center gap-2"><Icon.check className="h-4 w-4"/> I knew this</button>
        <button onClick={shuffle} className="px-3 py-2 rounded-xl border inline-flex items-center gap-2"><Icon.shuffle className="h-4 w-4"/> Shuffle</button>
      </div>
    </div>
  );
}

// -------------------- Meme (Topic-first) --------------------
function Meme({ topic, setTopic }: { topic: string; setTopic: (topic: string) => void }) {
  const [idea, setIdea] = useState<MemeIdea | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) return;
    try {
      setLoading(true);
      const data = await postJSON('/api/meme', { topic });
      if (data?.topText && data?.bottomText) {
        setIdea({ top: data.topText, bottom: data.bottomText });
      } else {
        throw new Error('Bad meme payload');
      }
    } catch (e) {
      console.error(e);
      // Fallback: simple local idea
      setIdea({ top: `${topic} explained`, bottom: `Memory hook: teach it to a friend` });
    } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <div className="text-sm text-slate-600 mb-3">Enter a topic and I&apos;ll generate a meme-style caption to help you memorize it.</div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Pointers, Loops, Memory management" className="flex-1 rounded-xl border px-3 py-2"/>
        <button onClick={generate} disabled={loading} className="px-4 py-2 rounded-xl bg-slate-900 text-white">{loading ? 'Generating…' : 'Generate'}</button>
      </div>

      {idea ? (
        <div className="rounded-2xl border overflow-hidden">
          <div className="aspect-[4/3] grid grid-rows-2">
            <div className={classNames("grid place-items-center text-center px-3", "bg-gradient-to-br", "from-indigo-100 to-indigo-300")}> 
              <span className="font-bold text-lg sm:text-xl drop-shadow">{idea.top}</span>
            </div>
            <div className={classNames("grid place-items-center text-center px-3", "bg-gradient-to-tr", "from-rose-100 to-rose-300")}>
              <span className="font-bold text-lg sm:text-xl drop-shadow">{idea.bottom}</span>
            </div>
          </div>
          <div className="p-3 flex gap-2 border-t">
            <button onClick={generate} disabled={loading} className="px-3 py-2 rounded-xl border">{loading ? '…' : 'New idea'}</button>
            <button onClick={() => setIdea(null)} className="px-3 py-2 rounded-xl border">Change topic</button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-5 text-sm text-slate-500">No meme yet—enter a topic above.</div>
      )}
    </div>
  );
}

function ExamPrepPageContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const topicParam = searchParams.get('topic');

  // If we have mode/topic params, show interactive view
  const showInteractive = !!(modeParam || topicParam);

  if (showInteractive) {
    return <ExamPrepInteractive />;
  }

  // Default to dashboard view
  return <ExamPrepDashboard />;
}

export default function ExamPrepPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamPrepPageContent />
    </Suspense>
  );
}

// Interactive component (renamed from the original)
function ExamPrepInteractive() {
  const [mode, setMode] = useState<"quiz" | "flashcards" | "meme">("quiz");
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("C programming basics");
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "assistant", content: "Welcome to Exam Prep! Pick a mode below or type what you want (e.g., 'quiz me on C basics')." },
  ]);

  // Handle URL query parameters for dashboard navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get('mode') as "quiz" | "flashcards" | "meme" | null;
      const topicParam = urlParams.get('topic');
      
      if (modeParam && ['quiz', 'flashcards', 'meme'].includes(modeParam)) {
        setMode(modeParam);
      }
      
      if (topicParam) {
        setTopic(topicParam);
        // Add a welcome message for the specific topic
        setChat([{ 
          role: "assistant", 
          content: `Welcome to ${modeParam || 'Exam Prep'}! Ready to study ${topicParam}?` 
        }]);
      }
    }
  }, []);

  function onSend() {
    if (!input.trim()) return;
    const u: ChatMessage = { role: "user", content: input };
    setChat((c) => [...c, u]);
    const r = routeIntent(input);
    if (r.action === "chat") {
      setChat((c) => [...c, { role: "assistant", content: "I can make a quiz, flashcards, or a meme. What would you like?" }]);
    } else {
      setMode(r.action as "quiz" | "flashcards" | "meme");
      if (r.action === 'meme') {
        const m = input.split(/meme/i)[1]?.replace(/about/i,'').trim();
        if (m) setTopic(m);
      }
      setChat((c) => [...c, { role: "assistant", content: `Switching to ${r.action} mode.` }]);
    }
    setInput("");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Header */}
      <div className="h-14 bg-white border-b flex items-center justify-between px-4">
        <div className="font-semibold">Exam Prep</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = '/exam-prep'} 
            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50"
          >
            ← Back to Dashboard
          </button>
          <div className="text-xs text-slate-500">Now wired to /api (OpenAI-backed). Fallbacks if offline.</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-5 space-y-5">
        {/* Mode selector */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setMode("quiz")} className={classNames("flex items-center gap-2 px-3 py-2 rounded-xl border", mode === 'quiz' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50')}><Icon.quiz className="h-4 w-4"/> <span className="text-sm">Quiz</span></button>
          <button onClick={() => setMode("flashcards")} className={classNames("flex items-center gap-2 px-3 py-2 rounded-xl border", mode === 'flashcards' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50')}><Icon.cards className="h-4 w-4"/> <span className="text-sm">Flashcards</span></button>
          <button onClick={() => setMode("meme")} className={classNames("flex items-center gap-2 px-3 py-2 rounded-xl border", mode === 'meme' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50')}><Icon.meme className="h-4 w-4"/> <span className="text-sm">Make meme</span></button>
        </div>

        {/* Shared topic input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic for this session (e.g., Pointers)" className="flex-1 rounded-xl border px-3 py-2"/>
          <div className="text-xs text-slate-500 grid place-items-center px-2">Used by Quiz • Flashcards • Meme</div>
        </div>

        {/* Chat strip (small, minimal) */}
        <div className="space-y-2">
          {chat.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div className={classNames(
                "inline-block max-w-[70ch] px-4 py-2 rounded-2xl",
                m.role === "user" ? "bg-emerald-100" : "bg-white border"
              )}>{m.content}</div>
            </div>
          ))}
        </div>

        {/* Active tool */}
        {mode === "quiz" && <Quiz topic={topic} />}
        {mode === "flashcards" && <Flashcards topic={topic} />}
        {mode === "meme" && <Meme topic={topic} setTopic={setTopic} />}
      </div>

      {/* Composer (sticky bottom) */}
      <div className="sticky bottom-0 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3">
          <div className="bg-white border rounded-3xl px-3 py-2 flex items-end gap-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here: 'quiz pointers', 'flashcards arrays', or 'make a meme about recursion'…"
              className="flex-1 outline-none bg-transparent text-sm resize-none"
            />
            <button onClick={onSend} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white">
              <Icon.send className="h-4 w-4"/> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
