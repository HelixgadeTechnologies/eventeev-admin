'use client';

import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Plus, 
  Search, 
  Trophy, 
  Users, 
  Trash2, 
  Edit3, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  Puzzle,
  Dices
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  questions: any[];
  eventId: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
}

export default function GamesManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: 'General',
    eventId: '',
    questions: [
      { text: '', options: ['', '', '', ''], correctAnswer: [0], points: 5, timeLimit: 20 }
    ]
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [quizzesData, eventsData] = await Promise.all([
        api.get<Quiz[]>('/admin/games/quizzes'),
        api.get<{ events: Event[] }>('/admin/events')
      ]);
      setQuizzes(quizzesData);
      setEvents(eventsData.events || []);
    } catch (err: any) {
      setError(err.message || "Failed to load games data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.eventId) {
      setError("Please select an event for this game.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/admin/games/quizzes', newQuiz);
      setSuccess("New quiz added successfully!");
      setIsModalOpen(false);
      setNewQuiz({
        title: '',
        description: '',
        category: 'General',
        eventId: '',
        questions: [{ text: '', options: ['', '', '', ''], correctAnswer: [0], points: 5, timeLimit: 20 }]
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to create quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to remove this game?")) return;
    try {
      await api.delete(`/admin/games/quizzes/${id}`);
      setSuccess("Game removed from the platform.");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete quiz.");
    }
  };

  const filteredQuizzes = (quizzes || []).filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.eventId?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}
          >
            {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{error || success}</span>
            <button onClick={() => { setError(null); setSuccess(null); }} className="ml-4 hover:opacity-70">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Gamepad2 className="text-primary" size={32} />
            Games Management
          </h1>
          <p className="text-slate-500 font-medium">Manage interactive quizes and lucky rolls across all events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Add New Game
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Puzzle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Quizzes</p>
            <h4 className="text-3xl font-black text-slate-900">{quizzes.length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-primary flex items-center justify-center border border-orange-100">
            <Dices size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lucky Rolls</p>
            <h4 className="text-3xl font-black text-slate-900">12</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Winners</p>
            <h4 className="text-3xl font-black text-slate-900">142</h4>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search games, categories or events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Game Title</th>
                <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Associated Event</th>
                <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Questions</th>
                <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing Game Data...</p>
                  </td>
                </tr>
              ) : filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz._id} className="hover:bg-orange-50/20 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                          <Puzzle size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{quiz.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{quiz.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-600">{quiz.eventId?.title || 'Unknown Event'}</p>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-black border border-slate-200">
                        {quiz.questions?.length || 0}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuiz(quiz._id)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold italic">
                    No games found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Game Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Platform Game</h2>
                  <p className="text-slate-500 text-sm font-medium">Configure a new interactive quiz for attendees.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateQuiz} className="p-10 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Game Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Tech Trivia 2026"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Category</label>
                    <select 
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option>General</option>
                      <option>Tech</option>
                      <option>Music</option>
                      <option>Networking</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Associated Event</label>
                  <select 
                    required
                    value={newQuiz.eventId}
                    onChange={(e) => setNewQuiz({...newQuiz, eventId: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select an event...</option>
                    {events.map(event => (
                      <option key={event._id} value={event._id}>{event.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Briefly describe the game rules or content..."
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold resize-none"
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:text-slate-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
                  >
                    Create Game
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
