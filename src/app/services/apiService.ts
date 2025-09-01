// Comprehensive API service for LearnVow platform
import { supabase } from '../utils/supabaseClient';

// Mock data for demonstration
const mockBooks = [
  {
    id: 1,
    title: "The Future of AI",
    author: "Dr. Jane Smith",
    price: 19.99,
    cover: "/placeholder-book.jpg",
    type: "ebook",
    category: "Technology",
    rating: 4.8,
    reviews: 128,
    description: "Explore the cutting-edge developments in artificial intelligence and their impact on society.",
    pages: 320,
    language: "English",
    published_date: "2023-05-15"
  },
  {
    id: 2,
    title: "Mysteries of the Universe",
    author: "Prof. John Doe",
    price: 24.99,
    cover: "/placeholder-book.jpg",
    type: "audiobook",
    category: "Science",
    rating: 4.5,
    reviews: 96,
    description: "Journey through space and time to uncover the secrets of our cosmos.",
    pages: 420,
    language: "English",
    published_date: "2023-03-22"
  },
  {
    id: 3,
    title: "Digital Nomad Lifestyle",
    author: "Sarah Williams",
    price: 14.99,
    cover: "/placeholder-book.jpg",
    type: "ebook",
    category: "Lifestyle",
    rating: 4.2,
    reviews: 75,
    description: "Learn how to travel the world while building a remote career.",
    pages: 250,
    language: "English",
    published_date: "2023-01-10"
  }
];

// Mock user data
let currentUser: any = null;
let cartItems: any[] = [];
let userLibrary: any[] = [];

class ApiService {
  // Authentication methods
  async register(userData: { name: string; email: string; password: string }) {
    try {
      // In a real app, this would call the backend API
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (error) throw error;

      // Create user in our database
      const newUser = {
        id: data.user?.id,
        name: userData.name,
        email: userData.email,
        created_at: new Date().toISOString()
      };

      currentUser = newUser;
      return { success: true, user: newUser };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      // In a real app, this would call the backend API
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) throw error;

      // Get user details
      const user = {
        id: data.user?.id,
        name: data.user?.user_metadata?.name || 'User',
        email: data.user?.email,
        created_at: data.user?.created_at
      };

      currentUser = user;
      return { success: true, user };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      currentUser = null;
      cartItems = [];
      userLibrary = [];
      
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  getCurrentUser() {
    return currentUser;
  }

  // Book methods
  async getBooks(filters?: { type?: string; category?: string }) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredBooks = [...mockBooks];
      
      if (filters?.type) {
        filteredBooks = filteredBooks.filter(book => book.type === filters.type);
      }
      
      if (filters?.category) {
        filteredBooks = filteredBooks.filter(book => book.category === filters.category);
      }
      
      return { success: true, data: filteredBooks };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async getBook(id: number) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const book = mockBooks.find(b => b.id === id);
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      return { success: true, data: book };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Cart methods
  getCartItems() {
    return cartItems;
  }

  async addToCart(book: any, quantity: number = 1) {
    try {
      const existingItem = cartItems.find(item => item.id === book.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({ ...book, quantity });
      }
      
      return { success: true, data: cartItems };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async updateCartItemQuantity(id: number, quantity: number) {
    try {
      const item = cartItems.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          cartItems = cartItems.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      return { success: true, data: cartItems };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async removeFromCart(id: number) {
    try {
      cartItems = cartItems.filter(item => item.id !== id);
      return { success: true, data: cartItems };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async clearCart() {
    try {
      cartItems = [];
      return { success: true, data: cartItems };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  getCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Library methods
  async getLibrary() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: userLibrary };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Purchase methods
  async processPayment(paymentData: any) {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll assume payment is successful
      const orderId = `ORDER_${Date.now()}`;
      
      // Move cart items to library
      userLibrary = [...userLibrary, ...cartItems.map(item => ({
        ...item,
        purchase_date: new Date().toISOString(),
        progress: 0
      }))];
      
      // Clear cart after successful purchase
      cartItems = [];
      
      return { 
        success: true, 
        data: { 
          orderId, 
          amount: this.getCartTotal(),
          items: userLibrary.slice(-cartItems.length)
        } 
      };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Wishlist methods
  private wishlist: any[] = [];

  async getWishlist() {
    try {
      return { success: true, data: this.wishlist };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async addToWishlist(book: any) {
    try {
      const existingItem = this.wishlist.find(item => item.id === book.id);
      
      if (!existingItem) {
        this.wishlist.push(book);
      }
      
      return { success: true, data: this.wishlist };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async removeFromWishlist(id: number) {
    try {
      this.wishlist = this.wishlist.filter(item => item.id !== id);
      return { success: true, data: this.wishlist };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // User profile methods
  async updateProfile(profileData: any) {
    try {
      if (currentUser) {
        currentUser = { ...currentUser, ...profileData };
      }
      
      return { success: true, data: currentUser };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // Reading progress methods
  private readingProgress: Record<number, number> = {};

  async getReadingProgress(bookId: number) {
    try {
      const progress = this.readingProgress[bookId] || 0;
      return { success: true, data: progress };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async updateReadingProgress(bookId: number, progress: number) {
    try {
      this.readingProgress[bookId] = Math.min(100, Math.max(0, progress));
      
      // Update progress in library
      const libraryItem = userLibrary.find(item => item.id === bookId);
      if (libraryItem) {
        libraryItem.progress = this.readingProgress[bookId];
      }
      
      return { success: true, data: this.readingProgress[bookId] };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

export const apiService = new ApiService();