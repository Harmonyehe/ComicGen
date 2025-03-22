import express from 'express';
import session from 'express-session';
import path from 'path';
import { createRoutes } from './routes';
import { DrizzleStorage } from './drizzle-storage';
import connectPgSimple from 'connect-pg-simple';

// Set up Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());

// Session configuration
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session', // Default table name
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'comitale-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Set up the storage
const storage = new DrizzleStorage();

// Create and mount API routes
createRoutes(app, storage);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve the SPA for any other routes
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});