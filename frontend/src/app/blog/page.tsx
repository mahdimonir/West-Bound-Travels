import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { blogsService } from '@/lib/services';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    const res = await blogsService.getPublished();
    // Handle nested response structure: res.data.blogs or res.data
    const blogsData = (res.data as any)?.blogs || res.data;
    if (Array.isArray(blogsData)) {
      posts = blogsData;
    } else {
      posts = [];
    }
  } catch (err) {
    console.error('Failed to fetch published blogs:', err);
    posts = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Travel <span className="text-gradient-gold">Blog</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Tips, guides, and stories from our adventures on the waters of Bangladesh
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post._id || index}>
                <Card 
                  hover={true}
                  className="h-full animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                >
                  {/* Featured Image */}
                  <div className="relative h-48 bg-gray-200">
                    <Image
                      src={post.coverImage || post.image || '/images/hero-boat.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>
                        {new Date(post.publishedAt || '').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-nature py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Own Story?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your houseboat adventure and make memories worth blogging about.
          </p>
          <Button href="/booking" variant="secondary" size="lg">
            Book Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}