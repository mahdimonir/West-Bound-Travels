'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data for the dashboard
  const user = {
    name: "John Doe",
    email: "john@example.com",
    joined: "Jan 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-600 mt-1">Manage your bookings and profile settings here.</p>
          </div>
          <Link href="/booking">
            <Button variant="luxury">New Booking</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={user.avatar} alt={user.name} className="rounded-full border-4 border-luxury-100" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                <div className="flex justify-center space-x-2">
                  <span className="px-3 py-1 bg-luxury-50 text-luxury-600 text-xs font-bold rounded-full">Explorer</span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-full">Verified</span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center text-sm font-medium">
                <span className="text-gray-500">Member since</span>
                <span className="text-gray-900">{user.joined}</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-xs text-blue-700 font-semibold">Total Trips</div>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <div className="text-2xl font-bold text-primary-600">0</div>
                  <div className="text-xs text-primary-700 font-semibold">Reviews</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-2">
            <Card className="h-full overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Your Bookings</h3>
                <Link href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Booking Info</th>
                      <th className="px-6 py-4 text-center">Date</th>
                      <th className="px-6 py-4 text-center">Amount</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{booking.boat}</div>
                          <div className="text-xs text-gray-400 font-mono">ID: {booking.id}</div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {booking.date}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-900">
                          ৳{booking.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.statusColor}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-luxury-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-8 text-center bg-white">
                <p className="text-gray-500 mb-4 italic text-sm">Need to make changes to your booking? Contact our support team directly.</p>
                <div className="flex justify-center space-x-4">
                  <Link href="/contact" className="text-sm font-bold text-luxury-600 hover:underline flex items-center">
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                     </svg>
                     Support Chat
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
