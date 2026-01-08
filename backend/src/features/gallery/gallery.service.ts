import prisma from "../../config/database.js";
import { deleteImageByUrl, uploadImage } from "../../services/cloudinary.js";

export class GalleryService {
  static async listAll() {
    return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
  }

  static async createEntry(data: {
    src?: string;
    imageLocalPath?: string;
    alt?: string;
    category: "BOAT" | "DESTINATION" | "NATURE" | "CULCTURE";
  }) {
    let finalSrc = data.src || null;
    if (data.imageLocalPath) {
      const res: any = await uploadImage(
        data.imageLocalPath,
        "WBTravels/gallery"
      );
      finalSrc = res?.secure_url || finalSrc;
    }

    if (!finalSrc) throw { status: 400, message: "Image source is required" };

    return prisma.gallery.create({
      data: { src: finalSrc, alt: data.alt || null, category: data.category },
    });
  }

  static async deleteEntry(id: string) {
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) throw { status: 404, message: "Gallery item not found" };
    await deleteImageByUrl(item.src);
    return prisma.gallery.delete({ where: { id } });
  }
}
