"use client";

import { destinationsService } from '@/lib/services';
import { Destination } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';

export default function DestinationsTeaser() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsService.getAll();
        if (res.data) setDestinations(res.data);
      } catch (err) {
        console.error('Failed to fetch destinations teaser:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const featured = destinations.slice(0, 4); // Show 4 destinations

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing{' '}
            <span className="text-gradient-primary">Destinations</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore 7 breathtaking locations across Tanguar Haor and Sylhet. 
            Each journey includes visits to 5 handpicked destinations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((destination, index) => (
            <Link 
              href="/destinations" 
              key={destination.name}
              className="group"
            >
              <div 
                className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={destination.images[0] || '/images/placeholder-destination.jpg'}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary-400 transition-colors">
                    {destination.name}
                  </h3>
                  {destination.location && (
                    <p className="text-sm text-gray-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {destination.location}
                    </p>
                  )}
                  <p className="text-sm text-gray-200 line-clamp-2">
                    {destination.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 bg-secondary-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white shadow-xl shadow-primary/20">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book your houseboat journey today and experience the magic of Bangladesh&apos;s waterways. 
            Minimum 2 days, 1 night with 5 premium meals included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/booking" 
              size="lg" 
              variant="secondary"
            >
              Book Now
            </Button>
            <Button 
              href="/destinations" 
              size="lg" 
              variant="outlineSecondary"
            >
              View All Destinations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
