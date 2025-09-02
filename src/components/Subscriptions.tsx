// Subscriptions component for managing user subscriptions with fixed data structure
'use client';

import { useState, useEffect } from 'react';
import { BusinessService } from '@/services/business';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiCheck, FiX, FiCreditCard, FiGift, FiUserPlus } from 'react-icons/fi';

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
  subscription_plans?: {
    name: string;
    price: number;
    interval: string;
    features: any;
    max_books: number;
  } | null;
}

export default function Subscriptions() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referralInfo, setReferralInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
      loadReferralInfo();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    try {
      const [plansData, subscriptionData] = await Promise.all([
        BusinessService.getSubscriptionPlans(),
        BusinessService.getUserSubscription(user?.id || '')
      ]);
      
      setPlans(plansData);
      setUserSubscription(subscriptionData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralInfo = async () => {
    try {
      const referral = await BusinessService.generateReferralCode(user?.id || '');
      setReferralInfo(referral);
    } catch (error) {
      console.error('Error loading referral info:', error);
    }
  };

  const subscribeToPlan = async (planId: number) => {
    if (!user) return;
    
    setProcessing(planId);
    
    try {
      // In a real implementation, this would redirect to a payment processor
      // For now, we'll simulate the subscription creation
      const subscription = await BusinessService.createSubscription(user.id, planId);
      
      if (subscription) {
        setUserSubscription(subscription as any);
      }
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    } finally {
      setProcessing(null);
    }
  };

  const cancelSubscription = async () => {
    if (!userSubscription) return;
    
    setProcessing(userSubscription.id);
    
    try {
      const success = await BusinessService.cancelSubscription(userSubscription.id);
      
      if (success) {
        // Refresh subscription data
        loadSubscriptionData();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setProcessing(null);
    }
  };

  const processReferral = async () => {
    if (!referralCode.trim() || !user) return;
    
    try {
      const success = await BusinessService.processReferral(referralCode, user.id);
      
      if (success) {
        alert('Referral processed successfully! $5 has been added to your account.');
        setReferralCode('');
        // Refresh balance
        loadSubscriptionData();
      } else {
        alert('Invalid referral code');
      }
    } catch (error) {
      console.error('Error processing referral:', error);
      alert('An error occurred while processing the referral');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-6 h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-gray-400 mb-6">
          Choose a plan that fits your reading needs
        </p>
        
        {userSubscription ? (
          <Card className="mb-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  {userSubscription.subscription_plans?.name || 'Active Subscription'}
                </h3>
                <p className="text-gray-400">
                  ${userSubscription.subscription_plans?.price.toFixed(2)}/{
                    userSubscription.subscription_plans?.interval
                  }
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Next billing: {formatDate(userSubscription.end_date)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={cancelSubscription}
                  disabled={processing === userSubscription.id}
                >
                  {processing === userSubscription.id ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold my-2">
                    ${plan.price.toFixed(2)}
                    <span className="text-lg font-normal text-gray-400">
                      /{plan.interval}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                
                <ul className="mb-6 space-y-2 flex-1">
                  {plan.features && Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {key.replace(/_/g, ' ')}: {String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => subscribeToPlan(plan.id)}
                  disabled={processing === plan.id}
                  className="w-full"
                >
                  {processing === plan.id ? 'Processing...' : 'Choose Plan'}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FiGift className="mr-2" />
            Redeem Gift Card
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter gift card code"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Button onClick={processReferral}>
              Redeem
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm mt-3">
            Have a gift card? Enter the code above to add credit to your account.
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <FiUserPlus className="mr-2" />
            Refer a Friend
          </h3>
          
          {referralInfo ? (
            <div>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="font-mono text-center text-lg">
                  {referralInfo.referral_code}
                </p>
              </div>
              
              <p className="text-gray-400 text-sm">
                Share this code with friends. Both you and your friend will receive $5 when they sign up!
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              Loading referral information...
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}