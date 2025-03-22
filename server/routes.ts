import { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { IStorage } from "./storage";
import {
  insertUserSchema,
  insertComicSchema,
  insertCharacterSchema,
  insertPageSchema,
} from "../shared/schema";

// Extend Express session with our custom data
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export function createRoutes(app: Express, storage: IStorage) {
  // Middleware for checking if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // User Registration
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validatedData.password, salt);
      
      // Create user
      const newUser = await storage.createUser({
        ...validatedData,
        id: uuidv4(),
        passwordHash,
        createdAt: new Date(),
      });
      
      // Remove sensitive data before returning
      const { passwordHash: _, ...userWithoutPassword } = newUser;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Registration error:", error);
      return res.status(400).json({ error: error.message || "Invalid registration data" });
    }
  });

  // User Login
  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Remove sensitive data before returning
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Login error:", error);
      return res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  // User Logout
  app.post("/api/users/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get Current User
  app.get("/api/users/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Remove sensitive data before returning
      const { passwordHash: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Get user error:", error);
      return res.status(400).json({ error: error.message || "Failed to get user" });
    }
  });

  // Create Comic
  app.post("/api/comics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertComicSchema.parse(req.body);
      
      const newComic = await storage.createComic({
        ...validatedData,
        id: uuidv4(),
        userId: req.session.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return res.status(201).json(newComic);
    } catch (error: any) {
      console.error("Create comic error:", error);
      return res.status(400).json({ error: error.message || "Failed to create comic" });
    }
  });

  // Get User's Comics
  app.get("/api/comics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const comics = await storage.getComicsByUserId(req.session.userId);
      return res.status(200).json(comics);
    } catch (error: any) {
      console.error("Get comics error:", error);
      return res.status(400).json({ error: error.message || "Failed to get comics" });
    }
  });

  // Get Comic By ID
  app.get("/api/comics/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to access this comic" });
      }
      
      return res.status(200).json(comic);
    } catch (error: any) {
      console.error("Get comic error:", error);
      return res.status(400).json({ error: error.message || "Failed to get comic" });
    }
  });

  // Update Comic
  app.patch("/api/comics/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to update this comic" });
      }
      
      // Only allow certain fields to be updated
      const allowedUpdates = ["title", "description", "format", "artStyle"];
      const updates: Record<string, any> = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });
      
      updates.updatedAt = new Date();
      
      const updatedComic = await storage.updateComic(req.params.id, updates);
      
      return res.status(200).json(updatedComic);
    } catch (error: any) {
      console.error("Update comic error:", error);
      return res.status(400).json({ error: error.message || "Failed to update comic" });
    }
  });

  // Delete Comic
  app.delete("/api/comics/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to delete this comic" });
      }
      
      await storage.deleteComic(req.params.id);
      
      return res.status(200).json({ message: "Comic deleted successfully" });
    } catch (error: any) {
      console.error("Delete comic error:", error);
      return res.status(400).json({ error: error.message || "Failed to delete comic" });
    }
  });

  // Create Character
  app.post("/api/comics/:id/characters", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to add characters to this comic" });
      }
      
      const validatedData = insertCharacterSchema.parse({
        ...req.body,
        comicId: req.params.id,
      });
      
      const newCharacter = await storage.createCharacter({
        ...validatedData,
        id: uuidv4(),
        createdAt: new Date(),
      });
      
      return res.status(201).json(newCharacter);
    } catch (error: any) {
      console.error("Create character error:", error);
      return res.status(400).json({ error: error.message || "Failed to create character" });
    }
  });

  // Get Characters for Comic
  app.get("/api/comics/:id/characters", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to view characters for this comic" });
      }
      
      const characters = await storage.getCharactersByComicId(req.params.id);
      
      return res.status(200).json(characters);
    } catch (error: any) {
      console.error("Get characters error:", error);
      return res.status(400).json({ error: error.message || "Failed to get characters" });
    }
  });

  // Create Page
  app.post("/api/comics/:id/pages", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to add pages to this comic" });
      }
      
      const validatedData = insertPageSchema.parse({
        ...req.body,
        comicId: req.params.id,
      });
      
      const newPage = await storage.createPage({
        ...validatedData,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return res.status(201).json(newPage);
    } catch (error: any) {
      console.error("Create page error:", error);
      return res.status(400).json({ error: error.message || "Failed to create page" });
    }
  });

  // Get Pages for Comic
  app.get("/api/comics/:id/pages", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const comic = await storage.getComicById(req.params.id);
      
      if (!comic) {
        return res.status(404).json({ error: "Comic not found" });
      }
      
      // Check if user owns this comic
      if (comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to view pages for this comic" });
      }
      
      const pages = await storage.getPagesByComicId(req.params.id);
      
      return res.status(200).json(pages);
    } catch (error: any) {
      console.error("Get pages error:", error);
      return res.status(400).json({ error: error.message || "Failed to get pages" });
    }
  });

  // Update Page
  app.patch("/api/pages/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const page = await storage.getPageById(req.params.id);
      
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      
      // Get comic to check ownership
      const comic = await storage.getComicById(page.comicId);
      
      if (!comic || comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to update this page" });
      }
      
      // Only allow certain fields to be updated
      const allowedUpdates = ["content", "pageNumber"];
      const updates: Record<string, any> = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });
      
      updates.updatedAt = new Date();
      
      const updatedPage = await storage.updatePage(req.params.id, updates);
      
      return res.status(200).json(updatedPage);
    } catch (error: any) {
      console.error("Update page error:", error);
      return res.status(400).json({ error: error.message || "Failed to update page" });
    }
  });

  // Delete Page
  app.delete("/api/pages/:id", isAuthenticated, async (req: Request<{ id: string }>, res: Response) => {
    try {
      const page = await storage.getPageById(req.params.id);
      
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      
      // Get comic to check ownership
      const comic = await storage.getComicById(page.comicId);
      
      if (!comic || comic.userId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized to delete this page" });
      }
      
      await storage.deletePage(req.params.id);
      
      return res.status(200).json({ message: "Page deleted successfully" });
    } catch (error: any) {
      console.error("Delete page error:", error);
      return res.status(400).json({ error: error.message || "Failed to delete page" });
    }
  });
}