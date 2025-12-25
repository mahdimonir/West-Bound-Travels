'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import boatsData from '@/data/boats.json';
import destinationsData from '@/data/destinations.json';
import { Boat, Destination } from '@/types';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boats = boatsData as Boat[];
  const destinations = destinationsData as Destination[];

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    boatId: '',
    checkIn: '',
    checkOut: '',
    rooms: [] as { type: string; quantity: number }[],
    passengers: 2,
    selectedDestinations: [] as string[],
  });

  // Handle auto-selection and default dates
  useEffect(() => {
    const boatId = searchParams.get('boatId');
    const today = new Date();
    
    // Check-in: 2 days after today
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 2);
    const checkInStr = checkInDate.toISOString().split('T')[0];
    
    // Check-out: check-in + 2 days
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 2);
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    setBookingData(prev => ({
      ...prev,
      boatId: boatId || prev.boatId,
      checkIn: checkInStr,
      checkOut: checkOutStr,
    }));

    if (boatId) {
      setStep(2);
    }
  }, [searchParams]);

  const selectedBoat = boats.find(b => b._id === bookingData.boatId);
  
  const totalDays = bookingData.checkIn && bookingData.checkOut
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalNights = Math.max(0, totalDays - 1);

  // Meal calculation: days * 2 + nights * 1
  const totalMeals = totalDays > 0 ? (totalDays * 2 + totalNights * 1) : 0;

  // Calculate price
  const basePrice = selectedBoat?.type === 'AC' ? 15000 : 10000;
  const roomsTotal = bookingData.rooms.reduce((sum, room) => {
    const roomPrice = room.type.includes('AC') ? 3000 : 2000;
    return sum + (roomPrice * room.quantity);
  }, 0);
  const totalPrice = (basePrice + roomsTotal) * Math.max(totalDays, 1);

  const handleBoatSelect = (boatId: string) => {
    setBookingData(prev => ({ ...prev, boatId, rooms: [] }));
    setStep(2);
  };

  const handleRoomChange = (roomType: string, quantity: number) => {
    setBookingData(prev => {
      const existingRooms = prev.rooms.filter(r => r.type !== roomType);
      if (quantity > 0) {
        return { ...prev, rooms: [...existingRooms, { type: roomType, quantity }] };
      }
      return { ...prev, rooms: existingRooms };
    });
  };

  const handleDestinationToggle = (destination: string) => {
    setBookingData(prev => {
      const selected = prev.selectedDestinations;
      if (selected.includes(destination)) {
        return { ...prev, selectedDestinations: selected.filter(d => d !== destination) };
      } else if (selected.length < 5) {
        return { ...prev, selectedDestinations: [...selected, destination] };
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    // Simulate processing
    const btn = document.querySelector('button[type="button"]'); // This is a bit hacky for a demo
    console.log('Booking Data:', bookingData);
    
    // In actual app, this would be an API call
    setTimeout(() => {
      router.push('/payment/success');
    }, 1500);
  };

  const canProceed = () => {
    if (step === 1) return !!bookingData.boatId;
    if (step === 2) return bookingData.checkIn && bookingData.checkOut && totalDays >= 2;
    if (step === 3) return bookingData.rooms.length > 0;
    if (step === 4) return bookingData.selectedDestinations.length === 5;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Book Your <span className="text-gradient-gold">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Create unforgettable memories on the waters of Tanguar Haor.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[600px] max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-luxury-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 5 && (
                    <div className={`w-16 h-1 ${step > s ? 'bg-luxury-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-3xl mx-auto mt-2 text-sm">
              <span className={step >= 1 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Boat</span>
              <span className={step >= 2 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Dates</span>
              <span className={step >= 3 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Rooms</span>
              <span className={step >= 4 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Places</span>
              <span className={step >= 5 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Boat */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Boat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {boats.map((boat) => (
                    <Card
                      key={boat._id}
                      luxury={bookingData.boatId === boat._id}
                      hover
                      onClick={() => handleBoatSelect(boat._id)}
                      className="cursor-pointer"
                    >
                      <div className="relative h-48">
                        <Image src={boat.images[0]} alt={boat.name} fill className="object-cover" />
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                          boat.type === 'AC' ? 'bg-secondary-500 text-white' : 'bg-accent-500 text-white'
                        }`}>
                          {boat.type}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{boat.name}</h3>
                        <p className="text-sm text-gray-600">{boat.totalRooms} rooms</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Dates */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Dates</h2>
                <Card luxury>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                      <input
                        type="date"
                        value={bookingData.checkIn}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                      <input
                        type="date"
                        value={bookingData.checkOut}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    {totalDays > 0 && (
                      <div className="bg-luxury-50 p-4 rounded-lg">
                        <p className="text-luxury-900 font-semibold">Total: {totalDays} days / {totalDays - 1} nights</p>
                        {totalDays < 2 && <p className="text-red-600 text-sm mt-1">Minimum 2 days required</p>}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Select Rooms */}
            {step === 3 && selectedBoat && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Rooms</h2>
                <div className="space-y-4">
                  {selectedBoat.rooms.map((room, idx) => {
                    const selected = bookingData.rooms.find(r => r.type === room.type);
                    const quantity = selected?.quantity || 0;
                    
                    return (
                      <Card key={idx} luxury={quantity > 0}>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{room.type}</h3>
                              <p className="text-sm text-gray-600">Up to {room.maxPax} guests • {room.count} available</p>
                              <div className="flex gap-2 mt-2">
                                {room.attachBath && (
                                  <span className="text-xs bg-luxury-100 text-luxury-700 px-2 py-1 rounded">Attached Bath</span>
                                )}
                                {room.balcony && (
                                  <span className="text-xs bg-luxury-100 text-luxury-700 px-2 py-1 rounded">Balcony</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleRoomChange(room.type, Math.max(0, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                              <button
                                onClick={() => handleRoomChange(room.type, Math.min(room.count, quantity + 1))}
                                className="w-10 h-10 rounded-full bg-luxury-500 hover:bg-luxury-600 text-white flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Select Destinations */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose 5 Destinations</h2>
                <p className="text-gray-600 mb-6">Selected: {bookingData.selectedDestinations.length}/5</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destinations.map((dest) => {
                    const isSelected = bookingData.selectedDestinations.includes(dest.name);
                    
                    return (
                      <Card
                        key={dest.name}
                        luxury={isSelected}
                        hover
                        onClick={() => handleDestinationToggle(dest.name)}
                        className="cursor-pointer"
                      >
                        <div className="relative h-32">
                          <Image src={dest.images[0]} alt={dest.name} fill className="object-cover" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-8 h-8 bg-luxury-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold">{dest.name}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{dest.description}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Review & Confirm */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
                <Card luxury>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Boat</h3>
                      <p>{selectedBoat?.name} ({selectedBoat?.type})</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Dates</h3>
                      <p>{bookingData.checkIn} to {bookingData.checkOut} ({totalDays} days)</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Rooms</h3>
                      {bookingData.rooms.map((room, idx) => (
                        <p key={idx}>{room.type} × {room.quantity}</p>
                      ))}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Destinations</h3>
                      <div className="flex flex-wrap gap-2">
                        {bookingData.selectedDestinations.map(dest => (
                          <span key={dest} className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm">
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Back
                </Button>
              )}
              {step < 5 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  variant="secondary"
                  disabled={!canProceed()}
                  className="ml-auto disabled:opacity-50"
                >
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="secondary" className="ml-auto">
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div>
            <Card luxury className="sticky top-24">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Base fare</span>
                    <span>৳{basePrice.toLocaleString()}</span>
                  </div>
                  {bookingData.rooms.length > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Rooms</span>
                      <span>৳{roomsTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {totalDays > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>× {totalDays} days</span>
                      <span></span>
                    </div>
                  )}
                  <div className="border-t border-luxury-200 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-luxury-600">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-luxury-50 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>✓ {totalMeals} premium meals</li>
                    <li>✓ All destinations</li>
                    <li>✓ Captain & crew</li>
                    <li>✓ Safety equipment</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading booking...</div>}>
      <BookingContent />
    </Suspense>
  );
}

