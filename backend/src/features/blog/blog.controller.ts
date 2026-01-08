import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service.js";
import { CreateBlogDto, UpdateBlogDto } from "./blog.types.js";

export class BlogController {
  // Public: Get all published blogs
  static async getPublished(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const result = await BlogService.getPublished({ limit, offset });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Public: Get single blog by slug
  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await BlogService.getBySlug(slug);
      res.json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all blogs (including drafts)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined;

      const result = await BlogService.getAll({ limit, offset });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Create blog
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateBlogDto;
      const filesObj = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;

      let coverImagePath: string | undefined;
      const imageLocalPaths =
        filesObj?.images?.map((f: Express.Multer.File) => f.path) || [];

      if (filesObj?.coverImage && filesObj.coverImage[0]) {
        coverImagePath = filesObj.coverImage[0].path;
      }

      const blog = await BlogService.create({
        ...data,
        coverImage: coverImagePath,
        images: imageLocalPaths,
      });

      res.status(201).json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update blog
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateBlogDto;
      const filesObj = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;

      let coverImagePath: string | undefined;
      const imageLocalPaths =
        filesObj?.images?.map((f: Express.Multer.File) => f.path) || [];

      if (filesObj?.coverImage && filesObj.coverImage[0]) {
        coverImagePath = filesObj.coverImage[0].path;
      }

      const blog = await BlogService.update(id, {
        ...data,
        ...(coverImagePath && { coverImage: coverImagePath }),
        ...(imageLocalPaths.length > 0 && { images: imageLocalPaths }),
      });

      res.json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete blog
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BlogService.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Admin: Update blog status
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["DRAFT", "PUBLISH"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      const blog = await BlogService.updateStatus(id, status);
      res.json({ success: true, data: blog });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
