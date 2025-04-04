import React, { useState } from 'react';

import { useAuth } from "../../Context/AuthContext"; // Adjust the import path as needed

import { useNavigate } from "react-router-dom";

const CreateQuery = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Redirect to login page
  const [realm, setRealm] = useState('');
  const [question, setQuestion] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!realm || !question) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const formData = {
      username: user.userName, // logged in username
      realm,
      question,
      moreDetails,
      type: "query", // Explicitly setting type
      status: "pending", // Added status field
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        setSubmittedQuery(result.data);
        setIsModalOpen(true);
      } else {
        alert('There was an error submitting the query');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }

        // Clear form
    setRealm('');
    setQuestion('');
    setMoreDetails('');
  };

  // Close modal
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
