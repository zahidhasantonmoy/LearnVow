// Completely redesigned Admin login page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Simple authentication - check credentials directly
      if (email === 'admin@learnvow.com' && password === 'admin123') {
        // Create session cookie
        const sessionId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7-day session
        
        // Set session cookie
        document.cookie = `admin_session=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        console.log('Login successful, session cookie set');
        
        // Redirect to admin dashboard
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#6366f1',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            Admin Login
          </h1>
          <p style={{ color: '#a0aec0' }}>
            Sign in to access the administration panel
          </p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid #f56565',
            color: '#f56565',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e0'
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@learnvow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #4a5568',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#4a5568'}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e0'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #4a5568',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#4a5568'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: loading ? '#7f9cf5' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a5fe0')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#6366f1')}
          >
            {loading ? (
              <>
                <svg className="animate-spin" style={{ 
                  width: '1rem', 
                  height: '1rem', 
                  marginRight: '0.5rem',
                  border: '2px solid transparent',
                  borderTopColor: 'white',
                  borderRadius: '50%'
                }} viewBox="0 0 24 24">
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          fontSize: '0.75rem', 
          color: '#718096' 
        }}>
          <p>© {new Date().getFullYear()} LearnVow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}