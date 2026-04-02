const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Railway 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));







// const express = require('express');
// const { Pool } = require('pg');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// // Database connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Create table on startup
// const initDB = async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(255) NOT NULL,
//       done BOOLEAN DEFAULT FALSE,
//       created_at TIMESTAMP DEFAULT NOW()
//     )
//   `);
//   console.log('Database initialized');
// };

// // ───── ROUTES ─────

// // GET all tasks
// app.get('/tasks', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch tasks' });
//   }
// });

// // GET single task
// app.get('/tasks/:id', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
//     if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch task' });
//   }
// });

// // POST create a task
// app.post('/tasks', async (req, res) => {
//   const { title } = req.body;
//   if (!title) return res.status(400).json({ error: 'Title is required' });
//   try {
//     const result = await pool.query(
//       'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
//       [title]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create task' });
//   }
// });

// // PUT update a task
// app.put('/tasks/:id', async (req, res) => {
//   const { title, done } = req.body;
//   try {
//     const result = await pool.query(
//       'UPDATE tasks SET title = COALESCE($1, title), done = COALESCE($2, done) WHERE id = $3 RETURNING *',
//       [title, done, req.params.id]
//     );
//     if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update task' });
//   }
// });

// // DELETE a task
// app.delete('/tasks/:id', async (req, res) => {
//   try {
//     const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [req.params.id]);
//     if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
//     res.json({ message: 'Task deleted', task: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete task' });
//   }
// });

// // Home route
// app.get('/', (req, res) => {
//   res.json({ message: 'Railway Tasks API is running!' });
// });

// // ───── START SERVER ─────
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, async () => {
//   await initDB();
//   console.log(`Server running on port ${PORT}`);
// });