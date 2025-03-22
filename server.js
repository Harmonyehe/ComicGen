// COMITALE - Comic Creator Server
// This is a simplified server based on run.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'comitale-comic-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

// Parse JSON bodies
app.use(express.json());

// Serve static assets
app.use(express.static('public'));

// In-memory data storage
const storage = {
  users: [],
  comics: [],
  characters: [],
  pages: []
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'COMITALE server is running' });
});

// Register endpoint
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = storage.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      createdAt: new Date()
    };
    
    storage.users.push(newUser);
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = storage.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set user session
    req.session.userId = user.id;
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user endpoint
app.get('/api/users/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = storage.users.find(u => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email
  });
});

// Logout endpoint
app.post('/api/users/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Create comic endpoint
app.post('/api/comics', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { title, description, format, artStyle } = req.body;
  
  const newComic = {
    id: uuidv4(),
    userId: req.session.userId,
    title,
    description,
    format,
    artStyle,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  storage.comics.push(newComic);
  
  res.status(201).json(newComic);
});

// Get user's comics endpoint
app.get('/api/comics', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const userComics = storage.comics.filter(comic => comic.userId === req.session.userId);
  
  res.json(userComics);
});

// Server startup
app.listen(PORT, '0.0.0.0', () => {
  console.log(`COMITALE server running on http://0.0.0.0:${PORT}`);
});