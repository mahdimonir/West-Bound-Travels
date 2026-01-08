'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';


const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, mutate } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/mark-all-read');
      // Optimistically update the UI
      mutate();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Fleet', href: '/boats' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Packages', href: '/packages' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-gradient-primary">West Bound Travels</span>
              <p className="text-xs text-gray-600">Explore Luxury Waters</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth/CTA Button */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => {
                      setShowNotificationDropdown(!showNotificationDropdown);
                      setShowProfileDropdown(false);
                    }}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition relative"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotificationDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button onClick={markAllAsRead} className="text-xs text-primary-600 font-bold hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition ${!n.read ? 'bg-primary-50/50' : ''}`}>
                              <p className="text-sm font-bold text-gray-900">{n.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2 uppercase">{new Date(n.timestamp).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <p className="text-sm italic">No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotificationDropdown(false);
                    }}
                    className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold ring-2 ring-primary-50 border-2 border-white overflow-hidden relative">
                      {user?.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                      {/* User Info Header */}
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-100 px-2 py-0.5 rounded inline-block">
                          {user?.role || 'Guest'}
                        </div>
                      </div>
                      
                      {/* Menu Links */}
                      <div className="p-2 space-y-1">
                        {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                          <Link 
                            href="/dashboard"
                            className="flex items-center space-x-3 px-3 py-2 text-sm font-bold text-luxury-900 hover:bg-primary-50 rounded-lg transition"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Dashboard</span>
                          </Link>
                        )}
                        <Link 
                          href="/profile?tab=profile"
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-primary-50 rounded-lg transition"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Manage Account</span>
                        </Link>
                        <Link 
                          href="/profile?tab=bookings"
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-primary-50 rounded-lg transition"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>My Bookings</span>
                        </Link>
                        <Link 
                          href="/profile?tab=reviews"
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-primary-50 rounded-lg transition"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>My Reviews</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={() => { logout(); setShowProfileDropdown(false); }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button href="/login" size="sm" variant="secondary" className="shadow-gold px-8">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-4 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 px-3 py-2 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold overflow-hidden">
                      {user?.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href="/profile?tab=bookings" 
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Bookings
                    </Link>
                    <Link 
                      href="/profile?tab=reviews" 
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary-50 text-secondary-700 text-xs font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Reviews
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                      <Link 
                        href="/dashboard"
                        className="block px-3 py-2 rounded-lg text-base font-bold text-primary-600 hover:bg-primary-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      className="block px-3 py-2 rounded-lg text-base font-bold text-gray-700 hover:bg-primary-50"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-base font-bold text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Button href="/login" fullWidth variant="secondary" className="shadow-gold py-4" onClick={() => setIsOpen(false)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default React.memo(Navbar);
