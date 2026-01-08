import { blogsService } from '@/lib/services';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Fetch blog by slug (server-side)
async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await blogsService.getBySlug(slug);
    return res.data || null;
  } catch {
    return null;
  }
}

// Fetch all published blogs for static generation
async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const res = await blogsService.getPublished();
    // Handle nested response structure: res.data.blogs or res.data
    const blogsData = (res.data as any)?.blogs || res.data;
    return Array.isArray(blogsData) ? blogsData.map(b => b.slug) : [];
  } catch {
    return [];
  }
}

/*
// Generate static params for ISR
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map(slug => ({ slug }));
}
*/

import Button from '@/components/ui/Button';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'West Bound Travels Blog',
  };
}

// Page Component
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const postImage = post.coverImage || post.image || '/images/hero-boat.jpg';
  const publishDate = post.publishedAt || post.createdAt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src={postImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary-500/80 text-white px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            {/* Meta */}
            <div className="flex items-center gap-4 text-gray-200 text-sm">
              {post.author && <span>By {post.author}</span>}
              {publishDate && (
                <span>
                  {new Date(publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed border-l-4 border-primary-500 pl-6">
            {post.excerpt}
          </p>
        )}

        {/* Main Content - rendered as HTML */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-gradient-nature py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience It?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your own houseboat adventure and create memories worth sharing.
          </p>
          <Button href="/booking" variant="secondary" size="lg">
            Book Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}
