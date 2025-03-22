import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Comics table
export const comics = pgTable("comics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull().default("Untitled Comic"),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  published: boolean("published").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertComicSchema = createInsertSchema(comics).pick({
  title: true,
  content: true,
  published: true,
});

export const updateComicSchema = createInsertSchema(comics).pick({
  title: true,
  content: true,
  published: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertComic = z.infer<typeof insertComicSchema>;
export type UpdateComic = z.infer<typeof updateComicSchema>;
export type Comic = typeof comics.$inferSelect;
