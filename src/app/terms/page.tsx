// Terms of Service page
'use client';

import { FiFileText } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 mb-4">
                By accessing or using the LearnVow platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                2. Description of Service
              </h2>
              <p className="text-gray-300 mb-4">
                LearnVow provides a platform for accessing digital books, including ebooks and audiobooks ("Content"). The Service is offered for educational and entertainment purposes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                3. Account Registration
              </h2>
              <p className="text-gray-300 mb-4">
                To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="text-gray-300 mb-4">
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                4. Use of Content
              </h2>
              <p className="text-gray-300 mb-4">
                The Content available through the Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the Content without explicit permission.
              </p>
              <p className="text-gray-300 mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Content solely for your personal, non-commercial use in accordance with these Terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                5. Subscription and Payments
              </h2>
              <p className="text-gray-300 mb-4">
                Some features of the Service may require payment of fees. By selecting a subscription plan, you agree to pay all fees associated with that plan. All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities.
              </p>
              <p className="text-gray-300 mb-4">
                LearnVow reserves the right to modify the fees for the Service at any time. We will provide you with reasonable notice of any such changes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                6. User Conduct
              </h2>
              <p className="text-gray-300 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Violate any applicable law or regulation</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any material that is harmful, offensive, or otherwise objectionable</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                7. Termination
              </h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-300 mb-4">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                8. Disclaimer of Warranties
              </h2>
              <p className="text-gray-300 mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                9. Limitation of Liability
              </h2>
              <p className="text-gray-300 mb-4">
                In no event shall LearnVow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                10. Governing Law
              </h2>
              <p className="text-gray-300 mb-4">
                These Terms shall be governed and construed in accordance with the laws of California, United States, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiFileText className="mr-3 text-indigo-400" />
                11. Changes to Terms
              </h2>
              <p className="text-gray-300 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p className="text-gray-300">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}