'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/lib/AuthContext';
import { bookingsService, usersService, type BookingWithDetails } from '@/lib/services';
import { useToast } from '@/lib/toast';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function ProfileContent() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'bookings' | 'reviews'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    preferences: {
      mealType: '',
      notifications: true,
    }
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedData = useRef(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
    isLoading: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // Only fetch data once on initial mount
    if (!hasLoadedData.current) {
      // Fetch fresh user data from server - only on initial mount
      const fetchUserProfile = async () => {
        try {
          setLoadingProfile(true);
          const response = await usersService.getMe();
          if (response.data) {
            const userData = response.data;
            setProfileData({
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: userData.bio || '',
              preferences: {
                mealType: userData.preferences?.mealType || 'Regular',
                notifications: userData.preferences?.notifications ?? true,
              }
            });
            
            // Set avatar if exists
            if (userData.avatar) {
              setProfileImage(userData.avatar);
            }
            
            // Update AuthContext with fresh data
            updateUser(userData);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          toastError('Failed to load profile data');
        } finally {
          setLoadingProfile(false);
        }
      };
      
      fetchUserProfile();

      // Fetch user's bookings
      const fetchBookings = async () => {
        try {
          const response = await bookingsService.getMyBookings();
          if (response.data) {
            setBookings(response.data);
          }
        } catch (error) {
          console.warn('Failed to fetch bookings:', error);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
      
      hasLoadedData.current = true;
    }
    
    // Handle tab from URL (this runs on every searchParams change)
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'profile', 'bookings', 'reviews'].includes(tab)) {
      setActiveTab(tab as typeof activeTab);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const response = await usersService.updateAvatar(file);
      if (response.data?.avatar) {
        updateUser({ avatar: response.data.avatar });
      }
      success('Your profile picture has been updated successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload avatar';
      toastError(message);
    }
  };

  const handleSaveProfile = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Save Profile Changes',
      message: 'Are you sure you want to save these changes to your profile?',
      variant: 'info',
      isLoading: false,
      onConfirm: async () => {
        try {
          // Update loading state in dialog only
          setConfirmDialog(prev => ({ ...prev, isLoading: true }));
          
          // Save to backend
          await usersService.updateMe({
            name: profileData.name,
            phone: profileData.phone,
            bio: profileData.bio,
            preferences: profileData.preferences,
          });
          
          // Silently fetch fresh data from server after successful save (no loading state)
          const response = await usersService.getMe();
          if (response.data) {
            const userData = response.data;
            setProfileData({
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: userData.bio || '',
              preferences: {
                mealType: userData.preferences?.mealType || 'Regular',
                notifications: userData.preferences?.notifications ?? true,
              }
            });
            
            if (userData.avatar) {
              setProfileImage(userData.avatar);
            }
            
            // Update AuthContext with fresh data
            updateUser(userData);
          }
          
          success('Your personal information has been saved.');
          setIsEditingProfile(false);
          setConfirmDialog(prev => ({ ...prev, isOpen: false, isLoading: false }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save profile';
          toastError(message);
          setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to sign out?',
      variant: 'warning',
      onConfirm: () => {
        logout();
        router.push('/');
      },
    });
  };

  // Handle tab change with URL update
  const handleTabChange = (tab: 'overview' | 'profile' | 'bookings' | 'reviews') => {
    setActiveTab(tab);
    // Update URL without page reload using Next.js router
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  };

  // Format booking for display
  const getBookingStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      PENDING: { text: 'Pending Payment', color: 'text-yellow-600 bg-yellow-50' },
      PAID: { text: 'Paid', color: 'text-green-600 bg-green-50' },
      CONFIRMED: { text: 'Confirmed', color: 'text-blue-600 bg-blue-50' },
      COMPLETED: { text: 'Completed', color: 'text-gray-600 bg-gray-50' },
      CANCELLED: { text: 'Cancelled', color: 'text-red-600 bg-red-50' },
      REFUNDED: { text: 'Refunded', color: 'text-purple-600 bg-purple-50' },
    };
    return statusMap[status] || { text: status, color: 'text-gray-600 bg-gray-50' };
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl overflow-hidden">
                {profileImage || user?.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profileImage || user?.avatar || ''} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
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
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name || 'Account Center'}</h1>
              <p className="text-gray-600 mt-1">Manage your identity and travel preferences.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/booking">
              <Button variant="secondary" size="md">New Booking</Button>
            </Link>
            <Button variant="outline" size="md" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-gray-200">
          <div className="flex space-x-8">
            {['overview', 'bookings', 'profile', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab as any)}
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

        {/* Loading State - Only in Content Area */}
        {loadingProfile ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <Card className="p-6 bg-primary-50 border-primary-100">
                    <p className="text-primary-700 text-sm font-bold uppercase tracking-wider mb-2">Total Trips</p>
                    <p className="text-4xl font-black text-primary-900">{bookings.length}</p>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Booking</h3>
                  {loadingBookings ? (
                    <p className="text-gray-500">Loading bookings...</p>
                  ) : bookings.length > 0 ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm border border-gray-100">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{bookings[0].boat?.name}</p>
                          <p className="text-sm text-gray-500">ID: {bookings[0].id} • {new Date(bookings[0].checkIn).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBookingStatusInfo(bookings[0].status).color}`}>
                        {getBookingStatusInfo(bookings[0].status).text}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">No bookings yet. <Link href="/booking" className="text-primary-600 hover:underline">Book your first trip!</Link></p>
                  )}
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
                        <th className="px-6 py-4">Rooms</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loadingBookings ? (
                        <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                      ) : bookings.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No bookings found</td></tr>
                      ) : bookings.map(booking => {
                        const statusInfo = getBookingStatusInfo(booking.status);
                        return (
                          <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-gray-900">{booking.boat?.name || 'Unknown'}</p>
                                {booking.transactionId && (
                                  <p className="text-xs text-gray-500">Txn: {booking.transactionId}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {booking.roomsBooked.map((r, i) => (
                                <div key={i}>{r.type} × {r.quantity}</div>
                              ))}
                            </td>
                            <td className="px-6 py-4 font-bold">৳{Number(booking.totalPrice || booking.price || 0).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {booking.status === 'PENDING' && (
                                <Link href={`/payment?bookingId=${booking.id}`}>
                                  <Button size="sm" variant="secondary" className="text-xs">
                                    Complete Payment
                                  </Button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Meal Type</label>
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
                  
                  {/* Notification Preferences */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-bold text-gray-700">Email Notifications</label>
                          <p className="text-xs text-gray-500 mt-1">Receive booking updates and special offers via email</p>
                        </div>
                        <button
                          type="button"
                          disabled={!isEditingProfile}
                          onClick={() => setProfileData({...profileData, preferences: { ...profileData.preferences, notifications: !profileData.preferences.notifications }})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
                            profileData.preferences.notifications ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
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
                      <Button variant="primary" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
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
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        isLoading={confirmDialog.isLoading}
      />
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
