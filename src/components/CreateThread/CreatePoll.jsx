import React, { useState } from "react";
import OutcomePoll from "../PollPrediction/OutcomePoll";
import { useAuth } from "../../Context/AuthContext";
import ServerApi from "../../api/ServerAPI";

const categories = {
  Basketball: [],
  Boxing: [],
  Baseball: ["NBA", "MLB"],
  Cricket: ["Big Bash", "IPL"],
  Football: ["Premier League", "La Liga", "Ligue 1", "Serie A", "UCL", "UEL", "Others"],
  Hockey: ["NHL"],
  Tennis: [],
  NFL: [],
  UFC: []
};

const REALMS = ["politics", "technology", "crypto", "sports"];

const CreatePoll = () => {
  const { user } = useAuth();
  const [realm, setRealm] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ name: '', votes: 0 }, { name: '', votes: 0 }]);
  const [submittedPoll, setSubmittedPoll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setRealm(''); setCategory(''); setSubcategory(''); setQuestion('');
    setOptions([{ name: '', votes: 0 }, { name: '', votes: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.name.trim());
    if (validOptions.length < 2) return alert("At least two options are required.");
    try {
      setLoading(true);
      const response = await ServerApi.post('userPoll/submit', {
        username: user.userName, email: user.email,
        realm, category, subcategory, question,
        outcome: validOptions.map(o => ({ name: o.name.trim(), votes: 0 })),
      });
      if (response.data.success) {
        setSubmittedPoll(response.data.data);
        setIsModalOpen(true);
        resetForm();
      }
    } catch (error) {
      console.error('Submission Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => setOptions([...options, { name: '', votes: 0 }]);
  const removeOption = (i) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));
  const handleOptionChange = (i, val) => {
    const updated = [...options];
    updated[i].name = val;
    setOptions(updated);
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-10 px-4" style={{ background: 'var(--assert-bg)' }}>
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Create Poll</h1>
          <p className="text-slate-500 text-sm mt-1">Create a multi-option poll for the community to vote on.</p>
        </div>

        <div className="assert-card p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Realm <span className="text-red-500">*</span></label>
              <select
                value={realm}
                onChange={(e) => { setRealm(e.target.value); setCategory(''); setSubcategory(''); }}
                className="assert-select w-full"
                required
              >
                <option value="">Select a realm</option>
                {REALMS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>

            {realm === "sports" && (
              <div>
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}
                  className="assert-select w-full"
                >
                  <option value="">Select a category</option>
                  {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}

            {category && categories[category]?.length > 0 && (
              <div>
                <label className="form-label">Subcategory <span className="text-slate-400 text-xs">(optional)</span></label>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="assert-select w-full">
                  <option value="">None</option>
                  {categories[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="form-label">Poll Question <span className="text-red-500">*</span></label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="What would you like people to vote on?"
                className="assert-input w-full resize-none"
                required
              />
            </div>

            <div>
              <label className="form-label">Options <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="assert-input flex-1"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add option
              </button>
            </div>

            <button type="submit" className="btn-assert w-full justify-center py-2.5" disabled={loading}>
              {loading ? "Submitting..." : "Submit Poll"}
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && submittedPoll && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="assert-card p-7 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-800">Poll Submitted</h2>
            </div>
            <div className="pointer-events-none opacity-80">
              <OutcomePoll data={[submittedPoll]} from="create" />
            </div>
            <button onClick={() => setIsModalOpen(false)} className="btn-assert-ghost w-full justify-center mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
