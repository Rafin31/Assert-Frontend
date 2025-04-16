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

const CreatePoll = () => {
  const { user } = useAuth();
  const [realm, setRealm] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ name: '', votes: 0 }]);
  const [submittedPoll, setSubmittedPoll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!realm || !question) {
      alert("Realm and Question are required.");
      return;
    }

    const validOptions = options.filter(opt => opt.name.trim() !== '');
    if (validOptions.length < 2) {
      alert("At least two valid options are required.");
      return;
    }

    const pollData = {
      username: user.userName,
      email: user.email,
      realm,
      category,
      subcategory,
      question,
      outcome: validOptions.map(opt => ({ name: opt.name.trim(), votes: 0 })),
    };

    try {
      setLoading(true);
      const response = await ServerApi.post('userPoll/submit', pollData);
      const result = response.data;

      if (result.success) {
        setSubmittedPoll(result.data);
        setIsModalOpen(true);
        resetForm();
      } else {
        alert('There was an error submitting your poll.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRealm('');
    setCategory('');
    setSubcategory('');
    setQuestion('');
    setOptions([{ name: '', votes: 0 }]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addOption = () => setOptions([...options, { name: '', votes: 0 }]);

  const removeOption = (index) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index].name = value;
    setOptions(updated);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-6">Create Poll</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Realm */}
          <div>
            <label className="block text-sm text-gray-700">Choose a Realm:</label>
            <select
              value={realm}
              onChange={(e) => {
                setRealm(e.target.value);
                setCategory('');
                setSubcategory('');
              }}
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

          {/* Category */}
          {realm === "sports" && (
            <div>
              <label className="block text-sm text-gray-700">Choose a Category:</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select a Category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Subcategory */}
          {category && categories[category]?.length > 0 && (
            <div>
              <label className="block text-sm text-gray-700">Choose a Subcategory (Optional):</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">None</option>
                {categories[category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Question */}
          <div>
            <label className="block text-sm text-gray-700">Poll Question:</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="3"
              placeholder="Type your question..."
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Outcome Options */}
          <div>
            <label className="block text-sm text-gray-700">Options:</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="p-2 bg-red-400 text-white text-sm rounded-md"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="btn btn-active mt-2"
            >
              Add Option
            </button>
          </div>

          <button
            type="submit"
            className={`w-full p-3 ${loading ? 'bg-gray-400' : 'bg-[#f17575]'} text-white rounded-md hover:bg-[#d96969]`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Poll"}
          </button>
        </form>
      </div>

      {isModalOpen && submittedPoll && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Submitted Poll</h2>
            <div className="flex justify-center items-center">
              <OutcomePoll data={[submittedPoll]} from={'create'} />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="p-2 bg-gray-300 rounded-md text-sm text-gray-800 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
