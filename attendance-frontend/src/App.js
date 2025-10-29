import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceForm from './AttendanceForm';
import AttendanceDashboard from './AttendanceDashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">🏢 Employee Attendance Tracker</h1>
          
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
              >
                📝 Mark Attendance
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                📊 View Records
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'form' && (
              <div className="tab-pane fade show active">
                <AttendanceForm onSuccess={() => setActiveTab('dashboard')} />
              </div>
            )}
            {activeTab === 'dashboard' && (
              <div className="tab-pane fade show active">
                <AttendanceDashboard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;