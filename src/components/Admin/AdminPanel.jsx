import React, { useState } from 'react';
import QueryApproval from './QueryApproval';
import ResultApproval from './ResultApproval';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('query'); // default to query

  return (
    <div className="h-screen p-4 bg-gray-50">
      {/* Buttons for toggling */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('query')}
          className={`px-4 py-2 rounded ${
            activeTab === 'query' ? 'btn btn-primary' : 'bg-gray-300'
          }`}
        >
          Poll/Prediction Approval
        </button>
        <button
          onClick={() => setActiveTab('result')}
          className={`px-4 py-2 rounded ${
            activeTab === 'result' ? 'btn btn-primary' : 'bg-gray-300'
          }`}
        >
          Result Approval
        </button>
      </div>

      {/* Content area */}
      <div className="bg-white p-4 rounded shadow h-[calc(100%-5rem)] overflow-auto">
        {activeTab === 'query' && <QueryApproval />}
        {activeTab === 'result' && <ResultApproval />}
      </div>
    </div>
  );
};

export default AdminPanel;
