"use client";

import Button from '@/components/ui/Button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-8 text-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* 404 SVG Illustration */}
        <div className="mb-8 animate-fade-in-up">
          <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Boat illustration */}
            <g className="animate-float">
              <path d="M40 120 L160 120 L150 140 L50 140 Z" fill="url(#boat-gradient)" stroke="#0284c7" strokeWidth="2"/>
              <path d="M75 100 L125 100 L120 120 L80 120 Z" fill="url(#cabin-gradient)" stroke="#0369a1" strokeWidth="2"/>
              <circle cx="100" cy="110" r="3" fill="#fff"/>
              {/* Waves */}
              <path d="M20 145 Q30 140 40 145 T60 145 T80 145 T100 145 T120 145 T140 145 T160 145 T180 145" stroke="#0ea5e9" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M10 155 Q20 150 30 155 T50 155 T70 155 T90 155 T110 155 T130 155 T150 155 T170 155 T190 155" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.4"/>
            </g>
            <defs>
              <linearGradient id="boat-gradient" x1="40" y1="120" x2="160" y2="140">
                <stop offset="0%" stopColor="#0284c7"/>
                <stop offset="100%" stopColor="#0369a1"/>
              </linearGradient>
              <linearGradient id="cabin-gradient" x1="75" y1="100" x2="125" y2="120">
                <stop offset="0%" stopColor="#f59e0b"/>
                <stop offset="100%" stopColor="#d97706"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          404
        </h1>

        {/* Message */}
        <div className="mb-8 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold text-gray-900">Lost at Sea?</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Looks like this page has sailed away. Don&apos;t worry, there are plenty of amazing destinations waiting for you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button href="/" variant="primary" size="lg" className="shadow-luxury">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Button>
          <Button href="/boats" variant="secondary" size="lg" className="shadow-gold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Explore Fleet
          </Button>
        </div>

        {/* Additional Quick Links */}
        <div className="pt-8 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/destinations" className="px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition">
              Destinations
            </Link>
            <Link href="/packages" className="px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition">
              Packages
            </Link>
            <Link href="/gallery" className="px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition">
              Gallery
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Floating animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
