import express from "express";
import session from "express-session";
import path from "path";
import fs from "fs";
import { createRoutes } from "./server/routes";
import { MemStorage } from "./server/storage";

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "comic-creator-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Storage initialization
const storage = new MemStorage();

// API Routes
createRoutes(app, storage);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a simple HTML page that demonstrates the app is working
const createSimpleHtml = () => {
  const publicDir = path.join(__dirname, 'public');
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
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
        <a href="/login">Login</a>
        <a href="/register">Register</a>
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
  </body>
  </html>
  `;
  
  fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
  console.log('Created simple HTML page');
};

// Create the simple HTML page
createSimpleHtml();

// API endpoints for demo
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server is running!' });
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return;
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Open your browser to http://localhost:${PORT}`);
});