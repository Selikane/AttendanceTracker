const express = require('express'); 
const app = express(); 
const PORT = process.env.PORT || 10000; 
 
app.get('/', (req, res) => { 
  res.send(` 
<!DOCTYPE html> 
<html lang="en"> 
<head> 
  <meta charset="UTF-8"> 
  <title>Attendance Tracker</title> 
  <style> 
    body { font-family: Arial, sans-serif; margin: 40px; background: #f9f9f9; } 
    input, button { padding: 10px; font-size: 16px; } 
    button { background: #007bff; color: white; border: none; cursor: pointer; margin-left: 10px; } 
    button:hover { background: #0056b3; } 
    ul { margin-top: 20px; padding-left: 20px; } 
    li { margin: 5px 0; } 
  </style> 
</head> 
<body> 
  <h1>Attendance Tracker</h1> 
  <input id="name" placeholder="Enter your name"> 
  <button onclick="markAttendance()">Mark Attendance</button> 
  <h2>Attendees Today:</h2> 
  <ul id="list"></ul> 
 
  <script> 
    let attendees = JSON.parse(localStorage.getItem('attendees') || '[]'); 
 
    function markAttendance() { 
      const name = document.getElementById('name').value.trim(); 
      if (name) { 
        attendees.push(name); 
        localStorage.setItem('attendees', JSON.stringify(attendees)); 
        const li = document.createElement('li'); 
        li.textContent = name; 
        document.getElementById('list').appendChild(li); 
        document.getElementById('name').value = ''; 
      } 
    } 
 
    // Load saved attendees on page load 
    attendees.forEach(name => { 
      const li = document.createElement('li'); 
      li.textContent = name; 
      document.getElementById('list').appendChild(li); 
    }); 
  </script> 
</body></html>`); 
}); 
 
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Server running on port ${PORT}`); 
}); 
