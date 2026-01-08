'use client';

import Card from '@/components/ui/Card';
import { bookingsService, paymentsService } from '@/lib/services';
import { BookingWithDetails } from '@/lib/services/bookings.service';
import { useToast } from '@/lib/toast';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { success, error: toastError } = useToast();
  
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      toastError('Booking ID is missing.');
      router.push('/profile?tab=bookings');
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await bookingsService.getBooking(bookingId);
        if (res.data) {
          // Check if already paid
          if (res.data.status === 'PAID' || res.data.status === 'CONFIRMED' || res.data.status === 'COMPLETED') {
            toastError('This booking has already been paid.');
            router.push('/profile?tab=bookings');
            return;
          }
          setBooking(res.data);
        } else {
          toastError('Booking not found.');
          router.push('/profile?tab=bookings');
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
        toastError('Failed to load booking details.');
        router.push('/profile?tab=bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router, toastError]);

  const handlePaymentInitiate = async () => {
    if (!booking) return;

    setProcessing(true);
    try {
      const payload = {
        bookingId: booking.id,
        amount: Number(booking.totalPrice || booking.price || 0),
      };

      const response = await paymentsService.initiateSSLCommerz(payload);

      if (response.data?.paymentUrl) {
        success('Redirecting to payment gateway...');
        // Redirect to SSLCommerz payment page
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (err) {
      console.error('Failed to initiate payment:', err);
      toastError('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) return null;

  const totalPrice = Number(booking.totalPrice || booking.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure your adventure on the waters of West-Bound Travels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Booking Summary</h2>
            <Card luxury className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-luxury-800">{booking.boat?.name || 'Loading Boat...'}</h3>
                    <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <span className="block text-gray-500 uppercase tracking-wider text-[10px] font-bold">Check-in</span>
                    <span className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 uppercase tracking-wider text-[10px] font-bold">Check-out</span>
                    <span className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <span className="block text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Rooms</span>
                  <div className="space-y-1">
                    {booking.roomsBooked.map((room, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{room.type} × {room.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {booking.boat?.rooms && booking.roomsBooked.length > 0 && (
                  <div className="pt-4 border-t">
                    <span className="block text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-2">Room Details</span>
                    <div className="space-y-2">
                      {booking.roomsBooked.map((bookedRoom, idx) => {
                        const roomDetails = booking.boat?.rooms?.find((r: any) => r.type === bookedRoom.type);
                        if (!roomDetails) return null;
                        return (
                          <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                            <p className="font-semibold">{bookedRoom.type}</p>
                            <p className="text-gray-600">Up to {roomDetails.maxPax} guests</p>
                            {roomDetails.attachBath && <p className="text-gray-600">• Attached Bath</p>}
                            {roomDetails.balcony && <p className="text-gray-600">• Balcony</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-luxury-600">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Method */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Payment Method</h2>
            
            <div className="space-y-4">
              {/* SSLCommerz */}
              <button
                disabled={processing}
                onClick={handlePaymentInitiate}
                className={`w-full group relative overflow-hidden bg-white border-2 border-transparent hover:border-blue-600 rounded-2xl p-6 text-left transition-all duration-300 shadow-md hover:shadow-xl ${
                  processing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image 
                        src="/SSLCOMMERZ-logo.png" 
                        alt="SSLCommerz" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">SSLCommerz</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs font-bold border border-pink-200">bKash</span>
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">Nagad</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-200">Rocket</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold border border-gray-200">Cards</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {processing && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>}
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-700 leading-relaxed">
                By proceeding with payment, you agree to our terms and conditions. Your data is protected by industry-standard encryption.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-600">
                SSLCommerz is a leading payment gateway in Bangladesh, trusted by thousands of businesses. Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment gateway...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
