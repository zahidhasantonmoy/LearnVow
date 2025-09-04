// Privacy Policy page
'use client';

import { FiShield } from 'react-icons/fi';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                1. Information We Collect
              </h2>
              <h3 className="text-xl font-bold mb-3">Personal Information</h3>
              <p className="text-gray-300 mb-4">
                When you register for an account, we collect personal information that can identify you, such as your name, email address, and payment information.
              </p>
              
              <h3 className="text-xl font-bold mb-3">Usage Information</h3>
              <p className="text-gray-300 mb-4">
                We automatically collect information about how you interact with our Service, including:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Your IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages you visit and how long you spend on them</li>
                <li>Books you access or download</li>
                <li>Search queries and preferences</li>
              </ul>
              
              <h3 className="text-xl font-bold mb-3">Cookies and Similar Technologies</h3>
              <p className="text-gray-300 mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To provide you with news, special offers, and general information about other goods, services, and events which we offer that are similar to those that you have already purchased or enquired about</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                3. How We Share Your Information
              </h2>
              <p className="text-gray-300 mb-4">
                We may share your personal information with:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li><strong>Service Providers:</strong> Third-party companies that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
                <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
              </ul>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties for marketing purposes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                4. Data Security
              </h2>
              <p className="text-gray-300 mb-4">
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                5. Data Retention
              </h2>
              <p className="text-gray-300 mb-4">
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your personal information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                6. Your Data Protection Rights
              </h2>
              <p className="text-gray-300 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p className="text-gray-300 mb-4">
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                7. Children's Privacy
              </h2>
              <p className="text-gray-300 mb-4">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-300 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-300 mb-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FiShield className="mr-3 text-indigo-400" />
                9. Contact Us
              </h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>By email: privacy@learnvow.com</li>
                <li>By visiting this page on our website: /contact</li>
                <li>By mail: 123 Learning Street, San Francisco, CA 94103</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}