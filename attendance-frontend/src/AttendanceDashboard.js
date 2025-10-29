import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceDashboard() {
  const [records, setRecords] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
  `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/attendance`
);
    setRecords(res.data);
  };

  const deleteRecord = async (id) => {
    if (window.confirm('Delete this record?')) {
      await axios.delete(`http://localhost:5000/attendance/${id}`);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h4>Attendance Records</h4>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.employeeName}</td>
              <td>{rec.employeeID}</td>
              <td>{rec.date}</td>
              <td>{rec.status}</td>
              <td>
                <button
                  onClick={() => deleteRecord(rec.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No attendance records yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceDashboard;
