// Gift card generator component
'use client';

import { useState } from 'react';
import { BusinessService } from '@/services/business';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FiGift, FiMail, FiUser, FiMessageSquare } from 'react-icons/fi';

export default function GiftCardGenerator() {
  const { user } = useAuth();
  const [amount, setAmount] = useState(25);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [error, setError] = useState('');

  const generateGiftCard = async () => {
    if (!user) return;
    
    if (amount < 5 || amount > 500) {
      setError('Amount must be between $5 and $500');
      return;
    }
    
    setGenerating(true);
    setError('');
    
    try {
      const giftCard = await BusinessService.generateGiftCard(
        amount,
        recipientEmail || undefined,
        senderName || undefined,
        message || undefined
      );
      
      if (giftCard) {
        setGeneratedCard(giftCard);
      } else {
        setError('Failed to generate gift card');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate gift card');
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setGeneratedCard(null);
    setAmount(25);
    setRecipientEmail('');
    setSenderName('');
    setMessage('');
  };

  if (generatedCard) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Gift Card Generated!</h3>
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center mb-6">
          <FiGift className="text-4xl mx-auto mb-3" />
          <p className="text-3xl font-bold mb-2">${generatedCard.initial_balance.toFixed(2)}</p>
          <p className="text-lg">LearnVow Gift Card</p>
          <div className="bg-white/20 rounded-lg p-3 mt-4">
            <p className="font-mono text-lg">{generatedCard.code}</p>
          </div>
        </div>
        
        {recipientEmail && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-bold mb-2">Recipient Information</h4>
            <p><span className="text-gray-400">To:</span> {recipientEmail}</p>
            {senderName && <p><span className="text-gray-400">From:</span> {senderName}</p>}
            {message && (
              <div className="mt-2">
                <p className="text-gray-400">Message:</p>
                <p className="italic">"{message}"</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button onClick={resetForm} variant="outline" className="flex-1">
            Create Another
          </Button>
          <Button className="flex-1">
            Download PDF
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <FiGift className="mr-2" />
        Create Gift Card
      </h3>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Amount (${amount})
          </label>
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>$5</span>
            <span>$500</span>
          </div>
        </div>
        
        <Input
          label="Recipient Email (optional)"
          type="email"
          placeholder="friend@example.com"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          icon={<FiMail />}
        />
        
        <Input
          label="Your Name (optional)"
          type="text"
          placeholder="Your name"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          icon={<FiUser />}
        />
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Add a personal message..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <Button
          onClick={generateGiftCard}
          disabled={generating}
          className="w-full"
        >
          {generating ? 'Generating...' : `Create $${amount} Gift Card`}
        </Button>
      </div>
    </Card>
  );
}