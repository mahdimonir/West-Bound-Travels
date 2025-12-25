'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const bookingId = "WBT-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <Card luxury className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your adventure with West Bound Travels has been successfully booked. 
            A confirmation email has been sent to your registered email address.
          </p>

          <div className="bg-luxury-50 rounded-lg p-6 mb-8 border border-luxury-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Booking ID</span>
              <span className="text-lg font-mono font-bold text-luxury-700">{bookingId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PAID</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/dashboard" className="block w-full">
              <Button variant="secondary" className="w-full">
                Go to Dashboard
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
              Need help? <Link href="/contact" className="text-primary-600 font-semibold">Contact Our Support</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
