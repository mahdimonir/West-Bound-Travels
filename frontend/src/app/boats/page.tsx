'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import boatsData from '@/data/boats.json';
import { Boat } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

export default function BoatsPage() {
  const boats: Boat[] = boatsData as unknown as Boat[];
  const [filter, setFilter] = useState<'all' | 'AC' | 'Non-AC'>('all');

  const filteredBoats = filter === 'all' 
    ? boats 
    : boats.filter(boat => boat.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <section className="bg-gradient-hero text-white py-20  overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Our Premium <span className="text-gradient-gold">Fleet</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Choose from our collection of luxury houseboats, each designed to provide 
            the perfect blend of comfort, style, and adventure on the waters of Tanguar Haor.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-elevated p-2 inline-flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Boats
          </button>
          <button
            onClick={() => setFilter('AC')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'AC'
                ? 'bg-secondary-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            AC Boats
          </button>
          <button
            onClick={() => setFilter('Non-AC')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              filter === 'Non-AC'
                ? 'bg-accent-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Non-AC Boats
          </button>
        </div>
      </div>

      {/* Boats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBoats.map((boat, index) => (
            <Card 
              key={boat._id} 
              luxury={true}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
            >
              {/* Boat Image */}
              <div className="relative h-72 bg-gray-200">
                <Image
                  src={boat.images[0] || '/images/placeholder-boat.jpg'}
                  alt={boat.name}
                  fill
                  className="object-cover"
                />
                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className={boat.type === 'AC' ? 'badge-gold shadow-gold' : 'badge-coral shadow-coral'}>
                    {boat.type}
                  </span>
                </div>
                {/* Premium Badge */}
                <div className="absolute top-4 left-4">
                  <span className="badge-primary shadow-primary">
                    Premium
                  </span>
                </div>
              </div>

              {/* Boat Details */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {boat.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {boat.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-luxury-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{boat.totalRooms}</p>
                      <p className="text-sm text-gray-600">Rooms</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.max(...boat.rooms.map(r => r.maxPax * r.count))}
                      </p>
                      <p className="text-sm text-gray-600">Max Guests</p>
                    </div>
                  </div>
                </div>

                {/* Room Types */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-luxury-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Room Types
                  </h3>
                  <div className="space-y-3">
                    {boat.rooms.map((room, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-secondary-500 mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{room.type}</p>
                            <div className="flex gap-2 mt-1">
                              {room.attachBath && (
                                <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                                  Attached Bath
                                </span>
                              )}
                              {room.balcony && (
                                <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                                  Balcony
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{room.count} Room{room.count > 1 ? 's' : ''}</p>
                          <p className="text-xs text-gray-600">Up to {room.maxPax} guests/room</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  href="/booking" 
                  variant="secondary" 
                  fullWidth
                  className="text-lg shadow-gold"
                >
                  Book This Boat
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBoats.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600">No boats found matching your filter.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Sure Which Boat to Choose?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Contact our team for personalized recommendations based on your group size and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="secondary" size="lg" className="shadow-gold">
              Contact Us
            </Button>
            <Button 
              href="/packages" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary-600 border-2 border-white"
            >
              View Packages
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
