import prisma from "../../config/database.js";
import { deleteImageByUrl, uploadImage } from "../../services/cloudinary.js";

export class DestinationService {
  static async getAllDestinations() {
    return prisma.destination.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async getDestinationById(id: string) {
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) throw { status: 404, message: "Destination not found" };
    return dest;
  }

  static async createDestination(data: {
    name: string;
    description: string;
    imageLocalPaths?: string[];
    images?: string[];
    location?: string;
  }) {
    const images: string[] = [];

    if (data.imageLocalPaths && data.imageLocalPaths.length) {
      for (const p of data.imageLocalPaths) {
        const res: any = await uploadImage(p, "WBTravels/destinations");
        if (res?.secure_url) images.push(res.secure_url);
      }
    }

    if (data.images && data.images.length) images.push(...data.images);

    return prisma.destination.create({
      data: {
        name: data.name,
        description: data.description,
        images,
        location: data.location,
      },
    });
  }

  static async updateDestination(
    id: string,
    data?: {
      name?: string;
      description?: string;
      imageLocalPaths?: string[];
      images?: string[];
      replaceImages?: boolean;
      location?: string;
    }
  ) {
    if (!data) throw { status: 400, message: "Request body is required" };
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) throw { status: 404, message: "Destination not found" };

    let newImages = dest.images || [];

    if (data?.replaceImages) {
      for (const img of newImages) {
        await deleteImageByUrl(img);
      }
      newImages = [];
    }

    if (data.imageLocalPaths && data.imageLocalPaths.length) {
      for (const p of data.imageLocalPaths) {
        const res: any = await uploadImage(p, "WBTravels/destinations");
        if (res?.secure_url) newImages.push(res.secure_url);
      }
    }

    if (data.images && data.images.length) newImages.push(...data.images);

    return prisma.destination.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        images: newImages,
        location: data.location,
      },
    });
  }

  static async deleteDestination(id: string) {
    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) throw { status: 404, message: "Destination not found" };

    if (dest.images && dest.images.length) {
      for (const img of dest.images) {
        await deleteImageByUrl(img);
      }
    }

    return prisma.destination.delete({ where: { id } });
  }
}
