import { NextFunction, Request, Response } from "express";
import { GalleryService } from "./gallery.service.js";

export class GalleryController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await GalleryService.listAll();
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { src, alt, category, imageLocalPath } = req.body;
      // multer may put files in req.file (single) or req.files (fields)
      const singleFile = (req as any).file as Express.Multer.File | undefined;
      const filesObj = (req as any).files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const fieldFile = filesObj?.src?.[0] || filesObj?.image?.[0];
      const file = singleFile || fieldFile;
      const imageLocalPathFinal = file?.path || imageLocalPath;
      const item = await GalleryService.createEntry({
        src,
        alt,
        category,
        imageLocalPath: imageLocalPathFinal,
      });
      res.status(201).json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await GalleryService.deleteEntry(id);
      res.json({ success: true, data: deleted });
    } catch (err) {
      next(err);
    }
  }
}
