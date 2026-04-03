import React, { useState } from 'react';
import { PollCard } from '../PollPrediction/PollCard';
import { useAuth } from "../../Context/AuthContext";
import ServerApi from '../../api/ServerAPI';

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

const CreatePrediction = () => {
  const { user } = useAuth();
  const [realm, setRealm] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [question, setQuestion] = useState('');
  const [submittedPrediction, setSubmittedPrediction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!realm || !question) return;
    try {
      setLoading(true);
      const response = await ServerApi.post('userPrediction/submit', {
        username: user.userName,
        email: user.email,
        realm, category, subcategory, question,
      });
      if (response.data.success) {
        setSubmittedPrediction(response.data.data);
        setIsModalOpen(true);
        setRealm('');
        setQuestion('');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-10 px-4" style={{ background: 'var(--assert-bg)' }}>
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Create Prediction</h1>
          <p className="text-slate-500 text-sm mt-1">Submit a yes/no prediction for the community to vote on.</p>
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
                {REALMS.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>

            {realm === "sports" && (
              <div>
                <label className="form-label">Category <span className="text-red-500">*</span></label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}
                  className="assert-select w-full"
                  required
                >
                  <option value="">Select a category</option>
                  {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}

            {category && categories[category]?.length > 0 && (
              <div>
                <label className="form-label">Subcategory <span className="text-slate-400 text-xs">(optional)</span></label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="assert-select w-full"
                >
                  <option value="">None</option>
                  {categories[category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="form-label">Prediction Question <span className="text-red-500">*</span></label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="e.g. Will Team X win the championship this season?"
                className="assert-input w-full resize-none"
                required
              />
            </div>

            <button type="submit" className="btn-assert w-full justify-center py-2.5" disabled={loading}>
              {loading ? "Submitting..." : "Submit Prediction"}
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && submittedPrediction && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="assert-card p-7 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-800">Submitted for Review</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">Your prediction has been submitted and is awaiting admin approval.</p>
            <div className="pointer-events-none opacity-80 flex justify-center">
              <PollCard data={submittedPrediction} />
            </div>
            <button onClick={() => setIsModalOpen(false)} className="btn-assert-ghost w-full justify-center mt-5">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePrediction;
