import React, { useState } from 'react';
import QueryApproval from './QueryApproval';
import ResultApproval from './ResultApproval';

const tabs = [
  {
    key: 'query',
    label: 'Poll / Prediction Approval',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'result',
    label: 'Result Approval',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('query');

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--assert-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage predictions, polls and match results.</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="assert-card p-5 min-h-[60vh] overflow-auto">
          {activeTab === 'query' && <QueryApproval />}
          {activeTab === 'result' && <ResultApproval />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
