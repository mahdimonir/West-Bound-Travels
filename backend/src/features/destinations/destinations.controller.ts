import { NextFunction, Request, Response } from "express";
import { DestinationService } from "./destinations.service.js";

export class DestinationController {
  static async getDestinations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const destinations = await DestinationService.getAllDestinations();
      res.status(200).json({ success: true, data: destinations });
    } catch (error) {
      next(error);
    }
  }

  static async getDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const destination = await DestinationService.getDestinationById(id);
      res.status(200).json({ success: true, data: destination });
    } catch (error) {
      next(error);
    }
  }

  static async createDestination(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payload = req.body;
      const filesObj = (req as any).files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const imageLocalPaths = (filesObj?.images || []).map((f) => f.path);
      const destination = await DestinationService.createDestination({
        ...payload,
        imageLocalPaths,
      });
      res.status(201).json({ success: true, data: destination });
    } catch (error) {
      next(error);
    }
  }

  static async updateDestination(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const filesObj = (req as any).files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const imageLocalPaths = (filesObj?.images || []).map((f) => f.path);
      const destination = await DestinationService.updateDestination(id, {
        ...payload,
        imageLocalPaths,
      });
      res.status(200).json({ success: true, data: destination });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDestination(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const destination = await DestinationService.deleteDestination(id);
      res.status(200).json({ success: true, data: destination });
    } catch (error) {
      next(error);
    }
  }
}
