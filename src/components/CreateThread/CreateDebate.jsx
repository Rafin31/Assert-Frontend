import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Slide, toast } from "react-toastify";
import { submitDebate } from "../../Services/createService.jsx";
import { useNavigate } from "react-router-dom";

const REALMS = ["politics", "technology", "crypto", "sports"];

export default function CreateDebate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realm, setRealm] = useState("");
  const [question, setQuestion] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const modalId = "debate_modal";

  const openConfirmationModal = (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to create debates!", { transition: Slide });
    if (!realm || !question) return toast.error("Realm and Question are required!");
    document.getElementById(modalId).showModal();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitDebate({
        username: user.userName, email: user.email,
        realm, question, moreDetails,
        type: "debate", status: "approved",
      });
      setRealm(""); setQuestion(""); setMoreDetails("");
      document.getElementById(modalId).close();
      toast.success('Debate posted successfully!', { theme: "light" });
      navigate('/thread');
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center py-10 px-4" style={{ background: 'var(--assert-bg)' }}>
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Spark a Debate</h1>
          <p className="text-slate-500 text-sm mt-1">Post a question to start a community discussion. Costs 5 AT tokens.</p>
        </div>

        <div className="assert-card p-7">
          <form onSubmit={openConfirmationModal} className="space-y-5">
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
              <label className="form-label">Your Question <span className="text-red-500">*</span></label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="What should the community debate?"
                className="assert-input w-full resize-none"
                required
              />
            </div>

            <div>
              <label className="form-label">Additional Details <span className="text-slate-400 text-xs">(optional)</span></label>
              <textarea
                value={moreDetails}
                onChange={(e) => setMoreDetails(e.target.value)}
                rows={4}
                placeholder="Provide context, background, or specific points to discuss..."
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

      {/* Confirmation Modal */}
      <dialog id={modalId} className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box rounded-2xl max-w-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-1">Confirm Submission</h3>
          <p className="text-sm text-slate-500 mb-4">Review your debate before posting.</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm mb-4">
            <p><span className="font-semibold text-slate-700">Realm:</span> <span className="capitalize text-slate-600">{realm}</span></p>
            <p><span className="font-semibold text-slate-700">Question:</span> <span className="text-slate-600">{question}</span></p>
            {moreDetails && <p><span className="font-semibold text-slate-700">Details:</span> <span className="text-slate-600">{moreDetails}</span></p>}
          </div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-orange-700 font-medium">5 AT Tokens will be deducted.</p>
          </div>
          <div className="modal-action mt-0 gap-2">
            <form method="dialog">
              <button className="btn-assert-ghost">Cancel</button>
            </form>
            <button className="btn-assert py-2 px-5" onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Confirm & Post"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
