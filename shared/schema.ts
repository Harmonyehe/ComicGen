import { z } from "zod";

// User schema
export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

// Comic schema
export type Comic = {
  id: string;
  userId: string;
  title: string;
  description: string;
  format: "webtoon" | "manga" | "instagram" | "classic"; // Page size format
  artStyle: string;
  createdAt: Date;
  updatedAt: Date;
};

// Character schema
export type Character = {
  id: string;
  comicId: string;
  name: string;
  imageUrl: string;
  description: string;
  isGenerated: boolean; // Whether it was AI generated or user uploaded
  createdAt: Date;
};

// Page schema
export type Page = {
  id: string;
  comicId: string;
  pageNumber: number;
  content: string; // JSON stringified content including panels, characters, dialogues
  createdAt: Date;
  updatedAt: Date;
};

// Insert schemas for validation
export const insertUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string(),
  createdAt: z.date(),
});

export const insertComicSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  format: z.enum(["webtoon", "manga", "instagram", "classic"]),
  artStyle: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertCharacterSchema = z.object({
  id: z.string().uuid(),
  comicId: z.string().uuid(),
  name: z.string().min(1),
  imageUrl: z.string(),
  description: z.string().optional(),
  isGenerated: z.boolean(),
  createdAt: z.date(),
});

export const insertPageSchema = z.object({
  id: z.string().uuid(),
  comicId: z.string().uuid(),
  pageNumber: z.number().int().positive(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Types for use in forms and mutations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertComic = z.infer<typeof insertComicSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertPage = z.infer<typeof insertPageSchema>;