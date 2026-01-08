'use client';

import BlogEditor from '@/components/admin/BlogEditor';
import BoatForm from '@/components/dashboard/BoatForm';
import DestinationForm from '@/components/dashboard/DestinationForm';
import GalleryForm from '@/components/dashboard/GalleryForm';
import Card from '@/components/ui/Card';
import { useBlogs, useBoats, useBookings, useDestinations, useGallery, useUsers } from '@/hooks/useDashboardData';
import { useAuth } from '@/lib/AuthContext';
import { blogsService, boatsService, bookingsService, destinationsService, galleryService, usersService, type BlogWithDetails } from '@/lib/services';
import { useToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { showToast, success, error: toastError } = useToast();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'boats' | 'destinations' | 'users' | 'blogs' | 'gallery'>('overview');
  
  // SWR Data fetching
  const { boats, isLoading: boatsLoading, mutate: mutateBoats } = useBoats();
  const { bookings, isLoading: bookingsLoading, mutate: mutateBookings } = useBookings();
  const { blogs, isLoading: blogsLoading, mutate: mutateBlogs } = useBlogs();
  const { galleryItems, isLoading: galleryLoading, mutate: mutateGallery } = useGallery();
  const { users, isLoading: usersLoading, mutate: mutateUsers } = useUsers();
  const { destinations, isLoading: destinationsLoading, mutate: mutateDestinations } = useDestinations();
  
  // Modal states
  const [showBoatModal, setShowBoatModal] = useState(false);
  const [editingBoat, setEditingBoat] = useState<any>(null);
  const [boatSaving, setBoatSaving] = useState(false);
  
  const [showDestModal, setShowDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState<any>(null);
  const [destSaving, setDestSaving] = useState(false);
  
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [gallerySaving, setGallerySaving] = useState(false);
  
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogWithDetails | null>(null);

  // Auth check
  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR')) {
    router.push('/login');
    return null;
  }

  // Boat CRUD
  const openBoatForm = (boat?: any) => {
    setEditingBoat(boat || null);
    setShowBoatModal(true);
  };

  const saveBoat = async (data: any, files: FileList | null) => {
    setBoatSaving(true);
    try {
      if (editingBoat) {
        await boatsService.updateBoat(editingBoat.id, data, files || undefined);
        success('Boat updated successfully');
      } else {
        await boatsService.createBoat(data, files || undefined);
        success('Boat created successfully');
      }
      mutateBoats(); // Revalidate SWR
      setShowBoatModal(false);
    } catch (err: any) {
      toastError(err.message || 'Failed to save boat');
    } finally {
      setBoatSaving(false);
    }
  };

  const deleteBoat = async (id: string) => {
    if (!confirm('Delete this boat?')) return;
    try {
      await boatsService.deleteBoat(id);
      mutateBoats();
      success('Boat deleted');
    } catch (err) {
      toastError('Failed to delete boat');
    }
  };

  // Destination CRUD
  const openDestForm = (dest?: any) => {
    setEditingDest(dest || null);
    setShowDestModal(true);
  };

  const saveDest = async (data: any, files: FileList | null) => {
    setDestSaving(true);
    try {
      if (editingDest) {
        await destinationsService.updateDestination(editingDest.id, data, files || undefined);
        success('Destination updated');
      } else {
        await destinationsService.createDestination(data, files || undefined);
        success('Destination created');
      }
      mutateDestinations();
      setShowDestModal(false);
    } catch (err: any) {
      toastError(err.message || 'Failed to save destination');
    } finally {
      setDestSaving(false);
    }
  };

  const deleteDest = async (id: string) => {
    if (!confirm('Delete this destination?')) return;
    try {
      await destinationsService.deleteDestination(id);
      mutateDestinations();
      success('Destination deleted');
    } catch (err) {
      toastError('Failed to delete destination');
    }
  };

  // Gallery CRUD
  const saveGalleryItem = async (data: { alt: string; category: string }, file: File) => {
    setGallerySaving(true);
    try {
      // Convert File to FileList for the service
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;
      
      await galleryService.create(
        { caption: data.alt, category: data.category },
        fileList
      );
      mutateGallery();
      setShowGalleryModal(false);
      success('Image uploaded successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to upload image');
    } finally {
      setGallerySaving(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryService.remove(id);
      mutateGallery();
      success('Image deleted');
    } catch (err) {
      toastError('Failed to delete image');
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'PAID' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, change: 'Real-time', color: 'text-green-600' },
    { label: 'Active Bookings', value: String(bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length), change: 'Active', color: 'text-blue-600' },
    { label: 'Total Users', value: String(users.length), change: `+${users.length}`, color: 'text-primary-600' },
  ];

  const loading = boatsLoading || bookingsLoading || blogsLoading || galleryLoading || usersLoading || destinationsLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Modals */}
      <Modal isOpen={showBoatModal} onClose={() => setShowBoatModal(false)} title={editingBoat ? 'Edit Boat' : 'Add New Boat'}>
        <BoatForm
          boat={editingBoat}
          onSave={saveBoat}
          onCancel={() => setShowBoatModal(false)}
          isSaving={boatSaving}
        />
      </Modal>

      <Modal isOpen={showDestModal} onClose={() => setShowDestModal(false)} title={editingDest ? 'Edit Destination' : 'Add Destination'}>
        <DestinationForm
          destination={editingDest}
          onSave={saveDest}
          onCancel={() => setShowDestModal(false)}
          isSaving={destSaving}
        />
      </Modal>

      <Modal isOpen={showGalleryModal} onClose={() => setShowGalleryModal(false)} title="Upload Image">
        <GalleryForm
          onSave={saveGalleryItem}
          onCancel={() => setShowGalleryModal(false)}
          isSaving={gallerySaving}
        />
      </Modal>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <button onClick={() => setActiveTab('bookings')} className="text-sm text-primary-600 hover:underline font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Boat</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No bookings found</td></tr>
                    ) : bookings.slice(0, 5).map(b => {
                        const statusColors: Record<string, string> = {
                          PENDING: 'bg-yellow-50 text-yellow-600',
                          CONFIRMED: 'bg-blue-50 text-blue-600',
                          COMPLETED: 'bg-green-50 text-green-600',
                          CANCELLED: 'bg-red-50 text-red-600',
                          PAID: 'bg-purple-50 text-purple-600',
                        };
                        return (
                          <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{b.user?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{b.user?.email || '-'}</p>
                            </td>
                            <td className="px-6 py-4">{b.boat?.name || 'Unknown'}</td>
                            <td className="px-6 py-4">{b.checkIn}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${statusColors[b.status] || 'bg-gray-50 text-gray-600'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Master Booking Manager</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Booking ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Boat</th>
                      <th className="px-4 py-3">Dates</th>
                      <th className="px-4 py-3">Pax</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading bookings...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No bookings found</td></tr>
                    ) : bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{booking.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{booking.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{booking.user?.email || '-'}</p>
                        </td>
                        <td className="px-4 py-3">{booking.boat?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-xs">
                          {booking.checkIn} → {booking.checkOut}
                        </td>
                        <td className="px-4 py-3">{booking.pax}</td>
                        <td className="px-4 py-3 font-medium">৳{booking.price?.toLocaleString() || '-'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={booking.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as any;
                              try {
                                await bookingsService.updateBookingStatus(booking.id, newStatus);
                                mutateBookings();
                                showToast(`Booking status changed to ${newStatus}`, 'success');
                              } catch (err) {
                                toastError('Could not update booking status');
                              }
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>
        )}

        {activeTab === 'boats' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Fleet Management</h3>
                <button
                  onClick={() => openBoatForm()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  + Add New Boat
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">Loading boats...</div>
                ) : boats.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">No boats found</div>
                ) : boats.map(boat => (
                  <div key={boat.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <p className="font-bold">{boat.name}</p>
                    <p className="text-xs text-gray-500 mb-4">{boat.type} • {boat.totalRooms} Rooms</p>
                    <div className="flex gap-2">
                       <button onClick={() => openBoatForm(boat)} className="text-xs font-bold text-primary-600 transition hover:text-primary-700">Edit Details</button>
                       <button onClick={() => deleteBoat(boat.id)} className="text-xs font-bold text-red-600 transition hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        )}

        {activeTab === 'destinations' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Destination Hub</h3>
                <button
                  onClick={() => openDestForm()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  + Add Destination
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">Loading destinations...</div>
                ) : destinations.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">No destinations found</div>
                ) : destinations.map(dest => (
                  <div key={dest.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <p className="font-bold">{dest.name}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{dest.description}</p>
                    {dest.location && <p className="text-xs text-primary-600 mb-4">{dest.location}</p>}
                    <div className="flex gap-2">
                       <button onClick={() => openDestForm(dest)} className="text-xs font-bold text-primary-600 transition hover:text-primary-700">Edit</button>
                       <button onClick={() => deleteDest(dest.id)} className="text-xs font-bold text-red-600 transition hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
           </Card>
        )}

        {activeTab === 'users' && (
           <Card className="p-8">
              <h3 className="text-xl font-bold mb-6">User & Access Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading users...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3 text-gray-600">{u.phone || '-'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={async (e) => {
                              const newRole = e.target.value as 'ADMIN' | 'MODERATOR' | 'CUSTOMER';
                              try {
                                await usersService.updateUserRole(u.id, newRole);
                                mutateUsers();
                                success(`${u.name} is now ${newRole}`);
                              } catch (err) {
                                toastError('Could not update role');
                              }
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'MODERATOR' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="MODERATOR">Moderator</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {u.isVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>
        )}

        {activeTab === 'blogs' && (
          showBlogEditor ? (
            <BlogEditor
              blog={editingBlog}
              onSave={(savedBlog: BlogWithDetails) => {
                setShowBlogEditor(false);
                mutateBlogs();
                success(editingBlog ? 'Blog updated' : 'Blog created');
              }}
              onCancel={() => setShowBlogEditor(false)}
            />
          ) : (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Content Management</h3>
                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setShowBlogEditor(true);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  + Create Blog Post
                </button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading blogs...</div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No blog posts found</div>
                ) : blogs.map(blog => (
                  <div key={blog.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{blog.title}</p>
                      <p className="text-xs text-gray-500">{blog.slug} • {blog.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowBlogEditor(true);
                        }}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this blog?')) {
                            try {
                              await blogsService.delete(blog.id);
                              mutateBlogs();
                              success('Blog deleted');
                            } catch (err) {
                              toastError('Failed to delete blog');
                            }
                          }
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        )}

        {activeTab === 'gallery' && (
           <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Image Gallery</h3>
                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  + Upload Image
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">Loading gallery...</div>
                ) : galleryItems.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">No images found</div>
                ) : galleryItems.map(item => (
                  <div key={item.id} className="relative group">
                    <img src={item.src} alt={item.alt} className="w-full h-48 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => deleteGalleryItem(item.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded text-xs font-bold"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                  </div>
                ))}
              </div>
           </Card>
        )}
      </main>
    </div>
  );
}
