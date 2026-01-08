import { BoatType } from "@prisma/client";
import prisma from "../../config/database.js";
import { deleteImageByUrl, uploadImage } from "../../services/cloudinary.js";

export class BoatService {
  static async getAllBoats(options?: {
    page?: number;
    limit?: number;
    type?: BoatType;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (options?.type) where.type = options.type;

    const [boats, total] = await Promise.all([
      prisma.boat.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          images: true,
          totalRooms: true,
          features: true,
          description: true,
          isActive: true,
          rooms: true,
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.boat.count({ where }),
    ]);

    return {
      boats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  static async getBoatById(id: string) {
    const boat = await prisma.boat.findUnique({
      where: { id },
    });

    if (!boat) {
      const error: any = new Error("Boat not found");
      error.status = 404;
      throw error;
    }

    return boat;
  }

  static async createBoat(data: {
    name: string;
    type: BoatType;
    features?: string[];
    totalRooms?: number;
    rooms?: any; // JSON
    description?: string;
    imageLocalPaths?: string[]; // local files to upload
    images?: string[]; // direct urls
  }) {
    const images: string[] = [];

    // upload local files if provided
    if (data.imageLocalPaths && data.imageLocalPaths.length) {
      for (const p of data.imageLocalPaths) {
        const res: any = await uploadImage(p, "WBTravels/boats");
        if (res?.secure_url) images.push(res.secure_url);
      }
    }

    // append provided image URLs
    if (data.images && data.images.length) images.push(...data.images);

    return prisma.boat.create({
      data: {
        name: data.name,
        type: data.type,
        features: data.features || [],
        totalRooms: data.totalRooms || 7,
        rooms: data.rooms || [],
        description: data.description || null,
        images,
      },
    });
  }

  static async updateBoat(
    id: string,
    data?: {
      name?: string;
      type?: BoatType;
      features?: string[];
      totalRooms?: number;
      rooms?: any;
      description?: string | null;
      imageLocalPaths?: string[]; // new uploads
      images?: string[]; // new direct urls
      replaceImages?: boolean; // if true, delete previous images
    }
  ) {
    if (!data) throw { status: 400, message: "Request body is required" };
    const boat = await prisma.boat.findUnique({ where: { id } });
    if (!boat) throw { status: 404, message: "Boat not found" };

    let newImages = boat.images || [];

    if (data?.replaceImages) {
      // delete previous images from cloud
      for (const img of newImages) {
        await deleteImageByUrl(img);
      }
      newImages = [];
    }

    if (data.imageLocalPaths && data.imageLocalPaths.length) {
      for (const p of data.imageLocalPaths) {
        const res: any = await uploadImage(p, "WBTravels/boats");
        if (res?.secure_url) newImages.push(res.secure_url);
      }
    }

    if (data.images && data.images.length) newImages.push(...data.images);

    return prisma.boat.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        features: data.features,
        totalRooms: data.totalRooms,
        rooms: data.rooms,
        description: data.description,
        images: newImages,
      },
    });
  }

  static async deleteBoat(id: string) {
    const boat = await prisma.boat.findUnique({ where: { id } });
    if (!boat) throw { status: 404, message: "Boat not found" };

    // Delete all associated images from Cloudinary
    if (boat.images && boat.images.length) {
      for (const img of boat.images) {
        await deleteImageByUrl(img);
      }
    }

    // Delete boat from DB
    return prisma.boat.delete({ where: { id } });
  }
}
