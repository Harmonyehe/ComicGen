import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

import { User, Comic, Character, Page, InsertUser, InsertComic, InsertCharacter, InsertPage } from '@shared/schema';
import { IStorage } from './storage';
import * as schema from './drizzle-schema';

// Initialize Postgres client
const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export class DrizzleStorage implements IStorage {
  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(schema.users).values({
      id: user.id || uuidv4(),
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt || new Date(),
    }).returning();

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      createdAt: newUser.createdAt,
    };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return users.length > 0 ? {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      passwordHash: users[0].passwordHash,
      createdAt: users[0].createdAt,
    } : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users.length > 0 ? {
      id: users[0].id,
      username: users[0].username,
      email: users[0].email,
      passwordHash: users[0].passwordHash,
      createdAt: users[0].createdAt,
    } : null;
  }

  // Comic operations
  async createComic(comic: InsertComic): Promise<Comic> {
    const [newComic] = await db.insert(schema.comics).values({
      id: comic.id || uuidv4(),
      userId: comic.userId,
      title: comic.title,
      description: comic.description || '',
      format: comic.format,
      artStyle: comic.artStyle,
      createdAt: comic.createdAt || new Date(),
      updatedAt: comic.updatedAt || new Date(),
    }).returning();

    return {
      id: newComic.id,
      userId: newComic.userId,
      title: newComic.title,
      description: newComic.description || '',
      format: newComic.format as "webtoon" | "manga" | "instagram" | "classic",
      artStyle: newComic.artStyle,
      createdAt: newComic.createdAt,
      updatedAt: newComic.updatedAt,
    };
  }

  async getComicById(id: string): Promise<Comic | null> {
    const comics = await db.select().from(schema.comics).where(eq(schema.comics.id, id));
    return comics.length > 0 ? {
      id: comics[0].id,
      userId: comics[0].userId,
      title: comics[0].title,
      description: comics[0].description || '',
      format: comics[0].format as "webtoon" | "manga" | "instagram" | "classic",
      artStyle: comics[0].artStyle,
      createdAt: comics[0].createdAt,
      updatedAt: comics[0].updatedAt,
    } : null;
  }

  async getComicsByUserId(userId: string): Promise<Comic[]> {
    const comics = await db.select().from(schema.comics).where(eq(schema.comics.userId, userId));
    return comics.map(comic => ({
      id: comic.id,
      userId: comic.userId,
      title: comic.title,
      description: comic.description || '',
      format: comic.format as "webtoon" | "manga" | "instagram" | "classic",
      artStyle: comic.artStyle,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
    }));
  }

  async updateComic(id: string, comicUpdate: Partial<Comic>): Promise<Comic | null> {
    const [updatedComic] = await db.update(schema.comics)
      .set({
        title: comicUpdate.title,
        description: comicUpdate.description,
        format: comicUpdate.format,
        artStyle: comicUpdate.artStyle,
        updatedAt: new Date(),
      })
      .where(eq(schema.comics.id, id))
      .returning();

    return updatedComic ? {
      id: updatedComic.id,
      userId: updatedComic.userId,
      title: updatedComic.title,
      description: updatedComic.description || '',
      format: updatedComic.format as "webtoon" | "manga" | "instagram" | "classic",
      artStyle: updatedComic.artStyle,
      createdAt: updatedComic.createdAt,
      updatedAt: updatedComic.updatedAt,
    } : null;
  }

  async deleteComic(id: string): Promise<boolean> {
    const deleted = await db.delete(schema.comics).where(eq(schema.comics.id, id)).returning();
    return deleted.length > 0;
  }

  // Character operations
  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db.insert(schema.characters).values({
      id: character.id || uuidv4(),
      comicId: character.comicId,
      name: character.name,
      imageUrl: character.imageUrl,
      description: character.description || '',
      isGenerated: character.isGenerated,
      createdAt: character.createdAt || new Date(),
    }).returning();

    return {
      id: newCharacter.id,
      comicId: newCharacter.comicId,
      name: newCharacter.name,
      imageUrl: newCharacter.imageUrl,
      description: newCharacter.description || '',
      isGenerated: newCharacter.isGenerated,
      createdAt: newCharacter.createdAt,
    };
  }

  async getCharactersByComicId(comicId: string): Promise<Character[]> {
    const characters = await db.select().from(schema.characters).where(eq(schema.characters.comicId, comicId));
    return characters.map(character => ({
      id: character.id,
      comicId: character.comicId,
      name: character.name,
      imageUrl: character.imageUrl,
      description: character.description || '',
      isGenerated: character.isGenerated,
      createdAt: character.createdAt,
    }));
  }

  async getCharacterById(id: string): Promise<Character | null> {
    const characters = await db.select().from(schema.characters).where(eq(schema.characters.id, id));
    return characters.length > 0 ? {
      id: characters[0].id,
      comicId: characters[0].comicId,
      name: characters[0].name,
      imageUrl: characters[0].imageUrl,
      description: characters[0].description || '',
      isGenerated: characters[0].isGenerated,
      createdAt: characters[0].createdAt,
    } : null;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const deleted = await db.delete(schema.characters).where(eq(schema.characters.id, id)).returning();
    return deleted.length > 0;
  }

  // Page operations
  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(schema.pages).values({
      id: page.id || uuidv4(),
      comicId: page.comicId,
      pageNumber: page.pageNumber,
      content: page.content,
      createdAt: page.createdAt || new Date(),
      updatedAt: page.updatedAt || new Date(),
    }).returning();

    return {
      id: newPage.id,
      comicId: newPage.comicId,
      pageNumber: newPage.pageNumber,
      content: newPage.content,
      createdAt: newPage.createdAt,
      updatedAt: newPage.updatedAt,
    };
  }

  async getPagesByComicId(comicId: string): Promise<Page[]> {
    const pages = await db.select().from(schema.pages)
      .where(eq(schema.pages.comicId, comicId))
      .orderBy(schema.pages.pageNumber);
      
    return pages.map(page => ({
      id: page.id,
      comicId: page.comicId,
      pageNumber: page.pageNumber,
      content: page.content,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }));
  }

  async getPageById(id: string): Promise<Page | null> {
    const pages = await db.select().from(schema.pages).where(eq(schema.pages.id, id));
    return pages.length > 0 ? {
      id: pages[0].id,
      comicId: pages[0].comicId,
      pageNumber: pages[0].pageNumber,
      content: pages[0].content,
      createdAt: pages[0].createdAt,
      updatedAt: pages[0].updatedAt,
    } : null;
  }

  async updatePage(id: string, pageUpdate: Partial<Page>): Promise<Page | null> {
    const [updatedPage] = await db.update(schema.pages)
      .set({
        pageNumber: pageUpdate.pageNumber,
        content: pageUpdate.content,
        updatedAt: new Date(),
      })
      .where(eq(schema.pages.id, id))
      .returning();

    return updatedPage ? {
      id: updatedPage.id,
      comicId: updatedPage.comicId,
      pageNumber: updatedPage.pageNumber,
      content: updatedPage.content,
      createdAt: updatedPage.createdAt,
      updatedAt: updatedPage.updatedAt,
    } : null;
  }

  async deletePage(id: string): Promise<boolean> {
    const deleted = await db.delete(schema.pages).where(eq(schema.pages.id, id)).returning();
    return deleted.length > 0;
  }
}