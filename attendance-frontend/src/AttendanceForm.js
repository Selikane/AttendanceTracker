import React, { useState } from 'react';
import axios from 'axios';

function AttendanceForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    
    if (!formData.employeeID.trim()) {
      newErrors.employeeID = 'Employee ID is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(
  `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/attendance`,
  formData
);
      alert('✅ Attendance recorded successfully!');
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      
      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error submitting attendance:', err);
      alert('❌ Failed to record attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card attendance-card">
      <div className="card-header">
        <h5 className="mb-0">Mark Employee Attendance</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="employeeName" className="form-label">
                Employee Name *
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                placeholder="Enter full name"
                value={formData.employeeName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.employeeName && (
                <div className="invalid-feedback">{errors.employeeName}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="employeeID" className="form-label">
                Employee ID *
              </label>
              <input
                type="text"
                id="employeeID"
                name="employeeID"
                className={`form-control ${errors.employeeID ? 'is-invalid' : ''}`}
                placeholder="Enter employee ID"
                value={formData.employeeID}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.employeeID && (
                <div className="invalid-feedback">{errors.employeeID}</div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="status" className="form-label">
                Attendance Status *
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Present">✅ Present</option>
                <option value="Absent">❌ Absent</option>
              </select>
            </div>
          </div>

          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                '📝 Submit Attendance'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceForm;