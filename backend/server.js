// ==========================
// Employee Attendance Tracker Backend
// ==========================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==========================
// Database Setup (SQLite)
// ==========================
const dbPath = path.join(__dirname, 'attendance.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');

    // --- Create users table ---
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    // --- Create employees table ---
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT,
        department TEXT
      )
    `);

    // --- Create attendance table ---
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeName TEXT,
        employeeID TEXT,
        date TEXT,
        status TEXT
      )
    `);

    // --- Insert dummy users if empty ---
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (row && row.count === 0) {
        db.run(`INSERT INTO users (name, email, password) VALUES 
          ('Marcelo', 'marcelo@test.com', '12345'),
          ('Lenna Tefo', 'lenna@test.com', '12345')
        `);
      }
    });

    // --- Insert dummy employees if empty ---
    db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
      if (row && row.count === 0) {
        db.run(`INSERT INTO employees (name, position, department) VALUES 
          ('John Doe', 'Manager', 'HR'),
          ('Jane Smith', 'Developer', 'IT')
        `);
      }
    });
  }
});

// ==========================
// API ROUTES
// ==========================

// Add attendance record
app.post('/attendance', (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO attendance (employeeName, employeeID, date, status)
               VALUES (?, ?, ?, ?)`;
  db.run(sql, [employeeName, employeeID, date, status], function (err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'Attendance added successfully', id: this.lastID });
    }
  });
});

// Retrieve all attendance records
app.get('/attendance', (req, res) => {
  const sql = `SELECT * FROM attendance ORDER BY date DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

// Filter attendance by date
app.get('/attendance/filter', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const sql = `SELECT * FROM attendance WHERE date = ? ORDER BY date DESC`;
  db.all(sql, [date], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Search attendance by employee name or ID
app.get('/attendance/search', (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Search query is required' });

  const sql = `
    SELECT * FROM attendance
    WHERE employeeName LIKE ? OR employeeID LIKE ?
    ORDER BY date DESC
  `;
  const likeQuery = `%${query}%`;
  db.all(sql, [likeQuery, likeQuery], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Delete an attendance record
app.delete('/attendance/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM attendance WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete record' });
    res.json({ message: 'Record deleted successfully' });
  });
});

// List all users (optional)
app.get('/users', (req, res) => {
  const sql = `SELECT id, name, email FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ==========================
// SERVE REACT BUILD IN PRODUCTION
// ==========================
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ==========================
// Start the server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});