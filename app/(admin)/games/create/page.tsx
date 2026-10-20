'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Gamepad2, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Upload,
  Sparkles,
  Layers,
  Globe,
  Clock,
  Check,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface Event {
  _id: string;
  title: string;
}

const CATEGORIES = [
  'Science',
  'Trivia',
  'Music',
  'History',
  'Geography',
  'Pop Culture',
  'Gaming',
  'Art',
  'General'
];

const PRESET_QUIZ_COVERS = [
  { label: 'Space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Technology', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80' },
  { label: 'Music', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sports', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80' },
  { label: 'World', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80' },
];

export default function CreateQuizPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cover image mode & file ref
  const [quizImageMode, setQuizImageMode] = useState<'upload' | 'url'>('upload');
  const quizCoverFileRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'Trivia',
    author: 'Eventeev Staff',
    thumbnail: '',
    level: 'Med',
    isTemplate: true,
    eventId: '',
    questions: [
      { 
        text: '', 
        mediaUrl: '',
        type: 'Quiz', 
        options: ['', '', '', ''], 
        correctAnswer: [0], 
        points: 1000, 
        timeLimit: 20 
      }
    ]
  });

  useEffect(() => {
    let ignore = false;
    const fetchEvents = async () => {
      try {
        const eventsData = await api.get<{ events: Event[] }>('/admin/events').catch(() => ({ events: [] }));
        if (!ignore) {
          setEvents(eventsData.events || []);
        }
      } catch {
        if (!ignore) {
          setEvents([]);
        }
      } finally {
        if (!ignore) {
          setIsFetchingEvents(false);
        }
      }
    };

    fetchEvents();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle Quiz Cover Image Upload
  const handleQuizCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewQuiz(prev => ({ ...prev, thumbnail: dataUrl }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Question Image Upload
  const handleQuestionImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file for the question.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewQuiz(prev => {
        const updated = [...prev.questions];
        updated[index] = { ...updated[index], mediaUrl: dataUrl };
        return { ...prev, questions: updated };
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Removing Question Image
  const handleRemoveQuestionImage = (index: number) => {
    setNewQuiz(prev => {
      const updated = [...prev.questions];
      updated[index] = { ...updated[index], mediaUrl: '' };
      return { ...prev, questions: updated };
    });
  };

  const handleAddQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', mediaUrl: '', type: 'Quiz', options: ['', '', '', ''], correctAnswer: [0], points: 1000, timeLimit: 20 }
      ]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    if (newQuiz.questions.length <= 1) return;
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.title.trim()) {
      setError("Please enter a quiz title.");
      return;
    }
    if (!newQuiz.isTemplate && !newQuiz.eventId) {
      setError("Please select an event or mark as a Platform Template.");
      return;
    }

    // Validate that questions have text and options
    for (let i = 0; i < newQuiz.questions.length; i++) {
      const q = newQuiz.questions[i];
      if (!q.text.trim()) {
        setError(`Please enter a prompt for Question #${i + 1}.`);
        return;
      }
      for (let o = 0; o < q.options.length; o++) {
        if (!q.options[o].trim()) {
          setError(`Please fill in all options for Question #${i + 1}.`);
          return;
        }
      }
    }

    try {
      setIsLoading(true);
      const payload = {
        ...newQuiz,
        thumbnail: newQuiz.thumbnail || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        eventId: newQuiz.isTemplate ? null : newQuiz.eventId,
        questions: newQuiz.questions.map(q => ({
          text: q.text,
          mediaUrl: q.mediaUrl ? q.mediaUrl : undefined,
          type: q.type || 'Quiz',
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1000,
          timeLimit: q.timeLimit || 20,
        }))
      };

      await api.post('/admin/games/quizzes', payload);
      setSuccess("New quiz challenge launched successfully!");
      setTimeout(() => {
        router.push('/games');
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create game.";
      setError(message);
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-8 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs ${
              error ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-3 hover:opacity-70 cursor-pointer">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <Link
            href="/games"
            className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-2xs"
            title="Back to Games"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/games" className="hover:text-slate-600 transition-colors">Games</Link>
              <span>/</span>
              <span className="text-slate-700 font-bold">Create Quiz</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Create Quiz Challenge</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/60">
                Interactive Game
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/games"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button 
            onClick={handleCreateQuiz}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Gamepad2 size={14} />}
            <span>Deploy Quiz</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleCreateQuiz} className="space-y-6">
        {/* Section 1: Quiz Title & Cover Artwork */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-200/60">
                <ImageIcon size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Quiz Title & Cover Artwork</h3>
                <p className="text-xs text-slate-400 font-medium">Add a striking title and visual artwork to brand your game challenge.</p>
              </div>
            </div>
            {newQuiz.thumbnail && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check size={11} /> Cover Attached
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form Inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                  Quiz Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Lagos Tech Quiz & Trivia Championship"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/15 focus:border-orange-500/60 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Category</label>
                  <select 
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Author Attribution</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah J. or Eventeev Staff"
                    value={newQuiz.author}
                    onChange={(e) => setNewQuiz({ ...newQuiz, author: e.target.value })}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Controls */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Quiz Cover Image</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setQuizImageMode('upload')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        quizImageMode === 'upload' 
                          ? 'bg-white text-orange-600 shadow-2xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizImageMode('url')}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                        quizImageMode === 'url' 
                          ? 'bg-white text-orange-600 shadow-2xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {quizImageMode === 'upload' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      ref={quizCoverFileRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleQuizCoverUpload}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => quizCoverFileRef.current?.click()}
                      className="flex-grow bg-slate-50 hover:bg-orange-50/40 border-2 border-dashed border-slate-200 hover:border-orange-500/70 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-orange-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Upload size={14} className="text-orange-600" />
                      <span>{newQuiz.thumbnail ? "Change Cover Image File" : "Choose Image File from Computer"}</span>
                    </button>
                    {newQuiz.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setNewQuiz({ ...newQuiz, thumbnail: '' })}
                        className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        title="Clear cover image"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-grow flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                      <LinkIcon size={14} className="text-slate-400 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/... or paste image URL"
                        value={newQuiz.thumbnail}
                        onChange={(e) => setNewQuiz({ ...newQuiz, thumbnail: e.target.value })}
                        className="w-full text-xs font-medium text-slate-900 outline-none bg-transparent"
                      />
                    </div>
                    {newQuiz.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setNewQuiz({ ...newQuiz, thumbnail: '' })}
                        className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                        title="Clear cover image"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Presets:</span>
                  {PRESET_QUIZ_COVERS.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewQuiz({ ...newQuiz, thumbnail: preset.url })}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Cover Card */}
            <div className="lg:col-span-5 h-full flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                Live Artwork Preview Card
              </label>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950/5 aspect-4/3 flex items-center justify-center group shadow-xs">
                {newQuiz.thumbnail ? (
                  <>
                    <img 
                      src={newQuiz.thumbnail} 
                      alt="Quiz Cover" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-orange-300 bg-orange-950/70 backdrop-blur-xs px-2.5 py-0.5 rounded-md w-fit mb-1 border border-orange-500/40">
                        {newQuiz.category}
                      </span>
                      <p className="text-sm font-black line-clamp-1 leading-snug text-white">
                        {newQuiz.title || "Untitled Quiz Challenge"}
                      </p>
                      <p className="text-[11px] text-slate-300 font-medium">
                        By {newQuiz.author || "Eventeev Staff"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewQuiz({ ...newQuiz, thumbnail: '' })}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove cover"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-2 shadow-2xs">
                      <ImageIcon size={26} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">No Cover Attached</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 max-w-[200px] mx-auto">
                      Upload an image file or pick a preset to brand your quiz banner
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Scope & Target Association */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-200/60">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Scope & Description</h3>
              <p className="text-xs text-slate-400 font-medium">Choose whether this quiz is a platform-wide template or linked to an event.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Template Card Toggle */}
            <div 
              onClick={() => setNewQuiz({ ...newQuiz, isTemplate: !newQuiz.isTemplate })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                newQuiz.isTemplate 
                  ? 'bg-orange-50/60 border-orange-300 ring-2 ring-orange-500/10' 
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe size={14} className={newQuiz.isTemplate ? "text-orange-600" : "text-slate-400"} />
                  <span>Platform Template</span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Makes this quiz available in the Featured Quizzes library for all organizers.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={newQuiz.isTemplate}
                onChange={(e) => setNewQuiz({ ...newQuiz, isTemplate: e.target.checked })}
                className="w-4 h-4 accent-orange-600 rounded cursor-pointer shrink-0 ml-3"
              />
            </div>

            {/* Event Binding */}
            {!newQuiz.isTemplate ? (
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                  Bind to Specific Event <span className="text-rose-500">*</span>
                </label>
                <select 
                  required={!newQuiz.isTemplate}
                  value={newQuiz.eventId}
                  disabled={isFetchingEvents}
                  onChange={(e) => setNewQuiz({ ...newQuiz, eventId: e.target.value })}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-slate-900 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">{isFetchingEvents ? 'Loading active events...' : 'Select an event from registry...'}</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>{event.title}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Layers size={16} />
                <span>Global Template mode enabled — no event binding required.</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">Quiz Description</label>
            <textarea 
              rows={2}
              placeholder="Short description or guidelines for players..."
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/15 focus:border-orange-500/60 resize-none transition-all"
            />
          </div>
        </div>

        {/* Section 3: Questions & Media Builder */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-200/60">
                <Gamepad2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Questions & Media ({newQuiz.questions.length})</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Each question can have its own allocated visual image, answer choices, and timer.
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {newQuiz.questions.map((q, qIndex) => (
              <div 
                key={qIndex} 
                className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Question Header & Title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <span className="w-7 h-7 rounded-xl bg-orange-500 text-white text-xs font-black flex items-center justify-center shadow-2xs">
                      {qIndex + 1}
                    </span>
                  </div>

                  <div className="flex-grow">
                    <input 
                      required
                      type="text"
                      placeholder={`Enter Question #${qIndex + 1} prompt (e.g. Which team won the 2022 World Cup?)...`}
                      value={q.text}
                      onChange={(e) => {
                        const updated = [...newQuiz.questions];
                        updated[qIndex].text = e.target.value;
                        setNewQuiz({ ...newQuiz, questions: updated });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/15 focus:border-orange-500 transition-all"
                    />
                  </div>

                  {newQuiz.questions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove this question"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Dedicated Allocated Image for this Question */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-orange-600" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Question {qIndex + 1} Image
                      </span>
                      {q.mediaUrl ? (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check size={10} /> Image Allocated
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                          Optional Visual Prompt
                        </span>
                      )}
                    </div>

                    {q.mediaUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionImage(qIndex)}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={11} /> Remove Image
                      </button>
                    )}
                  </div>

                  {/* If image allocated: show preview card */}
                  {q.mediaUrl ? (
                    <div className="flex items-center gap-3.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                      <div className="w-24 h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                        <img 
                          src={q.mediaUrl} 
                          alt={`Question ${qIndex + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {q.mediaUrl.startsWith('data:') ? 'Custom image uploaded from device' : q.mediaUrl}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          This image will display above the options on participants&apos; screens while answering.
                        </p>
                      </div>
                      <div className="shrink-0">
                        <label 
                          htmlFor={`q-file-${qIndex}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Upload size={12} />
                          <span>Replace</span>
                        </label>
                        <input 
                          id={`q-file-${qIndex}`}
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleQuestionImageUpload(qIndex, e)}
                          className="hidden" 
                        />
                      </div>
                    </div>
                  ) : (
                    /* If no image allocated: allocation controls */
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-5">
                        <label 
                          htmlFor={`q-file-${qIndex}`}
                          className="w-full h-10 bg-slate-50 hover:bg-orange-50/50 border border-dashed border-slate-300 hover:border-orange-500 rounded-xl px-3 text-xs font-bold text-slate-600 hover:text-orange-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload size={13} className="text-orange-600" />
                          <span>Upload Image File</span>
                        </label>
                        <input 
                          id={`q-file-${qIndex}`}
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleQuestionImageUpload(qIndex, e)}
                          className="hidden" 
                        />
                      </div>
                      <div className="sm:col-span-7">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-10">
                          <LinkIcon size={13} className="text-slate-400 shrink-0" />
                          <input 
                            type="text" 
                            placeholder="Or paste image URL (https://...)..."
                            value={q.mediaUrl || ''}
                            onChange={(e) => {
                              const updated = [...newQuiz.questions];
                              updated[qIndex].mediaUrl = e.target.value;
                              setNewQuiz({ ...newQuiz, questions: updated });
                            }}
                            className="w-full text-xs font-medium outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Answer Options (Select the correct answer)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-colors ${
                          q.correctAnswer[0] === optIndex 
                            ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/10' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <input 
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer[0] === optIndex}
                          onChange={() => {
                            const updated = [...newQuiz.questions];
                            updated[qIndex].correctAnswer = [optIndex];
                            setNewQuiz({ ...newQuiz, questions: updated });
                          }}
                          className="accent-emerald-600 cursor-pointer w-4 h-4 shrink-0"
                          title="Mark as correct answer"
                        />
                        <input 
                          required
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...newQuiz.questions];
                            updated[qIndex].options[optIndex] = e.target.value;
                            setNewQuiz({ ...newQuiz, questions: updated });
                          }}
                          className="w-full text-xs font-semibold outline-none bg-transparent text-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Limit & Points Settings */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-slate-400" />
                      <span className="font-semibold text-slate-600">Time Limit:</span>
                      <select 
                        value={q.timeLimit || 20}
                        onChange={(e) => {
                          const updated = [...newQuiz.questions];
                          updated[qIndex].timeLimit = Number(e.target.value);
                          setNewQuiz({ ...newQuiz, questions: updated });
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value={10}>10 seconds</option>
                        <option value={15}>15 seconds</option>
                        <option value={20}>20 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>60 seconds</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-slate-400" />
                      <span className="font-semibold text-slate-600">Score Value:</span>
                      <select 
                        value={q.points || 1000}
                        onChange={(e) => {
                          const updated = [...newQuiz.questions];
                          updated[qIndex].points = Number(e.target.value);
                          setNewQuiz({ ...newQuiz, questions: updated });
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value={500}>500 pts</option>
                        <option value={1000}>1,000 pts</option>
                        <option value={1500}>1,500 pts</option>
                        <option value={2000}>2,000 pts</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Gamepad2 size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-sm">
                  {newQuiz.title || "Untitled Quiz"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {newQuiz.category} • {newQuiz.questions.length} Question{newQuiz.questions.length > 1 ? 's' : ''} • {newQuiz.isTemplate ? 'Platform Template' : 'Event Quiz'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/games"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Gamepad2 size={15} />}
                <span>Deploy Quiz Challenge</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
