// FAQ page
'use client';

import { FiHelpCircle, FiBook, FiCreditCard, FiDownload, FiUser } from 'react-icons/fi';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Account',
      icon: <FiUser className="text-indigo-400" />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. You\'ll need to provide your email address, create a password, and verify your email address.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'If you\'ve forgotten your password, click on the "Login" button and then select "Forgot Password". Enter your email address and we\'ll send you a link to reset your password.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can change your email address in your account settings. Please note that you\'ll need to verify your new email address before the change takes effect.'
        }
      ]
    },
    {
      category: 'Books & Content',
      icon: <FiBook className="text-indigo-400" />,
      questions: [
        {
          question: 'What formats are available for ebooks?',
          answer: 'Our ebooks are available in EPUB, PDF, and MOBI formats. Audiobooks are available in MP3 format.'
        },
        {
          question: 'How many books can I access with my subscription?',
          answer: 'Our Basic plan allows you to access up to 100 books, while our Premium plan gives you access to our entire library of over 1,000 books.'
        },
        {
          question: 'Can I download books to read offline?',
          answer: 'Yes, Premium subscribers can download books to read offline. Simply click the download button on any book page and the book will be available in your library app.'
        }
      ]
    },
    {
      category: 'Billing & Payments',
      icon: <FiCreditCard className="text-indigo-400" />,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal and Apple Pay.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new subscribers. After 30 days, refunds are considered on a case-by-case basis.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: <FiHelpCircle className="text-indigo-400" />,
      questions: [
        {
          question: 'The app is crashing or not working properly. What should I do?',
          answer: 'Try restarting the app first. If that doesn\'t work, try clearing your browser cache or reinstalling the app. If you continue to experience issues, please contact our support team.'
        },
        {
          question: 'I\'m having trouble downloading books. How can I fix this?',
          answer: 'Make sure you have a stable internet connection and sufficient storage space on your device. If you\'re still having trouble, try downloading during off-peak hours when network traffic is lower.'
        },
        {
          question: 'What devices are supported?',
          answer: 'Our platform works on all modern web browsers, iOS devices (iPhone, iPad), and Android devices. We also have dedicated apps for Kindle and Kobo e-readers.'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Find answers to common questions about LearnVow
        </p>
        
        <div className="space-y-8">
          {faqs.map((category, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-3 p-2 bg-indigo-600/10 rounded-lg">
                  {category.icon}
                </span>
                {category.category}
              </h2>
              
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex}>
                    <h3 className="font-bold text-lg mb-2 text-indigo-300">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            If you can't find the answer you're looking for, please contact our support team.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}