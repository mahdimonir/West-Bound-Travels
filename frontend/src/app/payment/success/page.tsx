'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { bookingsService } from '@/lib/services';
import { BookingWithDetails } from '@/lib/services/bookings.service';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const tranId = searchParams.get('tran_id');
  
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const res = await bookingsService.getBooking(bookingId);
        if (res.data) {
          setBooking(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <Card luxury className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your adventure with West Bound Travels has been successfully booked. 
            A confirmation email has been sent to your registered email address.
          </p>

          {booking ? (
            <>
              <div className="bg-luxury-50 rounded-lg p-6 mb-6 border border-luxury-100 text-left">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Booking ID</span>
                    <span className="text-base font-mono font-bold text-luxury-700">{booking.id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-block">
                      {booking.status}
                    </span>
                  </div>
                </div>

                {tranId && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Transaction ID</span>
                    <span className="text-sm font-mono text-gray-700">{tranId}</span>
                  </div>
                )}

                <div className="border-t border-luxury-200 pt-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-3">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Boat:</span>
                      <span className="font-semibold">{booking.boat?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rooms:</span>
                      <span className="font-semibold">
                        {booking.roomsBooked.map(r => `${r.type} (${r.quantity})`).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-luxury-200 pt-2 mt-2">
                      <span className="text-gray-900 font-bold">Total Paid:</span>
                      <span className="text-luxury-600 font-bold">৳{Number(booking.totalPrice || booking.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">What's Next?</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Check your email for detailed booking confirmation</li>
                  <li>• Our team will contact you 24 hours before your trip</li>
                  <li>• Prepare necessary documents and items for the journey</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-luxury-50 rounded-lg p-6 mb-8 border border-luxury-100">
              <p className="text-sm text-gray-600">
                Your payment was successful. Please check your email for booking confirmation details.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/profile?tab=bookings" className="block w-full">
              <Button variant="secondary" className="w-full">
                View My Bookings
              </Button>
            </Link>
            <Link href="/" className="block w-full">
              <Button className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need help? <Link href="/contact" className="text-primary-600 font-semibold hover:underline">Contact Our Support</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
