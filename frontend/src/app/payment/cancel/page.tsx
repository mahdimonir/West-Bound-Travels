'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <Card className="text-center p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">
            You have cancelled the payment process. Your booking is still pending and can be completed anytime.
          </p>

          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="text-left space-y-2">
                <div>
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Booking ID</span>
                  <span className="text-base font-mono font-bold text-gray-700">{bookingId}</span>
                </div>
                {tranId && (
                  <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Transaction ID</span>
                    <span className="text-sm font-mono text-gray-700">{tranId}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold block mb-1">Status</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold inline-block">
                    PENDING
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Your Booking is Safe</h4>
            <p className="text-xs text-blue-700">
              Your booking has been saved and is waiting for payment. You can complete the payment anytime from your bookings page.
            </p>
          </div>

          <div className="space-y-4">
            {bookingId && (
              <Link href={`/payment?bookingId=${bookingId}`} className="block w-full">
                <Button variant="secondary" className="w-full">
                  Complete Payment Now
                </Button>
              </Link>
            )}
            <Link href="/profile?tab=bookings" className="block w-full">
              <Button className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
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
              Questions? <Link href="/contact" className="text-primary-600 font-semibold hover:underline">Contact Us</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}
