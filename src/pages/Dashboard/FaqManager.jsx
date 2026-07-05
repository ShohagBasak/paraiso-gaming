import { useState, useEffect } from 'react';
import { MdQuestionAnswer, MdAdd, MdEdit, MdDelete, MdArrowUpward, MdArrowDownward, MdSave, MdCancel } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FaqManager = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Add/Edit Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentFaqId, setCurrentFaqId] = useState(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    
    // Collapsable FAQ Items State
    const [expandedFaqs, setExpandedFaqs] = useState({});

    // Collapsable FAQ List Card State (starts collapsed by default)
    const [isListCollapsed, setIsListCollapsed] = useState(true);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/faqs`);
            if (!res.ok) throw new Error('Failed to fetch FAQs');
            const data = await res.json();
            setFaqs(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error(err.message || 'Error loading FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const toggleFaqExpand = (id) => {
        setExpandedFaqs(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleResetForm = () => {
        setIsEditing(false);
        setCurrentFaqId(null);
        setQuestion('');
        setAnswer('');
    };

    const handleEditClick = (faq) => {
        setIsEditing(true);
        setCurrentFaqId(faq.id);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        
        // Auto-expand the item being edited so they can view it
        setExpandedFaqs(prev => ({ ...prev, [faq.id]: true }));
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) {
            toast.error('Please enter both question and answer');
            return;
        }

        setSaving(true);
        try {
            const url = isEditing ? `${BASE_URL}/faqs/${currentFaqId}` : `${BASE_URL}/faqs`;
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ question, answer }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save FAQ');

            toast.success(isEditing ? 'FAQ updated successfully!' : 'FAQ added successfully!');
            handleResetForm();
            fetchFaqs();
        } catch (err) {
            toast.error(err.message || 'Error saving FAQ');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            const res = await fetch(`${BASE_URL}/faqs/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete FAQ');
            toast.success('FAQ deleted successfully');
            fetchFaqs();
        } catch (err) {
            toast.error(err.message || 'Error deleting FAQ');
        }
    };

    const handleMove = async (index, direction) => {
        const newFaqs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= faqs.length) return;

        // Swap items
        const temp = newFaqs[index];
        newFaqs[index] = newFaqs[targetIndex];
        newFaqs[targetIndex] = temp;

        // Recalculate sort order
        const orders = newFaqs.map((faq, idx) => ({
            id: faq.id,
            sort_order: idx
        }));

        // Optimistically update local UI
        setFaqs(newFaqs);

        try {
            const res = await fetch(`${BASE_URL}/faqs/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orders }),
            });
            if (!res.ok) throw new Error('Failed to save FAQ order');
        } catch (err) {
            toast.error(err.message || 'Failed to update order');
            fetchFaqs(); // revert
        }
    };

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">FAQ Manager</h2>
                <p className="text-slate-400 text-sm mt-1">Manage frequently asked questions on the homepage.</p>
            </div>

            {/* Create/Edit Card */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                    {isEditing ? <MdEdit className="text-cyan-400" /> : <MdAdd className="text-cyan-400" />}
                    {isEditing ? 'Edit FAQ Item' : 'Add FAQ Item'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Question</label>
                        <input
                            type="text"
                            placeholder="e.g. When is the server launching?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-bold"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Answer</label>
                        <textarea
                            rows={4}
                            placeholder="Type the answer description here..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="px-4 py-3 bg-[#080d13] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600 font-medium"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 justify-end pt-2">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleResetForm}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <MdCancel size={16} />
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
                        >
                            <MdSave size={16} />
                            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add FAQ'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Table */}
            <div className="bg-[#0d1117] border border-slate-800 rounded-2xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => setIsListCollapsed(!isListCollapsed)}
                    className="w-full p-5 border-b border-slate-800 flex justify-between items-center hover:bg-slate-800/10 text-left focus:outline-none transition-colors"
                >
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">FAQ List ({faqs.length})</h3>
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                        {isListCollapsed ? 'Show List ▼' : 'Hide List ▲'}
                    </span>
                </button>

                {!isListCollapsed && (
                    <>
                        <div className="px-5 py-3 bg-slate-900/20 border-b border-slate-800/50 text-slate-500 text-xs font-semibold">
                            Click Question to Expand Answer
                        </div>

                        {loading ? (
                            <div className="p-10 flex items-center gap-3 text-slate-400">
                                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading FAQs...
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 text-sm">
                                <MdQuestionAnswer className="mx-auto mb-2 text-slate-700" size={32} />
                                No FAQs found. Create one above!
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/60">
                                {faqs.map((faq, index) => {
                                    const isExpanded = !!expandedFaqs[faq.id];
                                    return (
                                        <div key={faq.id} className="p-5 hover:bg-slate-800/10 transition-colors">
                                            <div className="flex items-start gap-4 justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleFaqExpand(faq.id)}
                                                        className="w-full flex items-center justify-between text-left focus:outline-none group"
                                                    >
                                                        <p className="text-cyan-400 font-bold text-sm group-hover:text-cyan-300 transition-colors">
                                                            Q: {faq.question}
                                                        </p>
                                                        <span className="text-slate-500 group-hover:text-slate-300 ml-2 font-mono text-lg select-none">
                                                            {isExpanded ? '−' : '+'}
                                                        </span>
                                                    </button>
                                                    
                                                    {isExpanded && (
                                                        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed mt-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 animate-in slide-in-from-top-1 duration-150">
                                                            {faq.answer}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                                                    <button
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0}
                                                        title="Move Up"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                                                    >
                                                        <MdArrowUpward size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === faqs.length - 1}
                                                        title="Move Down"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800"
                                                    >
                                                        <MdArrowDownward size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(faq)}
                                                        title="Edit"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
                                                    >
                                                        <MdEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        title="Delete"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                                                    >
                                                        <MdDelete size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FaqManager;
