import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Slide, toast } from "react-toastify";
import { submitDebate } from "../../Services/createService.jsx";
import { useNavigate } from "react-router-dom";


export default function CreateDebate() {
  const { user } = useAuth();
  const [realm, setRealm] = useState("");
  const [question, setQuestion] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const modalId = "debate_modal";

  const navigate = useNavigate()

  const openConfirmationModal = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create debates!", {
        transition: Slide,
      });
      return;
    }

    if (!realm || !question) {
      toast.error("Realm and Question are required!");
      return;
    }

    document.getElementById(modalId).showModal();
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = {
        username: user.userName,
        realm,
        question,
        moreDetails,
        type: "debate",
        status: "approved",
      };

      const res = await submitDebate(formData);
      setSubmittedQuery(res.data);
      setShowPreview(true);
      setRealm("");
      setQuestion("");
      setMoreDetails("");
      document.getElementById(modalId).close();
      toast.success('Debate posted successfully')
      navigate('/thread')
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-6">Spark a Debate</h1>
        <form onSubmit={openConfirmationModal} className="space-y-6">
          <div>
            <label htmlFor="realm" className="block text-sm">Choose a Realm:</label>
            <select
              id="realm"
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a Realm</option>
              <option value="politics">Politics</option>
              <option value="technology">Technology</option>
              <option value="crypto">Crypto</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm">Your Question:</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="3"
              required
            />
          </div>

          <div>
            <label htmlFor="moreDetails" className="block text-sm">More Details (Optional):</label>
            <textarea
              id="moreDetails"
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#f17575] text-white rounded-md hover:bg-[#d96969]"
          >
            Submit
          </button>
        </form>
      </div>

      {/* ✅ Confirmation Modal */}
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Confirm Submission</h3>
          <p className="mb-4 text-red-600">This will deduct 5 AT Tokens.</p>
          <div className="modal-action">
            <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Confirm"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => document.getElementById(modalId).close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* ✅ Preview Modal */}
      {showPreview && submittedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">🔥 Let the Debate Begin!</h2>
            <div className="space-y-2">
              <p><strong>Realm:</strong> {submittedQuery.realm}</p>
              <p><strong>Question:</strong> {submittedQuery.question}</p>
              {submittedQuery.moreDetails && (
                <p><strong>Details:</strong> {submittedQuery.moreDetails}</p>
              )}
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => setShowPreview(false)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
