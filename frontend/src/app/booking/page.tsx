'use client';

export const dynamic = 'force-dynamic';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/lib/AuthContext';
import { boatsService, bookingsService, BookingWithDetails } from '@/lib/services';
import { useToast } from '@/lib/toast';
import { Boat } from '@/types';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { success, warning, error: toastError } = useToast();
  
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [minNights, setMinNights] = useState(1);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    boatId: '',
    checkIn: '',
    checkOut: '',
    rooms: [] as { type: string; quantity: number }[],
    passengers: 2,
  });

  const [availability, setAvailability] = useState<Record<string, { total: number; booked: number; available: number }>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Fetch boats and min nights setting
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boatsRes, minNightsRes] = await Promise.all([
          boatsService.getBoats(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/min-nights`).then(r => r.json())
        ]);
        if (boatsRes.data) setBoats(boatsRes.data);
        if (minNightsRes.success && minNightsRes.data?.minNights) {
          setMinNights(minNightsRes.data.minNights);
        }
      } catch (err) {
        console.error('Failed to fetch booking data:', err);
        toastError('Failed to load booking information.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toastError]);

  // Handle auto-selection and default dates
  useEffect(() => {
    const boatId = searchParams.get('boatId');
    const today = new Date();
    
    // Check-in: 2 days after today
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 2);
    const checkInStr = checkInDate.toISOString().split('T')[0];
    
    // Check-out: check-in + minNights
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + minNights);
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
  }, [searchParams, minNights]);

  const selectedBoat = boats.find(b => b.id === bookingData.boatId);
  
  // Calculate days and nights correctly
  // 0 nights = same day (check-in and check-out same date)
  // 1 night = next day (check-in: 1/1/26, check-out: 2/1/26)
  const totalNights = bookingData.checkIn && bookingData.checkOut
    ? Math.max(0, Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const totalDays = totalNights + 1; // Days is always nights + 1

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

  // Fetch availability automatically when dates/boat change
  useEffect(() => {
    const fetchAvailability = async () => {
      // Only fetch if we have valid boat and future dates
      if (bookingData.boatId && bookingData.checkIn && bookingData.checkOut) {
        // Debounce or just fetch. Since user picks date, it's fine to fetch.
        setCheckingAvailability(true);
        try {
          const res = await bookingsService.checkAvailability(
            bookingData.boatId,
            bookingData.checkIn,
            bookingData.checkOut
          );
          if (res.success && res.data) {
            setAvailability(res.data);
            
            // Clear invalid selections if quantity exceeds available
            setBookingData(prev => {
              const validRooms = prev.rooms.map(room => {
                const avail = res.data![room.type]?.available || 0;
                return { ...room, quantity: Math.min(room.quantity, avail) };
              }).filter(r => r.quantity > 0);
              
              return { ...prev, rooms: validRooms };
            });
          }
        } catch (err) {
          console.error("Failed to check availability", err);
          // Don't toast error on every change, just log it.
        } finally {
          setCheckingAvailability(false);
        }
      }
    };

    fetchAvailability();
  }, [bookingData.boatId, bookingData.checkIn, bookingData.checkOut]);

  const handleRoomChange = (roomType: string, quantity: number) => {
    setBookingData(prev => {
      const existingRooms = prev.rooms.filter(r => r.type !== roomType);
      if (quantity > 0) {
        return { ...prev, rooms: [...existingRooms, { type: roomType, quantity }] };
      }
      return { ...prev, rooms: existingRooms };
    });
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      warning('Please login to complete your booking.');
      router.push('/login?redirect=/booking');
      return;
    }

    setIsSubmitting(true);
    try {
      const response: { data?: BookingWithDetails } = await bookingsService.createBooking({
        boatId: bookingData.boatId,
        roomsBooked: bookingData.rooms,
        dates: { checkIn: bookingData.checkIn, checkOut: bookingData.checkOut },
        pax: bookingData.passengers,
        places: ["Tanguar Haor (All Sites)"], // Default all destinations
      });

      success('Booking created! Redirecting to payment...');

      // Redirect to payment page with booking ID
      const bookingId = response.data?.id;
      router.push(bookingId ? `/payment?bookingId=${bookingId}` : '/payment');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create booking';
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!bookingData.boatId;
    if (step === 2) return bookingData.checkIn && bookingData.checkOut && totalNights >= minNights;
    if (step === 3) return bookingData.rooms.length > 0;
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
        {/* Progress Steps - Now 4 steps instead of 5 */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[600px] max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-luxury-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`w-24 h-1 ${step > s ? 'bg-luxury-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between max-w-3xl mx-auto mt-2 text-sm">
              <span className={step >= 1 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Boat</span>
              <span className={step >= 2 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Dates</span>
              <span className={step >= 3 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Rooms</span>
              <span className={step >= 4 ? 'text-luxury-600 font-semibold' : 'text-gray-500'}>Review</span>
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
                      key={boat.id}
                      luxury={bookingData.boatId === boat.id}
                      hover
                      onClick={() => handleBoatSelect(boat.id)}
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
                        <p className="text-luxury-900 font-semibold">Total: {totalDays} days / {totalNights} nights</p>
                        {totalNights < minNights && <p className="text-red-600 text-sm mt-1">Minimum {minNights} night{minNights > 1 ? 's' : ''} required</p>}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Select Rooms */}
            {step === 3 && selectedBoat && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Rooms</h2>
                  {checkingAvailability && (
                    <span className="text-xs font-semibold text-luxury-600 bg-luxury-50 px-3 py-1 rounded-full animate-pulse">
                      Updating availability...
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                  {selectedBoat.rooms && Array.isArray(selectedBoat.rooms) && selectedBoat.rooms.map((room, idx) => {
                    const selected = bookingData.rooms.find(r => r.type === room.type);
                    const quantity = selected?.quantity || 0;
                    
                    // Use dynamic availability
                    const roomAvail = availability[room.type];
                    // If fetching, assume available (unless we have old data showing sold out)
                    // If roomAvail exists, use it. Else fallback to total count.
                    const availableCount = roomAvail ? roomAvail.available : room.count;
                    const isSoldOut = availableCount <= 0;

                    return (
                      <Card key={idx} luxury={quantity > 0}>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg text-gray-900">{room.type}</h3>
                                {isSoldOut && (
                                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">SOLD OUT</span>
                                )}
                                {!isSoldOut && roomAvail && (
                                  <span className={`${availableCount <= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} text-xs font-bold px-2 py-1 rounded`}>
                                    {availableCount} left
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">Up to {room.maxPax} guests • {isSoldOut ? 'No rooms available' : `${availableCount} available for your dates`}</p>
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
                                disabled={quantity === 0}
                                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-600"
                              >
                                -
                              </button>
                              <span className="text-xl font-bold w-4 text-center">{quantity}</span>
                              <button
                                onClick={() => handleRoomChange(room.type, quantity + 1)}
                                disabled={quantity >= availableCount}
                                className="w-10 h-10 rounded-full bg-luxury-600 hover:bg-luxury-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {(!selectedBoat.rooms || selectedBoat.rooms.length === 0) && (
                    <p className="text-gray-500 text-center py-8">No rooms available for this boat.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
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
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Note:</strong> All destinations in Tanguar Haor will be visited during your trip.
                      </p>
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
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  variant="secondary"
                  disabled={!canProceed()}
                  className="ml-auto disabled:opacity-50"
                >
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} variant="secondary" className="ml-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Proceed to Payment'}
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
