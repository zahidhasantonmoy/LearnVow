// Updated root layout with Navbar
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'LearnVow - Modern Reading Platform',
  description: 'Read ebooks and listen to audiobooks in a modern, futuristic interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="min-h-screen">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}