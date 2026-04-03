require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// =====================
// AUTH ROUTES
// =====================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).send("Name and password required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(name, password) VALUES($1,$2) RETURNING id, name",
      [name, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// Login
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE name=$1",
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// =====================
// AUTH MIDDLEWARE
// =====================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("No token");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "secret"
    );
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};


// =====================
// PROTECTED ROUTE
// =====================

app.get("/protected", authMiddleware, (req, res) => {
  res.send("You are authenticated!");
});


// =====================
// CRUD ROUTES (USERS)
// =====================

// CREATE
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// READ
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.send("User deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// =====================
// SERVER START
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
