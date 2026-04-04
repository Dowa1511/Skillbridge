import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, CreditCard, HelpCircle, LogOut, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { LoadingButton } from '../components/Loading';

function Settings() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailReviews: true,
    emailPromotions: false,
    pushBookings: true,
    pushMessages: true,
    pushSystem: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Update local storage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      success('Profile updated successfully!');
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      success('Password changed successfully!');
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);

    try {
      // In a real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      success('Notification settings updated!');
    } catch (err) {
      error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      success('Account deleted successfully');
      navigate('/');
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <LoadingButton
                      loading={loading}
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 font-semibold"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </LoadingButton>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <LoadingButton
                          loading={loading}
                          type="submit"
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 font-semibold"
                        >
                          Change Password
                        </LoadingButton>
                      </form>
                    </div>

                    <div className="border-t pt-8">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <p className="text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 font-semibold"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailBookings', label: 'Booking updates and confirmations' },
                          { key: 'emailReviews', label: 'New reviews and ratings' },
                          { key: 'emailPromotions', label: 'Promotional offers and newsletters' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'pushBookings', label: 'New booking requests' },
                          { key: 'pushMessages', label: 'Messages from customers/workers' },
                          { key: 'pushSystem', label: 'System updates and announcements' },
                        ].map((item) => (
                          <label key={item.key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notificationSettings[item.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [item.key]: e.target.checked
                              })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <LoadingButton
                      loading={loading}
                      onClick={handleNotificationUpdate}
                      className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 font-semibold"
                    >
                      Save Preferences
                    </LoadingButton>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Payments</h2>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Premium Plan</h3>
                        <p className="text-gray-600">Get more visibility and features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹499/month</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No payment methods added yet</p>
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <HelpCircle size={32} className="text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
                      <p className="text-gray-600 mb-4">Find answers to common questions</p>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold">
                        View FAQ →
                      </button>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <MessageSquare size={32} className="text-green-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
                      <p className="text-gray-600 mb-4">Get help from our support team</p>
                      <button className="text-green-600 hover:text-green-700 font-semibold">
                        Contact Us →
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        'How to create a booking',
                        'Payment and refunds',
                        'Account verification',
                        'Dispute resolution',
                        'Service guidelines',
                        'Safety tips',
                      ].map((link, index) => (
                        <button
                          key={index}
                          className="text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <p className="font-medium text-gray-900">{link}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;