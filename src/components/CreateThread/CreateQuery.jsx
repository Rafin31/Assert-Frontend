import React, { useState } from 'react';
import { useAuth } from "../../Context/AuthContext";
import { submitQuery } from "../../Services/createService.jsx";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const REALMS = ["politics", "technology", "crypto", "sports"];

const CreateQuery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realm, setRealm] = useState('');
  const [question, setQuestion] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const handleFormPreview = (e) => {
    e.preventDefault();
    if (!realm || !question) return;
    setIsPreviewModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await submitQuery({
        username: user.userName, email: user.email,
        realm, question, moreDetails,
        type: "query", status: "approved",
      });
      if (response.data) {
        setSubmittedQuery(response.data.data);
        setIsResultModalOpen(true);
        toast.success('Query posted successfully!', { theme: "light" });
        navigate('/thread');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.', { theme: "light" });
    }
    setIsPreviewModalOpen(false);
    setRealm(''); setQuestion(''); setMoreDetails('');
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-10 px-4" style={{ background: 'var(--assert-bg)' }}>
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Ask a Question</h1>
          <p className="text-slate-500 text-sm mt-1">Post a query and get answers from the community. Costs 5 AT tokens.</p>
        </div>

        <div className="assert-card p-7">
          <form onSubmit={handleFormPreview} className="space-y-5">
            <div>
              <label className="form-label">Realm <span className="text-red-500">*</span></label>
              <select
                value={realm}
                onChange={(e) => setRealm(e.target.value)}
                className="assert-select w-full"
                required
              >
                <option value="">Select a realm</option>
                {REALMS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Your Query <span className="text-red-500">*</span></label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="What would you like to ask the community?"
                className="assert-input w-full resize-none"
                required
              />
            </div>

            <div>
              <label className="form-label">Additional Context <span className="text-slate-400 text-xs">(optional)</span></label>
              <textarea
                value={moreDetails}
                onChange={(e) => setMoreDetails(e.target.value)}
                rows={4}
                placeholder="Any background information or extra details..."
                className="assert-input w-full resize-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3">
              <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-orange-700 font-medium">This will deduct <strong>5 AT Tokens</strong> from your balance.</p>
            </div>

            <button type="submit" className="btn-assert w-full justify-center py-2.5">
              Preview & Submit
            </button>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="assert-card p-7 max-w-sm w-full">
            <h2 className="text-base font-bold text-slate-800 mb-1">Confirm Your Query</h2>
            <p className="text-sm text-slate-500 mb-4">Review before posting.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm mb-4">
              <p><span className="font-semibold text-slate-700">Realm:</span> <span className="capitalize text-slate-600">{realm}</span></p>
              <p><span className="font-semibold text-slate-700">Query:</span> <span className="text-slate-600">{question}</span></p>
              {moreDetails && <p><span className="font-semibold text-slate-700">Details:</span> <span className="text-slate-600">{moreDetails}</span></p>}
            </div>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5">
              <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-orange-700 font-medium">5 AT Tokens will be deducted.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsPreviewModalOpen(false)} className="btn-assert-ghost flex-1 justify-center">Cancel</button>
              <button onClick={handleConfirmSubmit} className="btn-assert flex-1 justify-center">Confirm & Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isResultModalOpen && submittedQuery && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="assert-card p-7 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-1">Query Posted!</h2>
            <p className="text-sm text-slate-500 mb-4">Your query is live. Stay tuned for community responses.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-left space-y-1 mb-5">
              <p><span className="font-semibold text-slate-700">Realm:</span> <span className="capitalize text-slate-600">{submittedQuery.realm}</span></p>
              <p><span className="font-semibold text-slate-700">Query:</span> <span className="text-slate-600">{submittedQuery.question}</span></p>
            </div>
            <button onClick={() => setIsResultModalOpen(false)} className="btn-assert-ghost w-full justify-center">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuery;
