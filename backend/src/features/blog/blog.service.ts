import prisma from "../../config/database.js";
import { deleteImageByUrl, uploadImage } from "../../services/cloudinary.js";

export class BlogService {
  // Get all published blogs (public)
  static async getPublished(options?: { limit?: number; offset?: number }) {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISH" },
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.blog.count({ where: { status: "PUBLISH" } });

    return {
      blogs,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
    };
  }

  // Get single blog by slug (public)
  static async getBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog || blog.status === "DRAFT") {
      throw { status: 404, message: "Blog not found" };
    }

    return blog;
  }

  // Admin: Get all blogs (including drafts)
  static async getAll(options?: { limit?: number; offset?: number }) {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      skip: options?.offset,
    });

    const total = await prisma.blog.count();

    return {
      blogs,
      pagination: {
        total,
        limit: options?.limit,
        offset: options?.offset || 0,
      },
    };
  }

  // Admin: Create blog
  static async create(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    images?: string[];
    tags?: any;
  }) {
    const existing = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw { status: 400, message: "Blog with this slug already exists" };
    }

    let coverImageUrl = null;
    if (data.coverImage) {
      try {
        const res = await uploadImage(data.coverImage, "WBTravels/blog");
        coverImageUrl = res?.secure_url;
      } catch (error) {
        console.error("Failed to upload cover image:", error);
      }
    }

    let uploadedImages: string[] = [];
    if (data.images && data.images.length > 0) {
      for (const imagePath of data.images) {
        try {
          const res: any = await uploadImage(imagePath, "WBTravels/blog");
          if (res?.secure_url) uploadedImages.push(res.secure_url);
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    }

    let formattedTags: string[] = [];
    if (typeof data.tags === "string") {
      formattedTags = data.tags.split(",").map((tag) => tag.trim());
    } else if (Array.isArray(data.tags)) {
      formattedTags = data.tags;
    }

    return prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: coverImageUrl,
        images: uploadedImages,
        status: "DRAFT",
        tags: formattedTags,
      },
    });
  }

  // Admin: Update blog
  static async update(
    id: string,
    data: {
      title?: string;
      excerpt?: string;
      content?: string;
      coverImage?: string;
      images?: string[];
      status?: "DRAFT" | "PUBLISH";
      tags?: any;
    }
  ) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw { status: 404, message: "Blog not found" };
    }

    let coverImageUrl = blog.coverImage;
    if (data.coverImage) {
      if (blog.coverImage) {
        await deleteImageByUrl(blog.coverImage);
      }
      try {
        const res: any = await uploadImage(data.coverImage, "WBTravels/blog");
        coverImageUrl = res?.secure_url || coverImageUrl;
      } catch (error) {
        console.error("Failed to upload cover image:", error);
      }
    }

    let finalImages = blog.images;
    if (data.images && data.images.length > 0) {
      // Delete old images
      for (const oldImage of blog.images) {
        await deleteImageByUrl(oldImage);
      }
      // Upload new images
      finalImages = [];
      for (const imagePath of data.images) {
        try {
          const res: any = await uploadImage(imagePath, "WBTravels/blog");
          if (res?.secure_url) finalImages.push(res.secure_url);
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    }

    let formattedTags: string[] = [];
    if (typeof data.tags === "string") {
      // Splits "tag1, tag2" into ["tag1", "tag2"]
      formattedTags = data.tags.split(",").map((tag) => tag.trim());
    } else if (Array.isArray(data.tags)) {
      formattedTags = data.tags;
    }

    return prisma.blog.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.excerpt && { excerpt: data.excerpt }),
        ...(data.content && { content: data.content }),
        ...(data.status && { status: data.status }),
        ...(formattedTags && { tags: formattedTags }),
        coverImage: coverImageUrl,
        images: finalImages,
      },
    });
  }

  // Admin: Delete blog
  static async delete(id: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw { status: 404, message: "Blog not found" };
    }

    // Delete images from cloudinary
    if (blog.coverImage) {
      await deleteImageByUrl(blog.coverImage);
    }
    for (const image of blog.images) {
      await deleteImageByUrl(image);
    }

    await prisma.blog.delete({ where: { id } });
    return { success: true, message: "Blog deleted successfully" };
  }

  // Admin: Publish/Unpublish blog
  static async updateStatus(id: string, status: "DRAFT" | "PUBLISH") {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      throw { status: 404, message: "Blog not found" };
    }

    return prisma.blog.update({
      where: { id },
      data: { status },
    });
  }
}

export const blogService = new BlogService();
