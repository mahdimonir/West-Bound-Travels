import { NextFunction, Request, Response } from 'express';
import { BoatService } from './boats.service.js';

export class BoatController {
  static async getBoats(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const type = req.query.type as any;

      const result = await BoatService.getAllBoats({ page, limit, type });
      res.json({ success: true, data: result.boats, pagination: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  static async getBoat(req: Request, res: Response, next: NextFunction) {
    try {
      const boat = await BoatService.getBoatById(req.params.id);
      res.json({ success: true, data: boat });
    } catch (error) {
      next(error);
    }
  }

  static async createBoat(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse JSON fields from multipart form data
      const parsedBody = {
        ...req.body,
        features: req.body.features ? JSON.parse(req.body.features) : [],
        rooms: req.body.rooms ? JSON.parse(req.body.rooms) : [],
        totalRooms: req.body.totalRooms ? parseInt(req.body.totalRooms) : 7,
      };
      
      const boat = await BoatService.createBoat(parsedBody);
      res.status(201).json({ success: true, data: boat });
    } catch (error) {
      next(error);
    }
  }

  static async updateBoat(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse JSON fields from multipart form data
      const parsedBody = {
        ...req.body,
        features: req.body.features ? JSON.parse(req.body.features) : undefined,
        rooms: req.body.rooms ? JSON.parse(req.body.rooms) : undefined,
        totalRooms: req.body.totalRooms ? parseInt(req.body.totalRooms) : undefined,
      };
      
      const boat = await BoatService.updateBoat(req.params.id, parsedBody);
      res.json({ success: true, data: boat });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBoat(req: Request, res: Response, next: NextFunction) {
    try {
      await BoatService.deleteBoat(req.params.id);
      res.json({ success: true, message: 'Boat deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check boat availability for given dates
   */
  static async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { checkIn, checkOut } = req.query;

      if (!checkIn || !checkOut) {
        return res.status(400).json({
          success: false,
          message: 'checkIn and checkOut dates are required',
        });
      }

      // Get boat details
      const boat = await BoatService.getBoatById(id);

      // This is a simplified version - you can enhance with actual booking checks
      // For now, return boat capacity as available rooms
      const availableRooms: Record<string, number> = {};
      
      if (Array.isArray(boat.rooms)) {
        boat.rooms.forEach((room: any) => {
          if (room.type && room.count) {
            availableRooms[room.type] = room.count;
          }
        });
      }

      res.json({
        success: true,
        data: {
          available: true,
          availableRooms,
          message: 'Boat is available for selected dates',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
