// Admin settings page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiSettings, FiSave, FiMail, FiBell, FiShield, FiCreditCard, FiRefreshCw } from 'react-icons/fi';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold: number;
  maintenance_mode: boolean;
  allow_registration: boolean;
  email_verification_required: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'LearnVow',
    site_description: 'Modern Reading Platform',
    contact_email: 'contact@learnvow.com',
    support_email: 'support@learnvow.com',
    currency: 'USD',
    tax_rate: 8.5,
    shipping_cost: 0,
    free_shipping_threshold: 0,
    maintenance_mode: false,
    allow_registration: true,
    email_verification_required: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from a settings table
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real implementation, this would save to the database
      // For now, we'll simulate the save operation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <FiSettings /> },
    { id: 'email', name: 'Email', icon: <FiMail /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell /> },
    { id: 'security', name: 'Security', icon: <FiShield /> },
    { id: 'payments', name: 'Payments', icon: <FiCreditCard /> }
  ];

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="bg-gray-800/50 rounded-lg p-6 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your platform configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <Card className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    {tabs.find(tab => tab.id === activeTab)?.name} Settings
                  </h2>
                  <p className="text-gray-400">
                    Configure your {tabs.find(tab => tab.id === activeTab)?.name.toLowerCase()} preferences
                  </p>
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <Input
                    label="Site Name"
                    name="site_name"
                    value={settings.site_name}
                    onChange={handleChange}
                    required
                  />
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Site Description
                    </label>
                    <textarea
                      name="site_description"
                      value={settings.site_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <Input
                    label="Contact Email"
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Support Email"
                    name="support_email"
                    type="email"
                    value={settings.support_email}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      label="Tax Rate (%)"
                      name="tax_rate"
                      type="number"
                      step="0.01"
                      value={settings.tax_rate.toString()}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Maintenance Mode</h3>
                      <p className="text-gray-400 text-sm">
                        Temporarily disable the site for maintenance
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Email Configuration</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure how emails are sent to users
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="SMTP Host"
                        name="smtp_host"
                        value=""
                        onChange={() => {}}
                      />
                      
                      <Input
                        label="SMTP Port"
                        name="smtp_port"
                        type="number"
                        value=""
                        onChange={() => {}}
                      />
                    </div>
                    
                    <Input
                      label="SMTP Username"
                      name="smtp_username"
                      value=""
                      onChange={() => {}}
                    />
                    
                    <Input
                      label="SMTP Password"
                      name="smtp_password"
                      type="password"
                      value=""
                      onChange={() => {}}
                    />
                    
                    <Input
                      label="From Email Address"
                      name="from_email"
                      type="email"
                      value=""
                      onChange={() => {}}
                    />
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Email Templates</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Customize email templates sent to users
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Welcome Email
                        </label>
                        <textarea
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={4}
                          defaultValue="Welcome to {{site_name}}! Thank you for registering."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Order Confirmation
                        </label>
                        <textarea
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={4}
                          defaultValue="Thank you for your order #{{order_id}}!"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Notification Preferences</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure which notifications are sent to users
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Order Updates</h4>
                          <p className="text-gray-400 text-sm">
                            Notify users about order status changes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">New Content Alerts</h4>
                          <p className="text-gray-400 text-sm">
                            Notify users about new books in their preferred categories
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Promotional Emails</h4>
                          <p className="text-gray-400 text-sm">
                            Send promotional offers and discounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Authentication Settings</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure user authentication and security
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Allow Registration</h4>
                          <p className="text-gray-400 text-sm">
                            Allow new users to register for accounts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="allow_registration"
                            checked={settings.allow_registration}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Verification Required</h4>
                          <p className="text-gray-400 text-sm">
                            Require email verification before account activation
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="email_verification_required"
                            checked={settings.email_verification_required}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <Input
                        label="Password Reset Token Expiry (hours)"
                        name="password_reset_expiry"
                        type="number"
                        value="24"
                        onChange={() => {}}
                      />
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure two-factor authentication settings
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable 2FA</h4>
                        <p className="text-gray-400 text-sm">
                          Allow users to enable two-factor authentication
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Payment Gateway</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure payment processing
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Payment Gateway"
                        name="payment_gateway"
                        type="select"
                        value="stripe"
                        onChange={() => {}}
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="square">Square</option>
                      </Input>
                      
                      <Input
                        label="Gateway Mode"
                        name="gateway_mode"
                        type="select"
                        value="sandbox"
                        onChange={() => {}}
                      >
                        <option value="sandbox">Sandbox (Testing)</option>
                        <option value="live">Live</option>
                      </Input>
                    </div>
                    
                    <Input
                      label="Publishable Key"
                      name="publishable_key"
                      value="pk_test_123456789"
                      onChange={() => {}}
                    />
                    
                    <Input
                      label="Secret Key"
                      name="secret_key"
                      type="password"
                      value="sk_test_123456789"
                      onChange={() => {}}
                    />
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-bold mb-2">Pricing & Tax</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Configure pricing and tax settings
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Tax Rate (%)"
                        name="tax_rate"
                        type="number"
                        step="0.01"
                        value={settings.tax_rate.toString()}
                        onChange={handleChange}
                      />
                      
                      <Input
                        label="Currency"
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Shipping Cost"
                        name="shipping_cost"
                        type="number"
                        step="0.01"
                        value={settings.shipping_cost.toString()}
                        onChange={handleChange}
                      />
                      
                      <Input
                        label="Free Shipping Threshold"
                        name="free_shipping_threshold"
                        type="number"
                        step="0.01"
                        value={settings.free_shipping_threshold.toString()}
                        onChange={handleChange}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}