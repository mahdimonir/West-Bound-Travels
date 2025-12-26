'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import boatsData from '@/data/boats.json';
import { useAuth } from '@/lib/AuthContext';
import { useNotifications } from '@/lib/NotificationContext';
import { Boat } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'boats' | 'destinations' | 'users' | 'blogs' | 'gallery' | 'static'>('overview');

  const triggerAction = (action: string) => {
    addNotification({
      title: 'Admin Action',
      message: `${action} was successful. This change is now live.`,
      type: 'success'
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin' && user?.role !== 'moderator') {
      router.push('/profile');
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
              { id: 'blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 3v5h5', label: 'Blogs' },
              { id: 'gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Gallery' },
              { id: 'static', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Static Pages' },
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

        {activeTab === 'blogs' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Blog Management</h3>
                <Button variant="secondary" size="sm" onClick={() => triggerAction('Creating a new blog post')}>+ Create New Post</Button>
              </div>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">Image</div>
                      <div>
                        <p className="font-bold text-gray-900">How to Prepare for Your Tanguar Haor Trip</p>
                        <p className="text-xs text-gray-500">Published: Dec 20, 2025 • 1,240 Views</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => triggerAction('Editing blog')} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                       <button onClick={() => triggerAction('Deleting blog')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        )}

        {activeTab === 'gallery' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Gallery Manager</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                    <option>All Destinations</option>
                    <option>Tanguar Haor</option>
                  </select>
                  <Button variant="secondary" size="sm" onClick={() => triggerAction('Photo upload')}>+ Upload Photo</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-100 cursor-pointer">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 z-10">
                       <button onClick={() => triggerAction('Deleting photo')} className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50 transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">Photo {i}</div>
                  </div>
                ))}
              </div>
           </Card>
        )}

        {activeTab === 'static' && (
           <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">Static Content Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Privacy Policy', lastUpdate: '2025-01-15' },
                  { title: 'Terms & Conditions', lastUpdate: '2025-01-15' },
                  { title: 'About Us', lastUpdate: '2025-02-10' },
                  { title: 'FAQ Section', lastUpdate: '2025-03-01' },
                  { title: 'Contact Info', lastUpdate: '2025-03-05' },
                ].map(page => (
                  <div key={page.title} className="p-5 border border-gray-100 rounded-2xl hover:border-primary-200 transition bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-500 mt-1">Last Update: {page.lastUpdate}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded">Active</span>
                    </div>
                    <Button variant="outline" size="sm" fullWidth className="bg-white" onClick={() => triggerAction(`Editing ${page.title}`)}>Edit Content</Button>
                  </div>
                ))}
              </div>
           </Card>
        )}
      </main>
    </div>
  );
}
