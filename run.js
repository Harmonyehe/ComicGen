// COMITALE - Comic Creator Server
// This is a simplified server that handles basic API requests and serves static files
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

// Check if the public directory exists, if not create it
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create index.html if it doesn't exist
const createIndexHtml = () => {
  const indexPath = path.join(publicDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>COMITALE - Comic Creator</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 8px 8px 0 #000;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "POW!";
          position: absolute;
          top: -20px;
          right: -20px;
          background-color: #ffff00;
          color: #ff0000;
          padding: 1rem;
          transform: rotate(15deg);
          font-weight: bold;
          border: 3px solid #000;
          border-radius: 50%;
          box-shadow: 4px 4px 0 #000;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #e951ff;
        }
        .search-bar {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        .search-bar input {
          width: 70%;
          padding: 1rem;
          font-size: 1.2rem;
          border: 3px solid #000;
          border-radius: 8px 0 0 8px;
        }
        .search-bar button {
          padding: 1rem 2rem;
          background-color: #e951ff;
          color: white;
          font-size: 1.2rem;
          border: 3px solid #000;
          border-left: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .search-bar button:hover {
          background-color: #d33deb;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        .feature-card {
          background-color: white;
          border: 3px solid #000;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 5px 5px 0 #000;
          transform: rotate(-1deg);
          transition: transform 0.3s;
        }
        .feature-card:nth-child(2) {
          transform: rotate(1deg);
        }
        .feature-card:nth-child(3) {
          transform: rotate(-0.5deg);
        }
        .feature-card:hover {
          transform: rotate(0) scale(1.03);
        }
        .feature-card h3 {
          color: #e951ff;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .auth-links {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        .auth-links a {
          display: inline-block;
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          background-color: white;
          color: #e951ff;
          text-decoration: none;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.2s;
        }
        .auth-links a:hover {
          transform: translateY(-2px);
          box-shadow: 3px 3px 0 #000;
        }
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          .search-bar {
            flex-direction: column;
            align-items: center;
          }
          .search-bar input,
          .search-bar button {
            width: 100%;
            border-radius: 8px;
            border: 3px solid #000;
            margin-bottom: 1rem;
          }
          .auth-links {
            position: static;
            margin-top: 1rem;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
        <div class="auth-links">
          <a href="/login.html">Login</a>
          <a href="/register.html">Register</a>
        </div>
      </header>
      <main>
        <section class="hero">
          <h1>Create Amazing Comics!</h1>
          <p>Generate stunning comic strips with our innovative platform. Choose your style, create characters, and unleash your creativity!</p>
          <div class="search-bar">
            <input type="text" placeholder="Enter a title for your new comic...">
            <button>Create Comic</button>
          </div>
        </section>
        <section class="features">
          <div class="feature-card">
            <h3>Multiple Formats</h3>
            <p>Create comics in Webtoon, Manga, Instagram, or Classic formats to fit your storytelling style.</p>
          </div>
          <div class="feature-card">
            <h3>Character Creation</h3>
            <p>Generate unique characters or upload your own images. Customize every detail!</p>
          </div>
          <div class="feature-card">
            <h3>Art Styles</h3>
            <p>Choose from various art styles to make your comic truly unique and visually stunning.</p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        document.querySelector('.search-bar button').addEventListener('click', () => {
          const title = document.querySelector('.search-bar input').value.trim();
          if (title) {
            alert('Coming soon: Comic creation with title "' + title + '"');
          } else {
            alert('Please enter a title for your comic');
          }
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(indexPath, htmlContent);
    console.log('Created index.html');
  }
};

// Create login.html if it doesn't exist
const createLoginHtml = () => {
  const loginPath = path.join(publicDir, 'login.html');
  
  if (!fs.existsSync(loginPath)) {
    // Check if login.html already exists in the public directory
    const loginHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - COMITALE</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .login-form {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 8px 8px 0 #000;
          position: relative;
        }
        .login-form h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #e951ff;
        }
        .form-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 3px solid #000;
          border-radius: 8px;
          box-sizing: border-box;
        }
        button {
          padding: 1rem 2rem;
          background-color: #e951ff;
          color: white;
          font-size: 1.2rem;
          border: 3px solid #000;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
          font-weight: bold;
          margin-top: 1rem;
        }
        button:hover {
          background-color: #d33deb;
        }
        .register-link {
          margin-top: 1.5rem;
        }
        .register-link a {
          color: #e951ff;
          text-decoration: none;
          font-weight: bold;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .back-link {
          margin-top: 2rem;
          text-align: center;
        }
        .back-link a {
          color: #e951ff;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
      </header>
      <main>
        <form class="login-form">
          <h1>Login</h1>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter your password">
          </div>
          <button type="submit">Login</button>
          <div class="register-link">
            <p>Don't have an account? <a href="/register.html">Register</a></p>
          </div>
        </form>
        <div class="back-link">
          <a href="/">&larr; Back to Home</a>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        document.querySelector('.login-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
            const response = await fetch('/api/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
            
            if (response.ok) {
              alert('Login successful!');
              window.location.href = '/';
            } else {
              const data = await response.json();
              alert(\`Login failed: \${data.error || 'Invalid credentials'}\`);
            }
          } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
          }
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(loginPath, loginHtml);
    console.log('Created login.html');
  }
};

// Create register.html if it doesn't exist
const createRegisterHtml = () => {
  const registerPath = path.join(publicDir, 'register.html');
  
  if (!fs.existsSync(registerPath)) {
    // Check if register.html already exists in the public directory
    const registerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register - COMITALE</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .register-form {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 8px 8px 0 #000;
          position: relative;
          overflow: hidden;
        }
        .register-form::before {
          content: "NEW!";
          position: absolute;
          top: -10px;
          right: -30px;
          background-color: #ffff00;
          color: #ff0000;
          padding: 0.5rem 2.5rem;
          transform: rotate(45deg);
          font-weight: bold;
          font-size: 0.8rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .register-form h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #e951ff;
        }
        .form-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 3px solid #000;
          border-radius: 8px;
          box-sizing: border-box;
        }
        button {
          padding: 1rem 2rem;
          background-color: #e951ff;
          color: white;
          font-size: 1.2rem;
          border: 3px solid #000;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
          font-weight: bold;
          margin-top: 1rem;
        }
        button:hover {
          background-color: #d33deb;
        }
        .login-link {
          margin-top: 1.5rem;
        }
        .login-link a {
          color: #e951ff;
          text-decoration: none;
          font-weight: bold;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .back-link {
          margin-top: 2rem;
          text-align: center;
        }
        .back-link a {
          color: #e951ff;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
        .error-message {
          color: #ff0000;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          text-align: left;
          display: none;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
      </header>
      <main>
        <form class="register-form">
          <h1>Register</h1>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required placeholder="Choose a username">
            <div id="username-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="Enter your email">
            <div id="email-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Create a password">
            <div id="password-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
            <div id="confirmPassword-error" class="error-message"></div>
          </div>
          <button type="submit">Create Account</button>
          <div class="login-link">
            <p>Already have an account? <a href="/login.html">Login</a></p>
          </div>
        </form>
        <div class="back-link">
          <a href="/">&larr; Back to Home</a>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        document.querySelector('.register-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // Reset error messages
          document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
          });
          
          const username = document.getElementById('username').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          
          // Simple validation
          let isValid = true;
          
          if (username.length < 3) {
            document.getElementById('username-error').textContent = 'Username must be at least 3 characters';
            document.getElementById('username-error').style.display = 'block';
            isValid = false;
          }
          
          if (!email.includes('@')) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            document.getElementById('email-error').style.display = 'block';
            isValid = false;
          }
          
          if (password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            document.getElementById('password-error').style.display = 'block';
            isValid = false;
          }
          
          if (password !== confirmPassword) {
            document.getElementById('confirmPassword-error').textContent = 'Passwords do not match';
            document.getElementById('confirmPassword-error').style.display = 'block';
            isValid = false;
          }
          
          if (!isValid) return;
          
          try {
            const response = await fetch('/api/users/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password }),
            });
            
            if (response.ok) {
              alert('Registration successful! Please log in.');
              window.location.href = '/login.html';
            } else {
              const data = await response.json();
              if (data.error) {
                alert(\`Registration failed: \${data.error}\`);
              } else {
                alert('Registration failed. Please try again.');
              }
            }
          } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
          }
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(registerPath, registerHtml);
    console.log('Created register.html');
  }
};

// Create all necessary HTML files
createIndexHtml();
createLoginHtml();
createRegisterHtml();

// API Routes

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = storage.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create new user
    const id = uuidv4();
    const user = {
      id,
      username,
      email,
      passwordHash,
      createdAt: new Date()
    };
    
    storage.users.push(user);
    
    // Don't send passwordHash in response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = storage.users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.userId = user.id;
    
    // Don't send passwordHash in response
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// User Logout
app.post('/api/users/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Get Current User
app.get('/api/users/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const user = storage.users.find(user => user.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { passwordHash: _, ...userWithoutPassword } = user;
  return res.status(200).json(userWithoutPassword);
});

// Create Comic
app.post('/api/comics', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const { title, description, format, artStyle } = req.body;
    
    // Basic validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!format || !['webtoon', 'manga', 'instagram', 'classic'].includes(format)) {
      return res.status(400).json({ error: 'Valid format is required' });
    }
    
    if (!artStyle) {
      return res.status(400).json({ error: 'Art style is required' });
    }
    
    // Create comic
    const id = uuidv4();
    const comic = {
      id,
      userId: req.session.userId,
      title,
      description: description || '',
      format,
      artStyle,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    storage.comics.push(comic);
    
    return res.status(201).json(comic);
  } catch (error) {
    console.error('Create comic error:', error);
    return res.status(500).json({ error: 'Server error while creating comic' });
  }
});

// Get User's Comics
app.get('/api/comics', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const comics = storage.comics.filter(comic => comic.userId === req.session.userId);
  return res.status(200).json(comics);
});

// Get a specific comic by ID
app.get('/api/comics/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const comic = storage.comics.find(c => c.id === id && c.userId === userId);
  
  if (!comic) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  res.json(comic);
});

// Update a comic
app.patch('/api/comics/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { title, description, format, artStyle } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comicIndex = storage.comics.findIndex(c => c.id === id && c.userId === userId);
  
  if (comicIndex === -1) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  // Update comic
  storage.comics[comicIndex] = {
    ...storage.comics[comicIndex],
    ...(title && { title }),
    ...(description && { description }),
    ...(format && { format }),
    ...(artStyle && { artStyle }),
    updatedAt: new Date()
  };
  
  res.json(storage.comics[comicIndex]);
});

// Delete a comic
app.delete('/api/comics/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comicIndex = storage.comics.findIndex(c => c.id === id && c.userId === userId);
  
  if (comicIndex === -1) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  // Delete comic
  const deletedComic = storage.comics.splice(comicIndex, 1)[0];
  
  // Also delete associated characters and pages
  storage.characters = storage.characters.filter(c => c.comicId !== id);
  storage.pages = storage.pages.filter(p => p.comicId !== id);
  
  res.json({ message: 'Comic deleted successfully', id: deletedComic.id });
});

// Add a character to a comic
app.post('/api/comics/:id/characters', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { name, imageUrl, description, isGenerated } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comic = storage.comics.find(c => c.id === id && c.userId === userId);
  
  if (!comic) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  const newCharacter = {
    id: uuidv4(),
    comicId: id,
    name,
    imageUrl,
    description,
    isGenerated: isGenerated || false,
    createdAt: new Date()
  };
  
  storage.characters.push(newCharacter);
  
  res.status(201).json(newCharacter);
});

// Get characters for a comic
app.get('/api/comics/:id/characters', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comic = storage.comics.find(c => c.id === id && c.userId === userId);
  
  if (!comic) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  const characters = storage.characters.filter(c => c.comicId === id);
  
  res.json(characters);
});

// Add a page to a comic
app.post('/api/comics/:id/pages', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { pageNumber, content } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comic = storage.comics.find(c => c.id === id && c.userId === userId);
  
  if (!comic) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  const newPage = {
    id: uuidv4(),
    comicId: id,
    pageNumber,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  storage.pages.push(newPage);
  
  res.status(201).json(newPage);
});

// Get pages for a comic
app.get('/api/comics/:id/pages', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const comic = storage.comics.find(c => c.id === id && c.userId === userId);
  
  if (!comic) {
    return res.status(404).json({ error: 'Comic not found' });
  }
  
  const pages = storage.pages.filter(p => p.comicId === id);
  
  res.json(pages);
});

// Update a page
app.patch('/api/pages/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  const { content, pageNumber } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const page = storage.pages.find(p => p.id === id);
  
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const comic = storage.comics.find(c => c.id === page.comicId && c.userId === userId);
  
  if (!comic) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Update page
  const pageIndex = storage.pages.findIndex(p => p.id === id);
  storage.pages[pageIndex] = {
    ...page,
    ...(content && { content }),
    ...(pageNumber && { pageNumber }),
    updatedAt: new Date()
  };
  
  res.json(storage.pages[pageIndex]);
});

// Delete a page
app.delete('/api/pages/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const page = storage.pages.find(p => p.id === id);
  
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }
  
  const comic = storage.comics.find(c => c.id === page.comicId && c.userId === userId);
  
  if (!comic) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Delete page
  const pageIndex = storage.pages.findIndex(p => p.id === id);
  const deletedPage = storage.pages.splice(pageIndex, 1)[0];
  
  res.json({ message: 'Page deleted successfully', id: deletedPage.id });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'COMITALE server is running!' });
});

// Create a comic creation page
const createComicPage = () => {
  const createComicPath = path.join(publicDir, 'create-comic.html');
  
  if (!fs.existsSync(createComicPath)) {
    const createComicHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Create Comic - COMITALE</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .create-form {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 8px 8px 0 #000;
          position: relative;
        }
        .create-form h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #e951ff;
          text-align: center;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }
        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 3px solid #000;
          border-radius: 8px;
          box-sizing: border-box;
          font-family: inherit;
        }
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        .format-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .format-option {
          border: 3px solid #000;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .format-option.selected {
          background-color: #f8e6ff;
          border-color: #e951ff;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }
        .format-option h3 {
          margin-top: 0;
          color: #e951ff;
        }
        .format-option .icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .art-styles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .art-style {
          border: 3px solid #000;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .art-style.selected {
          background-color: #f8e6ff;
          border-color: #e951ff;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }
        .art-style h4 {
          margin-top: 0;
          color: #e951ff;
        }
        button {
          padding: 1rem 2rem;
          background-color: #e951ff;
          color: white;
          font-size: 1.2rem;
          border: 3px solid #000;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          width: 100%;
          font-weight: bold;
          margin-top: 1rem;
        }
        button:hover {
          background-color: #d33deb;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .nav-links {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        .nav-links a {
          display: inline-block;
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          background-color: white;
          color: #e951ff;
          text-decoration: none;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.2s;
        }
        .nav-links a:hover {
          transform: translateY(-2px);
          box-shadow: 3px 3px 0 #000;
        }
        .error-message {
          color: #ff0000;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          display: none;
        }
        @media (max-width: 768px) {
          .format-options, .art-styles {
            grid-template-columns: 1fr;
          }
          .nav-links {
            position: static;
            margin-top: 1rem;
            text-align: center;
          }
          .create-form h1 {
            font-size: 2rem;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/login.html" id="loginLink">Login</a>
          <span id="userControls" style="display: none;">
            <a href="/api/users/logout" id="logoutLink">Logout</a>
          </span>
        </div>
      </header>
      <main>
        <form class="create-form">
          <h1>Create Your Comic</h1>
          <div class="form-group">
            <label for="title">Comic Title</label>
            <input type="text" id="title" name="title" required placeholder="Enter a title for your comic">
            <div id="title-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" placeholder="Describe your comic (optional)"></textarea>
          </div>
          <div class="form-group">
            <label>Comic Format</label>
            <input type="hidden" id="format" name="format" value="">
            <div class="format-options">
              <div class="format-option" data-format="webtoon">
                <div class="icon">📱</div>
                <h3>Webtoon</h3>
                <p>Vertical scrolling format perfect for mobile reading</p>
              </div>
              <div class="format-option" data-format="manga">
                <div class="icon">📖</div>
                <h3>Manga</h3>
                <p>Right-to-left reading traditional manga style</p>
              </div>
              <div class="format-option" data-format="instagram">
                <div class="icon">📷</div>
                <h3>Instagram</h3>
                <p>Square format perfect for social media sharing</p>
              </div>
              <div class="format-option" data-format="classic">
                <div class="icon">🦸</div>
                <h3>Classic</h3>
                <p>Traditional comic book style with panels</p>
              </div>
            </div>
            <div id="format-error" class="error-message"></div>
          </div>
          <div class="form-group">
            <label>Art Style</label>
            <input type="hidden" id="artStyle" name="artStyle" value="">
            <div class="art-styles">
              <div class="art-style" data-style="cartoon">
                <h4>Cartoon</h4>
                <p>Classic cartoon style</p>
              </div>
              <div class="art-style" data-style="anime">
                <h4>Anime</h4>
                <p>Japanese anime style</p>
              </div>
              <div class="art-style" data-style="realistic">
                <h4>Realistic</h4>
                <p>More detailed realistic art</p>
              </div>
              <div class="art-style" data-style="comic">
                <h4>Comic</h4>
                <p>Classic comic book style</p>
              </div>
              <div class="art-style" data-style="minimalist">
                <h4>Minimalist</h4>
                <p>Simple line art style</p>
              </div>
              <div class="art-style" data-style="retro">
                <h4>Retro</h4>
                <p>Vintage comic aesthetic</p>
              </div>
            </div>
            <div id="artStyle-error" class="error-message"></div>
          </div>
          <button type="submit">Create Comic</button>
        </form>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        // Check authentication status on page load
        checkAuthStatus();
        
        async function checkAuthStatus() {
          try {
            const response = await fetch('/api/users/me');
            if (response.ok) {
              // User is logged in
              document.getElementById('loginLink').style.display = 'none';
              document.getElementById('userControls').style.display = 'inline-block';
            } else {
              // User is not logged in, redirect to login
              alert('Please log in to create a comic');
              window.location.href = '/login.html';
            }
          } catch (error) {
            console.error('Auth check error:', error);
          }
        }
        
        // Handle format selection
        document.querySelectorAll('.format-option').forEach(option => {
          option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.format-option').forEach(el => {
              el.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden input value
            document.getElementById('format').value = this.dataset.format;
            
            // Clear error message if any
            document.getElementById('format-error').style.display = 'none';
          });
        });
        
        // Handle art style selection
        document.querySelectorAll('.art-style').forEach(style => {
          style.addEventListener('click', function() {
            // Remove selected class from all styles
            document.querySelectorAll('.art-style').forEach(el => {
              el.classList.remove('selected');
            });
            
            // Add selected class to clicked style
            this.classList.add('selected');
            
            // Update hidden input value
            document.getElementById('artStyle').value = this.dataset.style;
            
            // Clear error message if any
            document.getElementById('artStyle-error').style.display = 'none';
          });
        });
        
        // Handle logout
        document.getElementById('logoutLink').addEventListener('click', async function(e) {
          e.preventDefault();
          
          try {
            const response = await fetch('/api/users/logout', {
              method: 'POST'
            });
            
            if (response.ok) {
              alert('Logged out successfully');
              window.location.href = '/';
            }
          } catch (error) {
            console.error('Logout error:', error);
          }
        });
        
        // Handle form submission
        document.querySelector('.create-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          // Reset error messages
          document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
          });
          
          // Get form values
          const title = document.getElementById('title').value;
          const description = document.getElementById('description').value;
          const format = document.getElementById('format').value;
          const artStyle = document.getElementById('artStyle').value;
          
          // Validate
          let isValid = true;
          
          if (!title.trim()) {
            document.getElementById('title-error').textContent = 'Please enter a title';
            document.getElementById('title-error').style.display = 'block';
            isValid = false;
          }
          
          if (!format) {
            document.getElementById('format-error').textContent = 'Please select a format';
            document.getElementById('format-error').style.display = 'block';
            isValid = false;
          }
          
          if (!artStyle) {
            document.getElementById('artStyle-error').textContent = 'Please select an art style';
            document.getElementById('artStyle-error').style.display = 'block';
            isValid = false;
          }
          
          if (!isValid) return;
          
          try {
            const response = await fetch('/api/comics', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title,
                description,
                format,
                artStyle
              })
            });
            
            if (response.ok) {
              const comic = await response.json();
              alert('Comic created successfully!');
              // In a real app, we would redirect to the comic editor page with the ID
              window.location.href = '/';
            } else {
              const data = await response.json();
              alert(\`Failed to create comic: \${data.error || 'Unknown error'}\`);
            }
          } catch (error) {
            console.error('Create comic error:', error);
            alert('Failed to create comic. Please try again.');
          }
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(createComicPath, createComicHtml);
    console.log('Created create-comic.html');
  }
};

// Create a comics list page
const createComicsListPage = () => {
  const comicsListPath = path.join(publicDir, 'comics.html');
  
  if (!fs.existsSync(comicsListPath)) {
    const comicsListHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Comics - COMITALE</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .comics-container {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 8px 8px 0 #000;
        }
        .comics-container h1 {
          font-size: 2.5rem;
          color: #e951ff;
          text-align: center;
          margin-top: 0;
        }
        .comics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .comic-card {
          border: 3px solid #000;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 5px 5px 0 #000;
          transition: transform 0.3s;
          transform: rotate(-1deg);
          background-color: white;
          position: relative;
        }
        .comic-card:nth-child(2n) {
          transform: rotate(1deg);
        }
        .comic-card:nth-child(3n) {
          transform: rotate(-0.5deg);
        }
        .comic-card:hover {
          transform: rotate(0) scale(1.03);
          z-index: 1;
        }
        .comic-cover {
          height: 200px;
          background-color: #ffcc00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
          color: #e951ff;
          text-shadow: 2px 2px 0 #000;
          border-bottom: 3px solid #000;
        }
        .comic-info {
          padding: 1rem;
        }
        .comic-info h3 {
          margin-top: 0;
          color: #e951ff;
          font-size: 1.5rem;
        }
        .comic-info p {
          margin: 0.5rem 0;
          color: #333;
        }
        .comic-format {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background-color: #e951ff;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
          border: 2px solid #000;
        }
        .comic-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .comic-button {
          flex: 1;
          padding: 0.5rem;
          text-align: center;
          background-color: #e951ff;
          color: white;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .comic-button:hover {
          background-color: #d33deb;
        }
        .delete-button {
          background-color: #ff4d4d;
        }
        .delete-button:hover {
          background-color: #e63939;
        }
        .empty-state {
          text-align: center;
          margin: 4rem 0;
        }
        .empty-state h2 {
          color: #e951ff;
        }
        .create-button {
          display: inline-block;
          padding: 1rem 2rem;
          margin-top: 1rem;
          background-color: #e951ff;
          color: white;
          font-size: 1.2rem;
          text-decoration: none;
          border: 3px solid #000;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 3px 3px 0 #000;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 5px 5px 0 #000;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .nav-links {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        .nav-links a {
          display: inline-block;
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          background-color: white;
          color: #e951ff;
          text-decoration: none;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.2s;
        }
        .nav-links a:hover {
          transform: translateY(-2px);
          box-shadow: 3px 3px 0 #000;
        }
        @media (max-width: 768px) {
          .comics-container h1 {
            font-size: 2rem;
          }
          .comics-grid {
            grid-template-columns: 1fr;
          }
          .nav-links {
            position: static;
            margin-top: 1rem;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/create-comic.html">Create Comic</a>
          <a href="/login.html" id="loginLink">Login</a>
          <span id="userControls" style="display: none;">
            <a href="/api/users/logout" id="logoutLink">Logout</a>
          </span>
        </div>
      </header>
      <main>
        <div class="comics-container">
          <h1>My Comics</h1>
          <div id="comics-content">
            <div class="empty-state">
              <h2>You don't have any comics yet</h2>
              <p>Create your first comic to get started!</p>
              <a href="/create-comic.html" class="create-button">Create Comic</a>
            </div>
            <div id="comics-grid" class="comics-grid" style="display: none;">
              <!-- Comic cards will be inserted here by JavaScript -->
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        // Check authentication status on page load
        checkAuthStatus();
        
        async function checkAuthStatus() {
          try {
            const response = await fetch('/api/users/me');
            if (response.ok) {
              // User is logged in
              document.getElementById('loginLink').style.display = 'none';
              document.getElementById('userControls').style.display = 'inline-block';
              
              // Load comics
              loadComics();
            } else {
              // User is not logged in, redirect to login
              alert('Please log in to view your comics');
              window.location.href = '/login.html';
            }
          } catch (error) {
            console.error('Auth check error:', error);
          }
        }
        
        // Handle logout
        document.getElementById('logoutLink').addEventListener('click', async function(e) {
          e.preventDefault();
          
          try {
            const response = await fetch('/api/users/logout', {
              method: 'POST'
            });
            
            if (response.ok) {
              alert('Logged out successfully');
              window.location.href = '/';
            }
          } catch (error) {
            console.error('Logout error:', error);
          }
        });
        
        // Load user's comics
        async function loadComics() {
          try {
            const response = await fetch('/api/comics');
            
            if (response.ok) {
              const comics = await response.json();
              
              if (comics.length > 0) {
                document.querySelector('.empty-state').style.display = 'none';
                document.getElementById('comics-grid').style.display = 'grid';
                
                // Render comics
                const comicsGrid = document.getElementById('comics-grid');
                comicsGrid.innerHTML = '';
                
                comics.forEach(comic => {
                  const comicCard = document.createElement('div');
                  comicCard.className = 'comic-card';
                  comicCard.innerHTML = \`
                    <div class="comic-format">\${comic.format}</div>
                    <div class="comic-cover">\${comic.title.charAt(0)}</div>
                    <div class="comic-info">
                      <h3>\${comic.title}</h3>
                      <p>\${comic.description || 'No description'}</p>
                      <p>Style: \${comic.artStyle}</p>
                      <p>Created: \${new Date(comic.createdAt).toLocaleDateString()}</p>
                      <div class="comic-buttons">
                        <a href="/editor.html?id=\${comic.id}" class="comic-button">Edit</a>
                        <button class="comic-button delete-button" data-id="\${comic.id}">Delete</button>
                      </div>
                    </div>
                  \`;
                  
                  comicsGrid.appendChild(comicCard);
                });
                
                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-button').forEach(button => {
                  button.addEventListener('click', handleDeleteComic);
                });
              }
            } else {
              console.error('Failed to load comics');
            }
          } catch (error) {
            console.error('Load comics error:', error);
          }
        }
        
        // Handle comic deletion
        async function handleDeleteComic() {
          const comicId = this.dataset.id;
          
          if (confirm('Are you sure you want to delete this comic? This action cannot be undone.')) {
            try {
              const response = await fetch(\`/api/comics/\${comicId}\`, {
                method: 'DELETE'
              });
              
              if (response.ok) {
                alert('Comic deleted successfully');
                // Reload the comics list
                loadComics();
              } else {
                const data = await response.json();
                alert(\`Failed to delete comic: \${data.error || 'Unknown error'}\`);
              }
            } catch (error) {
              console.error('Delete comic error:', error);
              alert('Failed to delete comic. Please try again.');
            }
          }
        }
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(comicsListPath, comicsListHtml);
    console.log('Created comics.html');
  }
};

// Create the comic editor page
const createEditorPage = () => {
  const editorPath = path.join(publicDir, 'editor.html');
  
  if (!fs.existsSync(editorPath)) {
    const editorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Comic Editor - COMITALE</title>
      <style>
        body {
          font-family: 'Comic Sans MS', cursive, sans-serif;
          background-color: #f8e6ff;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        header {
          background-color: #e951ff;
          color: white;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 0 #000;
        }
        main {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .editor-container {
          background-color: white;
          border: 5px solid #000;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 8px 8px 0 #000;
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 3px solid #000;
          padding-bottom: 1rem;
        }
        .editor-title {
          font-size: 2rem;
          margin: 0;
          color: #e951ff;
        }
        .editor-controls {
          display: flex;
          gap: 1rem;
        }
        .editor-control {
          padding: 0.5rem 1rem;
          background-color: #e951ff;
          color: white;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .editor-control:hover {
          background-color: #d33deb;
        }
        .editor-tabs {
          display: flex;
          border-bottom: 3px solid #000;
          margin-bottom: 2rem;
        }
        .editor-tab {
          padding: 0.5rem 1.5rem;
          background-color: #ddd;
          border: 2px solid #000;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          margin-right: 0.5rem;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          top: 3px;
        }
        .editor-tab.active {
          background-color: #e951ff;
          color: white;
        }
        .editor-content {
          flex: 1;
          display: flex;
          gap: 2rem;
        }
        .editor-workspace {
          flex: 3;
          border: 3px solid #000;
          background-color: #f8f8f8;
          border-radius: 8px;
          padding: 1rem;
          position: relative;
          overflow: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        .editor-tools {
          flex: 1;
          background-color: #f0f0f0;
          border: 3px solid #000;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        .tool-section {
          margin-bottom: 1.5rem;
        }
        .tool-section h3 {
          margin-top: 0;
          color: #e951ff;
          border-bottom: 2px solid #000;
          padding-bottom: 0.5rem;
        }
        .tool-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        .tool-button {
          padding: 0.5rem;
          background-color: white;
          border: 2px solid #000;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tool-button:hover {
          background-color: #f8e6ff;
          transform: translateY(-2px);
        }
        .comic-page {
          background-color: white;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
          position: relative;
        }
        .comic-panel {
          position: absolute;
          background-color: white;
          border: 3px solid #000;
          cursor: move;
        }
        .comic-panel::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 20px
          );
          pointer-events: none;
        }
        .character-item {
          position: absolute;
          cursor: move;
        }
        .character-placeholder {
          width: 60px;
          height: 120px;
          background-color: #e951ff;
          border: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        .speech-bubble {
          position: absolute;
          background-color: white;
          border: 2px solid #000;
          border-radius: 20px;
          padding: 10px;
          min-width: 100px;
          min-height: 40px;
          cursor: move;
        }
        .speech-bubble::before {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 20px;
          border-width: 20px 0 0 20px;
          border-style: solid;
          border-color: #000 transparent transparent transparent;
        }
        .speech-bubble::after {
          content: "";
          position: absolute;
          bottom: -15px;
          left: 23px;
          border-width: 15px 0 0 15px;
          border-style: solid;
          border-color: white transparent transparent transparent;
        }
        .page-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        .page-control {
          padding: 0.5rem 1rem;
          background-color: #e951ff;
          color: white;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .page-control:hover {
          background-color: #d33deb;
        }
        .page-preview {
          width: 100%;
          height: 600px;
          margin-bottom: 2rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .page-preview h2 {
          color: #e951ff;
          margin-bottom: 1rem;
        }
        footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 1rem;
          margin-top: auto;
        }
        .nav-links {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        .nav-links a {
          display: inline-block;
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          background-color: white;
          color: #e951ff;
          text-decoration: none;
          border: 2px solid #000;
          border-radius: 4px;
          font-weight: bold;
          box-shadow: 2px 2px 0 #000;
          transition: transform 0.2s;
        }
        .nav-links a:hover {
          transform: translateY(-2px);
          box-shadow: 3px 3px 0 #000;
        }
        @media (max-width: 768px) {
          .editor-content {
            flex-direction: column;
          }
          .nav-links {
            position: static;
            margin-top: 1rem;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="logo">COMITALE</div>
        <div class="nav-links">
          <a href="/">Home</a>
          <a href="/comics.html">My Comics</a>
        </div>
      </header>
      <main>
        <div class="editor-container">
          <div class="editor-header">
            <h1 class="editor-title" id="comic-title">Comic Title</h1>
            <div class="editor-controls">
              <button class="editor-control" id="save-button">Save</button>
              <button class="editor-control" id="preview-button">Preview</button>
            </div>
          </div>
          <div class="editor-tabs">
            <div class="editor-tab active" data-tab="edit">Edit</div>
            <div class="editor-tab" data-tab="characters">Characters</div>
            <div class="editor-tab" data-tab="settings">Settings</div>
          </div>
          <div class="editor-content">
            <div class="editor-workspace">
              <div class="page-preview">
                <h2>Comic Editor - Coming Soon!</h2>
                <p>The editor is under development. Check back later for updates!</p>
                <p>This is a placeholder for the comic editor interface.</p>
              </div>
            </div>
            <div class="editor-tools">
              <div class="tool-section">
                <h3>Add Elements</h3>
                <div class="tool-grid">
                  <div class="tool-button" id="add-panel">Panel</div>
                  <div class="tool-button" id="add-character">Character</div>
                  <div class="tool-button" id="add-speech">Speech</div>
                  <div class="tool-button" id="add-caption">Caption</div>
                </div>
              </div>
              <div class="tool-section">
                <h3>Style</h3>
                <div class="tool-grid">
                  <div class="tool-button" id="style-bold">Bold</div>
                  <div class="tool-button" id="style-italic">Italic</div>
                  <div class="tool-button" id="style-font">Font</div>
                  <div class="tool-button" id="style-color">Color</div>
                </div>
              </div>
              <div class="tool-section">
                <h3>Layout</h3>
                <div class="tool-grid">
                  <div class="tool-button" id="layout-grid">Grid</div>
                  <div class="tool-button" id="layout-align">Align</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 COMITALE. All rights reserved.</p>
      </footer>
      <script>
        // Check authentication status on page load
        checkAuthStatus();
        
        async function checkAuthStatus() {
          try {
            const response = await fetch('/api/users/me');
            if (!response.ok) {
              // User is not logged in, redirect to login
              alert('Please log in to use the editor');
              window.location.href = '/login.html';
            }
          } catch (error) {
            console.error('Auth check error:', error);
          }
        }
        
        // Get comic ID from URL parameters
        const params = new URLSearchParams(window.location.search);
        const comicId = params.get('id');
        
        if (!comicId) {
          alert('No comic ID provided');
          window.location.href = '/comics.html';
        }
        
        // Load comic data (placeholder functionality for now)
        document.getElementById('comic-title').textContent = 'Comic Editor (Preview)';
        
        // Tab switching
        document.querySelectorAll('.editor-tab').forEach(tab => {
          tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.editor-tab').forEach(t => {
              t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabName = this.dataset.tab;
            console.log(\`Switched to \${tabName} tab\`);
            
            // In a full implementation, we would show/hide different content here
          });
        });
        
        // Tool buttons (placeholder functionality for now)
        document.querySelectorAll('.tool-button').forEach(button => {
          button.addEventListener('click', function() {
            alert(\`The "\${this.textContent}" tool is not yet implemented\`);
          });
        });
        
        // Save button (placeholder functionality for now)
        document.getElementById('save-button').addEventListener('click', function() {
          alert('Save functionality is coming soon!');
        });
        
        // Preview button (placeholder functionality for now)
        document.getElementById('preview-button').addEventListener('click', function() {
          alert('Preview functionality is coming soon!');
        });
      </script>
    </body>
    </html>
    `;
    
    fs.writeFileSync(editorPath, editorHtml);
    console.log('Created editor.html');
  }
};

// Create additional HTML pages
createComicPage();
createComicsListPage();
createEditorPage();

// Fallback route to serve index.html for SPA-like behavior
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return;
  
  // If requesting an HTML file directly, try to serve it
  if (req.path.endsWith('.html')) {
    const htmlPath = path.join(publicDir, req.path);
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  // Fallback to index.html
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`COMITALE server running on port ${PORT}`);
  console.log(`Open your browser to http://localhost:${PORT}`);
});