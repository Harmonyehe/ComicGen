import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertComicSchema, updateComicSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Auth middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Not authenticated");
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Comics routes
  app.get("/api/comics", isAuthenticated, async (req, res) => {
    try {
      const comics = await storage.getComicsByUserId(req.user!.id);
      res.json(comics);
    } catch (error) {
      res.status(500).send("Error fetching comics");
    }
  });

  app.get("/api/comics/:id", isAuthenticated, async (req, res) => {
    try {
      const comic = await storage.getComic(parseInt(req.params.id));
      
      if (!comic) {
        return res.status(404).send("Comic not found");
      }
      
      if (comic.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to access this comic");
      }
      
      res.json(comic);
    } catch (error) {
      res.status(500).send("Error fetching comic");
    }
  });

  app.post("/api/comics", isAuthenticated, async (req, res) => {
    try {
      const comicData = insertComicSchema.parse(req.body);
      const comic = await storage.createComic({
        ...comicData,
        userId: req.user!.id,
      });
      res.status(201).json(comic);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).send("Error creating comic");
    }
  });

  app.patch("/api/comics/:id", isAuthenticated, async (req, res) => {
    try {
      const comic = await storage.getComic(parseInt(req.params.id));
      
      if (!comic) {
        return res.status(404).send("Comic not found");
      }
      
      if (comic.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to update this comic");
      }
      
      const updateData = updateComicSchema.parse(req.body);
      const updatedComic = await storage.updateComic(parseInt(req.params.id), updateData);
      
      res.json(updatedComic);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).send("Error updating comic");
    }
  });

  app.delete("/api/comics/:id", isAuthenticated, async (req, res) => {
    try {
      const comic = await storage.getComic(parseInt(req.params.id));
      
      if (!comic) {
        return res.status(404).send("Comic not found");
      }
      
      if (comic.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to delete this comic");
      }
      
      await storage.deleteComic(parseInt(req.params.id));
      res.status(204).end();
    } catch (error) {
      res.status(500).send("Error deleting comic");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
