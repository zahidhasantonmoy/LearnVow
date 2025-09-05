// Root layout with providers
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ReadingSettingsProvider } from '@/contexts/ReadingSettingsContext';
import { BookmarkProvider } from '@/contexts/BookmarkContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        <ThemeProvider>
          <ReadingSettingsProvider>
            <BookmarkProvider>
              <AdminProvider>
                <AuthProvider>
                  <CartProvider>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-grow">
                        {children}
                      </main>
                      <Footer />
                    </div>
                  </CartProvider>
                </AuthProvider>
              </AdminProvider>
            </BookmarkProvider>
          </ReadingSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}