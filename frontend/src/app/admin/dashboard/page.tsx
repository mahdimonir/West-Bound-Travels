'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import boatsData from '@/data/boats.json';
import { useAuth } from '@/lib/AuthContext';
import { Boat } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'boats' | 'destinations' | 'users'>('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin' && user?.role !== 'moderator') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const stats = [
    { label: 'Total Revenue', value: '৳1,250,000', change: '+12.5%', color: 'text-green-600' },
    { label: 'Active Bookings', value: '24', change: '+3', color: 'text-blue-600' },
    { label: 'Total Users', value: '842', change: '+24', color: 'text-primary-600' },
    { label: 'Fleet Status', value: '85%', change: 'Normal', color: 'text-gold-600' },
  ];

  if (user?.role !== 'admin' && user?.role !== 'moderator') return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-900 text-white min-h-screen hidden lg:block">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center font-bold">W</div>
            <span className="font-bold text-lg">Admin Portal</span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: 'M4 6h16M4 12h16M4 18h16', label: 'Overview' },
              { id: 'bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Bookings' },
              { id: 'boats', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Boats' },
              { id: 'destinations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: 'Destinations' },
              { id: 'users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', label: 'Users' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab} Interface</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{user?.role}</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-white">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(stat => (
                <Card key={stat.label} className="p-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    <p className={`text-xs font-bold ${stat.color}`}>{stat.change}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Bookings</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Boat</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1,2,3].map(i => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">Customer {i}</p>
                          <p className="text-xs text-gray-500">cust{i}@example.com</p>
                        </td>
                        <td className="px-6 py-4">River Pearl</td>
                        <td className="px-6 py-4">May 1{i}, 2025</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">Confirmed</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-primary-600 font-bold hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
           <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">Master Booking Manager</h3>
              <p className="text-gray-500">Manage all customer reservations and status updates here.</p>
              {/* Implementation details for booking management */}
           </Card>
        )}

        {activeTab === 'boats' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Fleet Management</h3>
                <Button variant="secondary" size="sm">+ Add New Boat</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(boatsData as unknown as Boat[]).map(boat => (
                  <div key={boat._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <p className="font-bold">{boat.name}</p>
                    <p className="text-xs text-gray-500 mb-4">{boat.type} • {boat.totalRooms} Rooms</p>
                    <div className="flex gap-2">
                       <button className="text-xs font-bold text-primary-600 transition hover:text-primary-700">Edit Details</button>
                       <button className="text-xs font-bold text-red-600 transition hover:text-red-700">Deactivate</button>
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        )}

        {activeTab === 'destinations' && (
           <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">Destination Hub</h3>
              <p className="text-gray-500 italic">Manage the places that your customers will visit.</p>
           </Card>
        )}

        {activeTab === 'users' && (
           <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">User & Access Management</h3>
              <p className="text-gray-500">Control user roles and permissions for your staff.</p>
           </Card>
        )}
      </main>
    </div>
  );
}
