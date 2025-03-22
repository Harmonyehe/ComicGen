import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// User table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comic table
export const comics = pgTable('comics', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').default(''),
  format: varchar('format', { length: 32 }).notNull(),
  artStyle: varchar('art_style', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Character table
export const characters = pgTable('characters', {
  id: uuid('id').primaryKey(),
  comicId: uuid('comic_id').notNull().references(() => comics.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description').default(''),
  isGenerated: boolean('is_generated').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Page table
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey(),
  comicId: uuid('comic_id').notNull().references(() => comics.id, { onDelete: 'cascade' }),
  pageNumber: integer('page_number').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas for insertion
export const insertUserSchema = createInsertSchema(users);
export const insertComicSchema = createInsertSchema(comics);
export const insertCharacterSchema = createInsertSchema(characters);
export const insertPageSchema = createInsertSchema(pages);