import { NextFunction, Request, Response } from "express";
import { SettingsService } from "./settings.service.js";

export class SettingsController {
  /**
   * Get all settings (admin only)
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getAllSettings();
      res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific setting by key
   */
  static async getByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const setting = await SettingsService.getSetting(key);
      
      if (!setting) {
        return res.status(404).json({ 
          success: false, 
          message: "Setting not found" 
        });
      }

      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a setting (admin only)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      const { value, description } = req.body;
      const adminId = req.user!.id;

      if (!value) {
        return res.status(400).json({ 
          success: false, 
          message: "Value is required" 
        });
      }

      const setting = await SettingsService.upsertSetting(
        key,
        value,
        description,
        adminId
      );

      res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update minimum booking nights (admin only)
   */
  static async updateMinNights(req: Request, res: Response, next: NextFunction) {
    try {
      const { nights } = req.body;
      const adminId = req.user!.id;

      if (nights === undefined || nights === null) {
        return res.status(400).json({ 
          success: false, 
          message: "Nights value is required" 
        });
      }

      const nightsNum = parseInt(nights);
      if (isNaN(nightsNum) || nightsNum < 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Nights must be a valid non-negative number" 
        });
      }

      const setting = await SettingsService.updateMinBookingNights(nightsNum, adminId);
      
      res.json({ 
        success: true, 
        data: setting,
        message: `Minimum booking nights updated to ${nightsNum}` 
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Initialize default settings
   */
  static async initializeDefaults(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await SettingsService.initializeDefaults();
      res.json({ 
        success: true, 
        message: `Initialized ${count} default settings` 
      });
    } catch (error) {
      next(error);
    }
  }
}
