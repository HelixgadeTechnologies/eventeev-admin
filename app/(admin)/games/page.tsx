'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Plus, 
  Search, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Puzzle, 
  Upload,
  Download,
  Eye,
  FileJson,
  Sparkles,
  Layers,
  Globe,
  Clock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface Question {
  text: string;
  mediaUrl?: string;
  type?: string;
  options: string[];
  correctAnswer: number[];
  points?: number;
  timeLimit?: number;
  isMultiSelect?: boolean;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail?: string;
  author?: string;
  isTemplate?: boolean;
  isFeatured?: boolean;
  level?: string;
  avgTime?: string;
  plays?: number;
  questions: Question[];
  eventId?: {
    _id: string;
    title: string;
  } | null;
  createdAt: string;
}

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

const SAMPLE_QUIZ_TEMPLATE = {
  title: "The Ultimate Space Trivia",
  category: "Science",
  description: "Embark on an interstellar journey testing your knowledge of galaxies, astronauts, and black holes.",
  author: "Sarah J.",
  thumbnail: "/thumbnails/space_trivia.png",
  level: "Med",
  avgTime: "15m",
  isTemplate: true,
  isFeatured: true,
  questions: [
    {
      text: "What is the closest planet to the Sun?",
      type: "Quiz",
      options: ["Venus", "Mercury", "Mars", "Earth"],
      correctAnswer: [1],
      timeLimit: 20,
      points: 1000,
      isMultiSelect: false
    },
    {
      text: "Which galaxy is on a collision course with our Milky Way?",
      type: "Quiz",
      options: ["Andromeda", "Triangulum", "Sombrero", "Whirlpool"],
      correctAnswer: [0],
      timeLimit: 20,
      points: 1000,
      isMultiSelect: false
    },
    {
      text: "The Moon has an active atmosphere with breathable oxygen.",
      type: "True/False",
      options: ["True", "False"],
      correctAnswer: [1],
      timeLimit: 15,
      points: 500,
      isMultiSelect: false
    }
  ]
};

export default function GamesManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'All' | 'Templates' | 'Events'>('All');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedQuizzes, setParsedQuizzes] = useState<Partial<Quiz>[]>([]);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Manual Form State
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'Trivia',
    author: 'Eventeev Staff',
    thumbnail: '/thumbnails/space_trivia.png',
    level: 'Med',
    isTemplate: true,
    eventId: '',
    questions: [
      { 
        text: '', 
        type: 'Quiz', 
        options: ['', '', '', ''], 
        correctAnswer: [0], 
        points: 1000, 
        timeLimit: 20 
      }
    ]
  });

  const fetchData = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const [quizzesData, eventsData] = await Promise.all([
        api.get<Quiz[]>('/admin/games/quizzes').catch(() => []),
        api.get<{ events: Event[] }>('/admin/events').catch(() => ({ events: [] }))
      ]);
      setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
      setEvents(eventsData.events || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load games data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const [quizzesData, eventsData] = await Promise.all([
          api.get<Quiz[]>('/admin/games/quizzes').catch(() => []),
          api.get<{ events: Event[] }>('/admin/events').catch(() => ({ events: [] }))
        ]);
        if (!ignore) {
          setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
          setEvents(eventsData.events || []);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load games data.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle JSON File Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const quizList = Array.isArray(json) ? json : [json];

        // Validation
        for (let i = 0; i < quizList.length; i++) {
          const q = quizList[i];
          if (!q.title || typeof q.title !== 'string') {
            throw new Error(`Item #${i + 1} is missing a valid "title".`);
          }
          if (!Array.isArray(q.questions) || q.questions.length === 0) {
            throw new Error(`Quiz "${q.title}" must contain an array of "questions".`);
          }
          for (let j = 0; j < q.questions.length; j++) {
            const question = q.questions[j];
            if (!question.text) {
              throw new Error(`Question #${j + 1} in "${q.title}" is missing question "text".`);
            }
            if (!Array.isArray(question.options) || question.options.length < 2) {
              throw new Error(`Question #${j + 1} in "${q.title}" must contain at least 2 "options".`);
            }
            if (!Array.isArray(question.correctAnswer) || question.correctAnswer.length === 0) {
              throw new Error(`Question #${j + 1} in "${q.title}" must specify "correctAnswer" index array.`);
            }
          }
        }

        setParsedQuizzes(quizList);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid JSON file structure.";
        setUploadError(msg);
        setParsedQuizzes([]);
      }
    };

    reader.onerror = () => {
      setUploadError("Failed to read file.");
    };

    reader.readAsText(file);
  };

  // Deploy parsed JSON quizzes to backend
  const handleDeployUploadedQuizzes = async () => {
    if (parsedQuizzes.length === 0) return;
    try {
      setIsUploading(true);
      const payload = parsedQuizzes.map(q => ({
        ...q,
        isTemplate: q.isTemplate !== undefined ? q.isTemplate : true,
        isFeatured: q.isFeatured !== undefined ? q.isFeatured : true,
        category: q.category || 'Trivia',
        author: q.author || 'Eventeev Staff',
        thumbnail: q.thumbnail || '/thumbnails/space_trivia.png',
      }));

      await api.post('/admin/games/quizzes', payload.length === 1 ? payload[0] : payload);
      setSuccess(`Successfully deployed ${payload.length} quiz game${payload.length > 1 ? 's' : ''} to the platform library!`);
      setIsUploadModalOpen(false);
      setParsedQuizzes([]);
      setUploadFileName(null);
      fetchData(true);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to deploy quizzes.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Download Sample JSON file
  const handleDownloadSampleJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SAMPLE_QUIZ_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "eventeev_quiz_sample.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export existing Quiz to JSON
  const handleExportQuizJson = (quiz: Quiz) => {
    const exportData = {
      title: quiz.title,
      category: quiz.category,
      description: quiz.description,
      author: quiz.author || "Eventeev Admin",
      thumbnail: quiz.thumbnail,
      level: quiz.level || "Med",
      avgTime: quiz.avgTime || "15m",
      isTemplate: quiz.isTemplate !== false,
      isFeatured: quiz.isFeatured !== false,
      questions: quiz.questions.map(q => ({
        text: q.text,
        type: q.type || 'Quiz',
        options: q.options,
        correctAnswer: q.correctAnswer,
        timeLimit: q.timeLimit || 20,
        points: q.points || 1000,
        isMultiSelect: !!q.isMultiSelect
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${quiz.title.toLowerCase().replace(/\s+/g, '_')}_quiz.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Manual Creation
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.isTemplate && !newQuiz.eventId) {
      setError("Please select an event or mark as a Platform Template.");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...newQuiz,
        eventId: newQuiz.isTemplate ? null : newQuiz.eventId,
      };

      await api.post('/admin/games/quizzes', payload);
      setSuccess("New quiz challenge launched successfully!");
      setIsCreateModalOpen(false);
      setNewQuiz({
        title: '',
        description: '',
        category: 'Trivia',
        author: 'Eventeev Staff',
        thumbnail: '/thumbnails/space_trivia.png',
        level: 'Med',
        isTemplate: true,
        eventId: '',
        questions: [{ text: '', type: 'Quiz', options: ['', '', '', ''], correctAnswer: [0], points: 1000, timeLimit: 20 }]
      });
      fetchData(true);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create game.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to retire this game?")) return;
    try {
      await api.delete(`/admin/games/quizzes/${id}`);
      setSuccess("Game removed from registry.");
      setQuizzes(prev => prev.filter(q => q._id !== id));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete quiz.";
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', type: 'Quiz', options: ['', '', '', ''], correctAnswer: [0], points: 1000, timeLimit: 20 }
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

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'Templates') {
      return matchesSearch && (quiz.isTemplate || !quiz.eventId);
    }
    if (selectedTab === 'Events') {
      return matchesSearch && !quiz.isTemplate && !!quiz.eventId;
    }
    return matchesSearch;
  });

  const templateCount = quizzes.filter(q => q.isTemplate || !q.eventId).length;
  const eventCount = quizzes.filter(q => !q.isTemplate && !!q.eventId).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Notifications Toast */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/70">
            <Globe size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Platform Templates</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{templateCount}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/70">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Event Quizzes</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{eventCount}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/70">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Questions</p>
            <h4 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0)}
            </h4>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs, Search, and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Tab Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit flex-wrap gap-1">
          {[
            { id: 'All', label: 'All Quizzes', count: quizzes.length },
            { id: 'Templates', label: 'Platform Library', count: templateCount },
            { id: 'Events', label: 'Event Specific', count: eventCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'All' | 'Templates' | 'Events')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === tab.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Search quizzes or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handleDownloadSampleJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download formatted JSON template"
          >
            <Download size={14} />
            <span>Sample JSON</span>
          </button>

          <button 
            onClick={() => {
              setParsedQuizzes([]);
              setUploadFileName(null);
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Upload size={14} />
            <span>Upload Quiz JSON</span>
          </button>

          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Quiz</span>
          </button>
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-orange-500 mb-3" size={36} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Game Registry...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Quiz Title & Category</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Scope / Target</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Questions</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Author</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map((quiz) => (
                    <tr key={quiz._id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/60 shadow-2xs font-bold text-xs shrink-0 overflow-hidden">
                            {quiz.thumbnail ? (
                              <img src={quiz.thumbnail} alt={quiz.title} className="w-full h-full object-cover" />
                            ) : (
                              <Puzzle size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {quiz.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {quiz.category}
                              </span>
                              {quiz.level && (
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {quiz.level} • {quiz.avgTime || '15m'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {quiz.isTemplate || !quiz.eventId ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                            <Globe size={12} />
                            Platform Template
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Layers size={12} />
                            {quiz.eventId?.title || 'Event Quiz'}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                          {quiz.questions?.length || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-medium text-slate-600">
                          {quiz.author || 'Eventeev Staff'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setPreviewQuiz(quiz)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Preview Questions"
                          >
                            <Eye size={15} />
                          </button>
                          
                          <button 
                            onClick={() => handleExportQuizJson(quiz)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Export JSON"
                          >
                            <Download size={14} />
                          </button>

                          <button 
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Retire game"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-xs text-slate-400 font-medium italic">
                      No quizzes found matching your selection. Click &quot;Upload Quiz JSON&quot; or &quot;Create Quiz&quot; to add content.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON File Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200/70">
                    <FileJson size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">Upload Quiz File (.json)</h3>
                    <p className="text-xs text-slate-400 font-medium">Bulk publish ready-made trivia directly to the platform library.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {/* Drag and Drop Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-orange-50/20 transition-all group"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 mx-auto flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors mb-3">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {uploadFileName ? uploadFileName : "Click to select or drag and drop a Quiz .json file"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    Standard Quiz JSON with questions, options, and correct answers
                  </p>
                </div>

                {uploadError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Parsed Preview */}
                {parsedQuizzes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Parsed Quizzes Ready to Deploy ({parsedQuizzes.length})
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Schema Validated
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {parsedQuizzes.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{q.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Category: {q.category || 'Trivia'} • {q.questions?.length} Questions • By {q.author || 'Staff'}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Platform Template
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={handleDownloadSampleJson}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download Example Format</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      disabled={parsedQuizzes.length === 0 || isUploading}
                      onClick={handleDeployUploadedQuizzes}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      <span>Deploy to Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Preview Modal */}
      <AnimatePresence>
        {previewQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 font-bold shrink-0">
                    <Puzzle size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{previewQuiz.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {previewQuiz.category} • {previewQuiz.questions?.length} Questions • By {previewQuiz.author || 'Eventeev Staff'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewQuiz(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 overflow-y-auto space-y-4 pr-1 flex-grow">
                {previewQuiz.questions?.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900">
                        <span className="text-orange-600 font-black mr-1.5">{qIdx + 1}.</span>
                        {q.text}
                      </p>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                        <Clock size={10} />
                        {q.timeLimit || 20}s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options?.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer?.includes(optIdx);
                        return (
                          <div 
                            key={optIdx} 
                            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                              isCorrect 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-white text-slate-600 border-slate-200/80'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && (
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                <Check size={10} />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end shrink-0">
                <button 
                  onClick={() => setPreviewQuiz(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Add Quiz Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Create Quiz Challenge</h3>
                  <p className="text-xs text-slate-400 font-medium">Build interactive trivia with questions, answers, and time limits.</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Game Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Lagos Tech Quiz"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                    <select 
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Author Attribution</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sarah J. or Eventeev Staff"
                      value={newQuiz.author}
                      onChange={(e) => setNewQuiz({ ...newQuiz, author: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Cover Thumbnail URL</label>
                    <input 
                      type="text" 
                      placeholder="https://... or /thumbnails/space_trivia.png"
                      value={newQuiz.thumbnail}
                      onChange={(e) => setNewQuiz({ ...newQuiz, thumbnail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* Target Scope Checkbox */}
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-orange-950">Save as Global Platform Template</p>
                    <p className="text-[11px] text-orange-700/80">Make this quiz selectable by all organizers in the Featured Quizzes library.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={newQuiz.isTemplate}
                    onChange={(e) => setNewQuiz({ ...newQuiz, isTemplate: e.target.checked })}
                    className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                  />
                </div>

                {!newQuiz.isTemplate && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Bind to Specific Event</label>
                    <select 
                      required={!newQuiz.isTemplate}
                      value={newQuiz.eventId}
                      onChange={(e) => setNewQuiz({ ...newQuiz, eventId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="">Select an event from registry...</option>
                      {events.map(event => (
                        <option key={event._id} value={event._id}>{event.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Description</label>
                  <textarea 
                    rows={2}
                    placeholder="Short description for participants..."
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:ring-3 focus:ring-orange-500/10 focus:border-orange-500/40 resize-none"
                  />
                </div>

                {/* Dynamic Questions Builder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Questions ({newQuiz.questions.length})</label>
                    <button 
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add Question
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {newQuiz.questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-700">Q{qIndex + 1}.</span>
                          <input 
                            required
                            type="text"
                            placeholder="Enter question text..."
                            value={q.text}
                            onChange={(e) => {
                              const updated = [...newQuiz.questions];
                              updated[qIndex].text = e.target.value;
                              setNewQuiz({ ...newQuiz, questions: updated });
                            }}
                            className="flex-grow bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none"
                          />
                          {newQuiz.questions.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                              <input 
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer[0] === optIndex}
                                onChange={() => {
                                  const updated = [...newQuiz.questions];
                                  updated[qIndex].correctAnswer = [optIndex];
                                  setNewQuiz({ ...newQuiz, questions: updated });
                                }}
                                className="accent-orange-600 cursor-pointer"
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
                                className="w-full text-[11px] font-medium outline-none bg-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Gamepad2 size={13} />}
                    <span>Deploy Game</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

