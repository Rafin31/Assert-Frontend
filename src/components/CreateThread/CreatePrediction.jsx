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

const CreatePrediction = () => {
  const { user } = useAuth();
  const [realm, setRealm] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [question, setQuestion] = useState('');
  const [submittedPrediction, setSubmittedPrediction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 🔧 Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!realm || !question) {
      alert('Please fill out all required fields.');
      return;
    }

    const formData = {
      username: user.userName,
      email: user.email,
      realm,
      category,
      subcategory,
      question,
    };

    try {
      setLoading(true); // 🔧 Start loading
      const response = await ServerApi.post('userPrediction/submit', formData);
      const result = response.data;

      if (result.success) {
        setSubmittedPrediction(result.data);
        setIsModalOpen(true);
      } else {
        alert('There was an error submitting the query.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // 🔧 Stop loading
      setRealm('');
      setQuestion('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

    return (
        <div className="flex flex-col items-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-semibold mb-6">Create Prediction</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="realm" className="block text-sm text-gray-700">Choose a Realm:</label>
                        <select
                            id="realm"
                            name="realm"
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

                    {realm === "sports" && (
                        <div>
                            <label htmlFor="category" className="block text-sm text-gray-700">Choose a Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubcategory('');
                                }}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select a Category</option>
                                {Object.keys(categories).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {category && categories[category].length > 0 && (
                        <div>
                            <label htmlFor="subcategory" className="block text-sm text-gray-700">Choose a Subcategory (Optional):</label>
                            <select
                                id="subcategory"
                                name="subcategory"
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

                    <div>
                        <label htmlFor="question" className="block text-sm text-gray-700">Your Prediction Question:</label>
                        <textarea
                            id="question"
                            name="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows="4"
                            placeholder="Type your question here..."
                            className="w-full p-3 border border-gray-300 rounded-md"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 ${loading ? 'bg-gray-400' : 'bg-[#f17575]'} text-white rounded-md hover:bg-[#d96969] cursor-pointer`}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Prediction"}
                    </button>
                </form>
            </div>

            {isModalOpen && submittedPrediction && (
                <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">Submitted Prediction for Review</h2>
                        <div className="flex justify-center">
                            <PollCard
                                question={submittedPrediction.question}
                                yesVotes={0}
                                noVotes={0}
                                realm={submittedPrediction.realm.charAt(0).toUpperCase() + submittedPrediction.realm.slice(1)}
                                category={submittedPrediction.category}
                                subcategory={submittedPrediction.subcategory}
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                onClick={closeModal}
                                className="p-2 bg-gray-300 rounded-md text-sm text-gray-800 hover:bg-gray-400 cursor-pointer"
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

export default CreatePrediction;
