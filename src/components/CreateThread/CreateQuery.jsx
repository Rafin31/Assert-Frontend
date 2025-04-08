import React, { useState } from 'react';
import { useAuth } from "../../Context/AuthContext"; // Adjust path as needed
import ServerApi from '../../api/ServerAPI'; // Axios instance
import { submitQuery } from "../../Services/createService.jsx";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const CreateQuery = () => {
  const { user } = useAuth();

  const [realm, setRealm] = useState('');
  const [question, setQuestion] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(null);

  const navigate = useNavigate()

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const handleFormPreview = (e) => {
    e.preventDefault();
    if (!realm || !question) {
      alert('Please fill out all required fields.');
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    const formData = {
      username: user.userName,
      realm,
      question,
      moreDetails,
      type: "query",
      status: "approved",
    };

    try {
      const response = await submitQuery(formData);
      const result = response.data;
      if (result) {
        setSubmittedQuery(result.data);
        setIsResultModalOpen(true);
        toast.success('Query posted successfully!');
        navigate('/thread')
      } else {
        toast.error('There was an error submitting the query.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }

    setIsPreviewModalOpen(false);
    setRealm('');
    setQuestion('');
    setMoreDetails('');
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-6">Ask a Question, Get Answers</h1>
        <form onSubmit={handleFormPreview} className="space-y-6">
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
            Preview and Submit
          </button>
        </form>
      </div>

      {/* Preview Confirmation Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Your Query</h2>
            <p className="mb-4 text-red-600">This will deduct 5 AT Tokens.</p>
            <div className="p-4 border border-gray-300 rounded-md space-y-2">
              <p><strong>Realm:</strong> {realm}</p>
              <p><strong>Query:</strong> {question}</p>
              {moreDetails && <p><strong>More Details:</strong> {moreDetails}</p>}

            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setIsPreviewModalOpen(false)} className="p-2 px-4 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleConfirmSubmit} className="cursor-pointer p-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {isResultModalOpen && submittedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Stay tuned for responses!</h2>
            <div className="p-4 border border-gray-300 rounded-md">
              <p><strong>Realm:</strong> {submittedQuery.realm.charAt(0).toUpperCase() + submittedQuery.realm.slice(1)}</p>
              <p><strong>Query:</strong> {submittedQuery.question}</p>
              {submittedQuery.moreDetails && <p><strong>More Details:</strong> {submittedQuery.moreDetails}</p>}

            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsResultModalOpen(false)}
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
