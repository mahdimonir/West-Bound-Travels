export interface CreateBlogDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
}

export interface UpdateBlogDto {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  status?: "DRAFT" | "PUBLISH";
  tags?: string[];
}
