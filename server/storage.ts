import { User, Comic, Character, Page, InsertUser, InsertComic, InsertCharacter, InsertPage } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  
  // Comic operations
  createComic(comic: InsertComic): Promise<Comic>;
  getComicById(id: string): Promise<Comic | null>;
  getComicsByUserId(userId: string): Promise<Comic[]>;
  updateComic(id: string, comic: Partial<Comic>): Promise<Comic | null>;
  deleteComic(id: string): Promise<boolean>;
  
  // Character operations
  createCharacter(character: InsertCharacter): Promise<Character>;
  getCharactersByComicId(comicId: string): Promise<Character[]>;
  getCharacterById(id: string): Promise<Character | null>;
  deleteCharacter(id: string): Promise<boolean>;
  
  // Page operations
  createPage(page: InsertPage): Promise<Page>;
  getPagesByComicId(comicId: string): Promise<Page[]>;
  getPageById(id: string): Promise<Page | null>;
  updatePage(id: string, page: Partial<Page>): Promise<Page | null>;
  deletePage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private comics: Comic[] = [];
  private characters: Character[] = [];
  private pages: Page[] = [];
  
  // User operations
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }
  
  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }
  
  // Comic operations
  async createComic(comic: InsertComic): Promise<Comic> {
    const newComic: Comic = {
      id: comic.id,
      userId: comic.userId,
      title: comic.title,
      description: comic.description || "",
      format: comic.format,
      artStyle: comic.artStyle,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
    };
    
    this.comics.push(newComic);
    return newComic;
  }
  
  async getComicById(id: string): Promise<Comic | null> {
    const comic = this.comics.find(c => c.id === id);
    return comic || null;
  }
  
  async getComicsByUserId(userId: string): Promise<Comic[]> {
    return this.comics.filter(c => c.userId === userId);
  }
  
  async updateComic(id: string, comicUpdate: Partial<Comic>): Promise<Comic | null> {
    const index = this.comics.findIndex(c => c.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedComic = {
      ...this.comics[index],
      ...comicUpdate,
    };
    
    this.comics[index] = updatedComic;
    return updatedComic;
  }
  
  async deleteComic(id: string): Promise<boolean> {
    const initialLength = this.comics.length;
    this.comics = this.comics.filter(c => c.id !== id);
    
    // Also delete related characters and pages
    this.characters = this.characters.filter(ch => ch.comicId !== id);
    this.pages = this.pages.filter(p => p.comicId !== id);
    
    return this.comics.length < initialLength;
  }
  
  // Character operations
  async createCharacter(character: InsertCharacter): Promise<Character> {
    const newCharacter: Character = {
      id: character.id,
      comicId: character.comicId,
      name: character.name,
      imageUrl: character.imageUrl,
      description: character.description || "",
      isGenerated: character.isGenerated,
      createdAt: character.createdAt,
    };
    
    this.characters.push(newCharacter);
    return newCharacter;
  }
  
  async getCharactersByComicId(comicId: string): Promise<Character[]> {
    return this.characters.filter(ch => ch.comicId === comicId);
  }
  
  async getCharacterById(id: string): Promise<Character | null> {
    const character = this.characters.find(ch => ch.id === id);
    return character || null;
  }
  
  async deleteCharacter(id: string): Promise<boolean> {
    const initialLength = this.characters.length;
    this.characters = this.characters.filter(ch => ch.id !== id);
    return this.characters.length < initialLength;
  }
  
  // Page operations
  async createPage(page: InsertPage): Promise<Page> {
    const newPage: Page = {
      id: page.id,
      comicId: page.comicId,
      pageNumber: page.pageNumber,
      content: page.content,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
    
    this.pages.push(newPage);
    return newPage;
  }
  
  async getPagesByComicId(comicId: string): Promise<Page[]> {
    return this.pages
      .filter(p => p.comicId === comicId)
      .sort((a, b) => a.pageNumber - b.pageNumber);
  }
  
  async getPageById(id: string): Promise<Page | null> {
    const page = this.pages.find(p => p.id === id);
    return page || null;
  }
  
  async updatePage(id: string, pageUpdate: Partial<Page>): Promise<Page | null> {
    const index = this.pages.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedPage = {
      ...this.pages[index],
      ...pageUpdate,
    };
    
    this.pages[index] = updatedPage;
    return updatedPage;
  }
  
  async deletePage(id: string): Promise<boolean> {
    const initialLength = this.pages.length;
    this.pages = this.pages.filter(p => p.id !== id);
    return this.pages.length < initialLength;
  }
}