import boatsData from '@/data/boats.json';
import { Boat } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function FeaturedBoats() {
  const boats: Boat[] = boatsData as unknown as Boat[];
  const featuredBoats = boats.slice(0, 4); // Show all 4 boats

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Premium <span className="text-gradient-gold">Fleet</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of luxury houseboats, each offering unique experiences 
            and premium amenities for your perfect journey.
          </p>
        </div>

        {/* Boats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {featuredBoats.map((boat, index) => (
            <Link href={`/booking?boatId=${boat._id}`} key={boat._id}>
              <Card 
                luxury={true} 
                hover={true}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Boat Image */}
                <div className="relative h-64 bg-gray-200">
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
                </div>

                {/* Boat Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {boat.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {boat.description}
                  </p>

                  {/* Room Info */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">{boat.totalRooms} Rooms</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Up to {Math.max(...boat.rooms.map(r => r.maxPax * r.count))} Guests</span>
                    </div>
                  </div>

                  {/* Room Types Preview */}
                  <div className="border-t border-luxury-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">Room Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {boat.rooms.slice(0, 2).map((room, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-luxury-50 text-luxury-700 px-3 py-1 rounded-full border border-luxury-300"
                        >
                          {room.type} ({room.count})
                        </span>
                      ))}
                      {boat.rooms.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          +{boat.rooms.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button href="/boats" size="lg" variant="primary">
            View All Boats
          </Button>
        </div>
      </div>
    </section>
  );
}
