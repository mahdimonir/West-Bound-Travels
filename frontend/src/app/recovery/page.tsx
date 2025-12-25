'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { useState } from 'react';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recover Password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <Card luxury>
          <div className="p-8">
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Check Your Email</h3>
                  <p className="text-gray-600 mt-2">
                    We've sent a password reset link to <span className="font-bold">{email}</span>.
                  </p>
                </div>
                <Button href="/login" fullWidth variant="primary">
                  Return to Login
                </Button>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button onClick={() => setIsSent(false)} className="text-primary-600 hover:underline">
                    try again
                  </button>
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
