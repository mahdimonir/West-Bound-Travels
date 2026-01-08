import prisma from "../../config/database.js";

export class SettingsService {
  /**
   * Get a setting by key
   */
  static async getSetting(key: string) {
    const setting = await prisma.settings.findUnique({
      where: { key },
    });
    return setting;
  }

  /**
   * Get setting value (returns default if not found)
   */
  static async getSettingValue(key: string, defaultValue: string = ""): Promise<string> {
    const setting = await this.getSetting(key);
    return setting?.value || defaultValue;
  }

  /**
   * Get all settings
   */
  static async getAllSettings() {
    return prisma.settings.findMany({
      orderBy: { key: "asc" },
    });
  }

  /**
   * Update or create a setting
   */
  static async upsertSetting(
    key: string,
    value: string,
    description?: string,
    updatedBy?: string
  ) {
    return prisma.settings.upsert({
      where: { key },
      create: {
        key,
        value,
        description,
        updatedBy,
      },
      update: {
        value,
        description,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Initialize default settings if they don't exist
   */
  static async initializeDefaults() {
    const defaults = [
      {
        key: "MIN_BOOKING_NIGHTS",
        value: "1",
        description: "Minimum number of nights required for booking (can be changed seasonally)",
      },
      {
        key: "MAX_BOOKING_NIGHTS",
        value: "30",
        description: "Maximum number of nights allowed for a single booking",
      },
      {
        key: "BOOKING_ADVANCE_DAYS",
        value: "2",
        description: "Minimum days in advance required for booking",
      },
    ];

    for (const setting of defaults) {
      const existing = await this.getSetting(setting.key);
      if (!existing) {
        await this.upsertSetting(
          setting.key,
          setting.value,
          setting.description,
          "SYSTEM"
        );
      }
    }

    return defaults.length;
  }

  /**
   * Get minimum booking nights (commonly used)
   */
  static async getMinBookingNights(): Promise<number> {
    const value = await this.getSettingValue("MIN_BOOKING_NIGHTS", "1");
    return parseInt(value) || 1;
  }

  /**
   * Update minimum booking nights (admin only)
   */
  static async updateMinBookingNights(nights: number, adminId: string) {
    if (nights < 0) {
      throw { status: 400, message: "Minimum nights cannot be negative" };
    }
    
    return this.upsertSetting(
      "MIN_BOOKING_NIGHTS",
      nights.toString(),
      "Minimum number of nights required for booking (can be changed seasonally)",
      adminId
    );
  }
}
