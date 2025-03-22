import postgres from 'postgres';

async function main() {
  console.log('Starting database migration...');
  
  const connectionString = process.env.DATABASE_URL || '';
  if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  // For migrations
  const migrationClient = postgres(connectionString, { max: 1 });
  
  try {
    console.log('Creating tables if they don\'t exist...');
    
    // Create users table
    await migrationClient`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create comics table
    await migrationClient`
      CREATE TABLE IF NOT EXISTS comics (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        format VARCHAR(32) NOT NULL,
        art_style VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create characters table
    await migrationClient`
      CREATE TABLE IF NOT EXISTS characters (
        id UUID PRIMARY KEY,
        comic_id UUID NOT NULL REFERENCES comics(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT DEFAULT '',
        is_generated BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create pages table
    await migrationClient`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY,
        comic_id UUID NOT NULL REFERENCES comics(id) ON DELETE CASCADE,
        page_number INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `;
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await migrationClient.end();
    console.log('Database connection closed.');
  }
}

main().catch(console.error);