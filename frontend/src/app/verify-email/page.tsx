'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Email verified successfully! You can now sign in.');
    router.push('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">We've sent a 6-digit code to your email address.</p>
        </div>

        <Card luxury>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="secondary"
                fullWidth
                disabled={isLoading || otp.some(d => !d)}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600 mb-2">Didn't receive the code?</p>
              <button className="text-primary-600 font-bold hover:underline">
                Resend Verification Code
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
