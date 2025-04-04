import React, { useState } from 'react';
import { useAuth } from "../../Context/AuthContext"; // Adjust path as needed
import ServerApi from '../../api/ServerAPI'; // Axios instance

const CreateQuery = () => {
  const { user } = useAuth();

  const [realm, setRealm] = useState('');
  const [question, setQuestion] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!realm || !question) {
      alert('Please fill out all required fields.');
      return;
    }

    const formData = {
      username: user.userName,
      realm,
      question,
      moreDetails,
      type: "query",      // Explicitly set type
      status: "approved", // Set default status
    };

    try {
      const response = await ServerApi.post('/form/submit', formData);
      const result = response.data;

      if (result.success) {
        setSubmittedQuery(result.data);
        setIsModalOpen(true);
      } else {
        alert('There was an error submitting the query.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }

    // Clear form fields
    setRealm('');
    setQuestion('');
    setMoreDetails('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-6">Ask a Question, Get Answers</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Realm Selection */}
          <div>
            <label htmlFor="realm" className="block text-sm text-gray-700">Choose a Realm:</label>
            <select
              id="realm"
              name="realm"
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

          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-sm text-gray-700">Your Query:</label>
            <textarea
              id="question"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows="3"
              placeholder="Type your query here..."
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          {/* More Details Input */}
          <div>
            <label htmlFor="moreDetails" className="block text-sm text-gray-700">More Details (Optional):</label>
            <textarea
              id="moreDetails"
              name="moreDetails"
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
              rows="4"
              placeholder="Provide any additional context or details..."
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <button type="submit" className="w-full p-3 bg-[#f17575] text-white rounded-md hover:bg-[#d96969] cursor-pointer">
            Submit Query
          </button>
        </form>
      </div>

      {/* Modal for Submitted Query */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Stay tuned for responses!</h2>
            <div className="p-4 border border-gray-300 rounded-md">
              <p><strong>Realm:</strong> {submittedQuery.realm.charAt(0).toUpperCase() + submittedQuery.realm.slice(1)}</p>
              <p><strong>Query:</strong> {submittedQuery.question}</p>
              {submittedQuery.moreDetails && (
                <p><strong>More Details:</strong> {submittedQuery.moreDetails}</p>
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="p-2 btn cursor-pointer"
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

export default CreateQuery;
