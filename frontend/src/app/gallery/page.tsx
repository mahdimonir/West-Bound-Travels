'use client';

import Button from '@/components/ui/Button';
import Image from 'next/image';
import { useState } from 'react';

const galleryImages = [
  { id: 1, src: '/images/hero-boat.jpg', alt: 'Luxury houseboat exterior', category: 'Boats' },
  { id: 2, src: '/images/destinations/tanguar-haor.jpg', alt: 'Tanguar Haor wetland', category: 'Destinations' },
  { id: 3, src: '/images/destinations/niladri-lake.jpg', alt: 'Niladri Lake turquoise waters', category: 'Destinations' },
  { id: 4, src: '/images/boats/captain-exterior.jpg', alt: 'Captain House Boat', category: 'Boats' },
  { id: 5, src: '/images/destinations/watch-tower.jpg', alt: 'Sunset at Tanguar Haor', category: 'Nature' },
  { id: 6, src: '/images/destinations/niladri-lake.jpg', alt: 'Hills and quarry lake', category: 'Nature' },
  { id: 7, src: '/images/boats/hoarer-exterior.jpg', alt: 'Hoarer Sultan House Boat', category: 'Boats' },
  { id: 8, src: '/images/hero-boat.jpg', alt: 'Houseboat on calm water', category: 'Boats' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const categories = ['All', 'Boats', 'Destinations', 'Nature'];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Photo <span className="text-gradient-gold">Gallery</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Explore stunning visuals of our luxury houseboats and the breathtaking 
            destinations of Tanguar Haor and Sylhet.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <div className="bg-white rounded-xl shadow-elevated p-2 flex gap-2 overflow-x-auto max-w-full whitespace-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-nature text-white shadow-nature'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedImage(image.id)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                  <p className="text-white mt-2 font-medium">{image.alt}</p>
                </div>
              </div>
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 hover:bg-secondary-400 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600">No images found in this category.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-accent-500 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-7xl max-h-full">
            {galleryImages.find(img => img.id === selectedImage) && (
              <div className="relative w-full h-full">
                <Image
                  src={galleryImages.find(img => img.id === selectedImage)!.src}
                  alt={galleryImages.find(img => img.id === selectedImage)!.alt}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[90vh]"
                />
                <p className="text-white text-center mt-4 text-lg">
                  {galleryImages.find(img => img.id === selectedImage)!.alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-nature py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your Own Memories
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your houseboat adventure and capture unforgettable moments at these stunning locations.
          </p>
          <Button href="/booking" variant="secondary" size="lg">
            Book Now
          </Button>
        </div>
      </section>
    </div>
  );
}