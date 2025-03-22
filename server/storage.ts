import { users, type User, type InsertUser, comics, type Comic, type InsertComic, type UpdateComic } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Comic methods
  getComic(id: number): Promise<Comic | undefined>;
  getComicsByUserId(userId: number): Promise<Comic[]>;
  createComic(comic: InsertComic & { userId: number }): Promise<Comic>;
  updateComic(id: number, comic: Partial<UpdateComic>): Promise<Comic>;
  deleteComic(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private comics: Map<number, Comic>;
  sessionStore: session.SessionStore;
  private userId: number;
  private comicId: number;

  constructor() {
    this.users = new Map();
    this.comics = new Map();
    this.userId = 1;
    this.comicId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Comic methods
  async getComic(id: number): Promise<Comic | undefined> {
    return this.comics.get(id);
  }

  async getComicsByUserId(userId: number): Promise<Comic[]> {
    return Array.from(this.comics.values()).filter(
      (comic) => comic.userId === userId,
    );
  }

  async createComic(comic: InsertComic & { userId: number }): Promise<Comic> {
    const id = this.comicId++;
    const now = new Date();
    const newComic: Comic = {
      id,
      userId: comic.userId,
      title: comic.title,
      content: comic.content,
      createdAt: now,
      updatedAt: now,
      published: comic.published || false,
    };
    this.comics.set(id, newComic);
    return newComic;
  }

  async updateComic(id: number, updates: Partial<UpdateComic>): Promise<Comic> {
    const comic = this.comics.get(id);
    if (!comic) {
      throw new Error("Comic not found");
    }
    
    const updatedComic: Comic = {
      ...comic,
      ...updates,
      updatedAt: new Date(),
    };
    this.comics.set(id, updatedComic);
    return updatedComic;
  }

  async deleteComic(id: number): Promise<void> {
    this.comics.delete(id);
  }
}

export const storage = new MemStorage();
