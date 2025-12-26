'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/lib/AuthContext';
import { useNotifications } from '@/lib/NotificationContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function ProfileContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'bookings' | 'reviews' | 'gallery'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+880 1XXX-XXXXXX',
    bio: 'Avid traveler and houseboat enthusiast. Exploring the hidden gems of Bangladesh.',
    preferences: {
      mealType: 'Regular',
      notifications: true,
    }
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setProfileData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
      }));
      
      const tab = searchParams.get('tab');
      if (tab && ['overview', 'profile', 'bookings', 'reviews', 'gallery'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, [isAuthenticated, router, user, searchParams]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        addNotification({
          title: 'Profile Updated',
          message: 'Your profile picture has been updated successfully.',
          type: 'success'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    addNotification({
      title: 'Profile Updated',
      message: 'Your personal information has been saved.',
      type: 'success'
    });
  };

  const bookings = [
    {
      id: "WBT-7A2B9C",
      boat: "Blue Wave - AC Luxe",
      date: "2025-05-15",
      total: 45000,
      status: "Upcoming",
      statusColor: "text-blue-600 bg-blue-50"
    },
    {
      id: "WBT-3D5F1G",
      boat: "River Pearl - Non-AC Premium",
      date: "2024-11-10",
      total: 32000,
      status: "Completed",
      statusColor: "text-green-600 bg-green-50"
    }
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0].toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-primary-600 hover:text-primary-700 transition transform hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Center</h1>
              <p className="text-gray-600 mt-1">Manage your identity and travel preferences.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/booking">
              <Button variant="secondary" size="md">New Booking</Button>
            </Link>
            <Button variant="outline" size="md" onClick={logout} className="border-red-200 text-red-600 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-gray-200">
          <div className="flex space-x-8">
            {['overview', 'bookings', 'profile', 'reviews', 'gallery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-sm font-bold capitalize whitespace-nowrap transition-colors relative ${
                  activeTab === tab 
                    ? 'text-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6 bg-primary-50 border-primary-100">
                    <p className="text-primary-700 text-sm font-bold uppercase tracking-wider mb-2">Total Trips</p>
                    <p className="text-4xl font-black text-primary-900">2</p>
                  </Card>
                  <Card className="p-6 bg-secondary-50 border-secondary-100">
                    <p className="text-secondary-700 text-sm font-bold uppercase tracking-wider mb-2">Miles Traveled</p>
                    <p className="text-4xl font-black text-secondary-900">145</p>
                  </Card>
                  <Card className="p-6 bg-accent-50 border-accent-100">
                    <p className="text-accent-700 text-sm font-bold uppercase tracking-wider mb-2">Reviews</p>
                    <p className="text-4xl font-black text-accent-900">0</p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Booking</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{bookings[0].boat}</p>
                        <p className="text-sm text-gray-500">ID: {bookings[0].id} • May 15, 2025</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${bookings[0].statusColor}`}>
                      {bookings[0].status}
                    </span>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'bookings' && (
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Full Booking History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Boat / Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900">{b.boat}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{b.date}</td>
                          <td className="px-6 py-4 font-bold">৳{b.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.statusColor}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        disabled={!isEditingProfile}
                        value={profileData.name}
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={profileData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        disabled={!isEditingProfile}
                        value={profileData.phone}
                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Prefered Meal Type</label>
                      <select 
                        disabled={!isEditingProfile}
                        value={profileData.preferences.mealType}
                        onChange={e => setProfileData({...profileData, preferences: { ...profileData.preferences, mealType: e.target.value }})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 transition"
                      >
                        <option>Regular</option>
                        <option>Vegetarian</option>
                        <option>Seafood Specialist</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">About You (Bio)</label>
                    <textarea 
                      disabled={!isEditingProfile}
                      rows={4}
                      value={profileData.bio}
                      onChange={e => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 transition resize-none"
                    ></textarea>
                  </div>
                  {isEditingProfile && (
                    <div className="pt-4">
                      <Button variant="primary" onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  )}
                </form>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Trip</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                      <option>River Pearl - Nov 10, 2024</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2 text-gold-500">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gold-50 text-2xl">★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Experience</label>
                    <textarea 
                      rows={4} 
                      placeholder="Tell us about your trip..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    ></textarea>
                  </div>
                  <Button variant="secondary" fullWidth>Post Review</Button>
                </div>
              </Card>
            )}

            {activeTab === 'gallery' && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Trip Photos</h3>
                <div className="border-4 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900">Drop your photos here</p>
                  <p className="text-gray-500 mt-2">or click to browse your files (JPEG, PNG up to 10MB)</p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                    Placeholder
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-luxury-900 text-white border-none shadow-luxury">
              <h3 className="text-xl font-bold mb-4">Membership</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl">
                  <p className="text-luxury-200 text-xs font-bold uppercase mb-1">Current Level</p>
                  <p className="text-xl font-bold">Explorer Member</p>
                </div>
                <div className="p-4 bg-white/10 rounded-xl">
                  <p className="text-luxury-200 text-xs font-bold uppercase mb-1">Points Balance</p>
                  <p className="text-xl font-bold">1,250 WBT</p>
                </div>
              </div>
              <Button variant="secondary" fullWidth className="mt-6 shadow-gold">Redeem Rewards</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Support</h3>
              <p className="text-sm text-gray-600 mb-4">Have questions regarding your upcoming trip or need to cancel?</p>
              <Button href="/contact" variant="outline" fullWidth>Get Help</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

