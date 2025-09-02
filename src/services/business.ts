// Business service for subscriptions, gift cards, and referrals
'use client';

import { supabase } from '@/lib/supabaseClient';

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: any;
  max_books: number;
  is_active: boolean;
  created_at: string;
}

interface GiftCard {
  id: number;
  code: string;
  balance: number;
  initial_balance: number;
  recipient_email: string;
  sender_name: string;
  message: string;
  expires_at: string;
  is_redeemed: boolean;
  redeemed_by: string;
  redeemed_at: string;
  created_at: string;
}

interface UserSubscription {
  id: number;
  user_id: string;
  plan_id: number;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  cancel_date: string;
  auto_renew: boolean;
  created_at: string;
}

interface UserBalance {
  id: number;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface Referral {
  id: number;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'converted' | 'expired';
  reward_amount: number;
  created_at: string;
  converted_at: string;
}

export class BusinessService {
  // Get all active subscription plans
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }
  
  // Get user's current subscription
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_plans (name, price, interval, features, max_books)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }
  
  // Create a new subscription
  static async createSubscription(
    userId: string, 
    planId: number, 
    giftCardId?: number
  ): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          gift_card_id: giftCardId,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: this.calculateEndDate(planId),
          auto_renew: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  }
  
  // Calculate end date based on plan
  static calculateEndDate(planId: number): string {
    const now = new Date();
    // In a real implementation, this would look up the plan details
    // For now, we'll assume monthly plans
    now.setMonth(now.getMonth() + 1);
    return now.toISOString();
  }
  
  // Cancel a subscription
  static async cancelSubscription(subscriptionId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancel_date: new Date().toISOString()
        })
        .eq('id', subscriptionId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }
  
  // Generate a gift card
  static async generateGiftCard(
    amount: number,
    recipientEmail?: string,
    senderName?: string,
    message?: string
  ): Promise<GiftCard | null> {
    try {
      // Generate a random gift card code
      const code = this.generateGiftCardCode();
      
      const { data, error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          balance: amount,
          initial_balance: amount,
          recipient_email: recipientEmail,
          sender_name: senderName,
          message: message,
          expires_at: this.calculateGiftCardExpiry()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error generating gift card:', error);
      return null;
    }
  }
  
  // Generate a gift card code
  static generateGiftCardCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  // Calculate gift card expiry (1 year from now)
  static calculateGiftCardExpiry(): string {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    return now.toISOString();
  }
  
  // Redeem a gift card
  static async redeemGiftCard(
    userId: string, 
    code: string
  ): Promise<{ success: boolean; giftCard?: GiftCard; error?: string }> {
    try {
      // First, check if the gift card exists and is valid
      const { data: giftCard, error: fetchError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code)
        .eq('is_redeemed', false)
        .single();
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { success: false, error: 'Invalid or expired gift card code' };
        }
        throw fetchError;
      }
      
      // Check if expired
      if (new Date(giftCard.expires_at) < new Date()) {
        return { success: false, error: 'This gift card has expired' };
      }
      
      // Redeem the gift card
      const { error: redeemError } = await supabase
        .from('gift_cards')
        .update({
          is_redeemed: true,
          redeemed_by: userId,
          redeemed_at: new Date().toISOString()
        })
        .eq('id', giftCard.id);
      
      if (redeemError) throw redeemError;
      
      // Add balance to user's account
      await this.addUserBalance(userId, giftCard.balance);
      
      return { success: true, giftCard };
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      return { success: false, error: 'An error occurred while redeeming the gift card' };
    }
  }
  
  // Get user's balance
  static async getUserBalance(userId: string): Promise<UserBalance | null> {
    try {
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching user balance:', error);
      return null;
    }
  }
  
  // Add balance to user's account
  static async addUserBalance(userId: string, amount: number): Promise<UserBalance | null> {
    try {
      // First, try to update existing balance
      const { data: existingBalance, error: fetchError } = await supabase
        .from('user_balances')
        .select('id, balance')
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let result;
      
      if (existingBalance) {
        // Update existing balance
        const { data, error } = await supabase
          .from('user_balances')
          .update({
            balance: existingBalance.balance + amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBalance.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new balance record
        const { data, error } = await supabase
          .from('user_balances')
          .insert({
            user_id: userId,
            balance: amount,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Error adding user balance:', error);
      return null;
    }
  }
  
  // Generate referral code for user
  static async generateReferralCode(userId: string): Promise<Referral | null> {
    try {
      // Check if user already has a referral code
      const { data: existingReferral, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingReferral) {
        return existingReferral;
      }
      
      // Generate a unique referral code
      const referralCode = this.generateReferralCodeString();
      
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: userId,
          referral_code: referralCode,
          status: 'pending',
          reward_amount: 5.00,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error generating referral code:', error);
      return null;
    }
  }
  
  // Generate referral code string
  static generateReferralCodeString(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  // Process referral when a new user signs up with a code
  static async processReferral(referralCode: string, referredUserId: string): Promise<boolean> {
    try {
      // Find the referral record
      const { data: referral, error: fetchError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .eq('status', 'pending')
        .single();
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return false; // Invalid referral code
        }
        throw fetchError;
      }
      
      // Update referral status
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          referred_id: referredUserId,
          status: 'converted',
          converted_at: new Date().toISOString()
        })
        .eq('id', referral.id);
      
      if (updateError) throw updateError;
      
      // Add rewards to both users
      await this.addUserBalance(referral.referrer_id, referral.reward_amount);
      await this.addUserBalance(referredUserId, referral.reward_amount);
      
      return true;
    } catch (error) {
      console.error('Error processing referral:', error);
      return false;
    }
  }
}