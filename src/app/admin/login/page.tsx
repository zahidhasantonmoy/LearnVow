// Admin login page
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@learnvow.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-gray-400">Sign in to access the administration panel</p>
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@learnvow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="ml-2 text-gray-400">Remember me</span>
            </label>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Forgot password?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <FiLogIn className="mr-2" />
                Sign In
              </span>
            )}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} LearnVow. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}