import React from 'react'
import { ArrowTurnUpLeftIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='max-w-4xl mx-auto flex flex-col justify-center items-start gap-6  p-5 md:px-10 py-20'>
      <div className='flex justify-start items-start'>
        <div className='p-2 bg-gray-200 rounded-full flex justify-center items-center'>
          <Link href='/' className='text-gray-700 hover:text-gray-900'>
          <ArrowTurnUpLeftIcon className='w-5 h-5'/>
          </Link>
        </div>
      </div>
      <div className='flex flex-col justify-center items-start gap-2'>
        <h1 className='text-3xl font-semibold'>Privacy Policy - Adorned by Sophia</h1>
        <div className='flex gap-2 sub text-gray-400 text-sm '>
            <span className=''>
          Last Updated 
        </span> •
        <span>
          December 09, 2025
        </span>
          </div>
      
        <div className='mt-6 flex flex-col gap-10 border border-dotted border-gray-300 rounded-md p-5 bg-gray-50/20'>
          <section>
            <p className='sub text-[15px] text-gray-500 leading-6'>
              At Adorned by Sophia, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and the rights you have regarding your data when you visit 
              <span className='border-b border-gray-700 text-gray-700'>
                {" "}
   https://www.adornedbysophia.com
              </span>
            </p>
          </section>

          <section>
            <p className='sub text-[15px] text-gray-500 leading-6'>
              By using our website, you consent to the practices described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our website.
            </p>
          </section>

          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3  sub'>Information We Collect</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             We collect personal information that you voluntarily provide when you
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Create an account</li>
              <li>Place an order</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact customer support</li>
              <li>Participate in promotions or surveys</li>
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-6'>
            This includes
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and shipping address</li>
              <li>Payment information</li>
              <li>Any additional information you share with us</li>
            </ul>
          </section>

          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Information Automatically Collected</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             When you visit our Website, we automatically collect certain information, including
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>IP Address</li>
              <li>Browser type & version</li>
              <li>Device Type</li>
              <li>Page viewed and time spent</li>
              <li>Referring URL</li>
              <li>General Location [Country Level]</li>
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
            This helps us improve performance, security, and user experience.
            </p>
          </section>

          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Cookies & Tracking Technologies</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             We use cookies and similar technologies to
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Keep you logged in</li>
              <li>Remember your cart items</li>
              <li>Understand how visitors use our website</li>
              <li>Improve site performance</li>
              <li>Personalize your shopping experience</li>
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
            You can manage or disable cookies in your browser settings.
Some essential cookies cannot be disabled because they are required for the Website to function.
            </p>
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>How We Use Your Information</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             We are using your information to
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Process and deliver orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve customer support</li>
              <li>Personalize your experience</li>
              <li>Provide marketing and promotional content (optional)</li>
              <li>Prevent fraud and enhance security</li>
              <li>Analyze website performance and user behaviour</li>
              <li>Comply with legal obligations</li>
            </ul>
            {/* <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
            You can manage or disable cookies in your browser settings.
Some essential cookies cannot be disabled because they are required for the Website to function.
            </p> */}
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Cookies & Tracking Technologies</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             We use cookies and similar technologies to
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Keep you logged in</li>
              <li>Remember your cart items</li>
              <li>Understand how visitors use our website</li>
              <li>Improve site performance</li>
              <li>Personalize your shopping experience</li>
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
            You can manage or disable cookies in your browser settings.
Some essential cookies cannot be disabled because they are required for the Website to function.
            </p>
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Sharing your Information</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             <span className='font-semibold'>  We do not sell or rent your personal data.</span>
             <br/>

We may share necessary information with trusted third parties, including
            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Payment processors</li>
              <li>Shipping & logistics partners</li>
              <li>Analytics tools</li>
              <li>Email marketing platforms</li>
              <li>Hosting and security providers</li>
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
           These parties are contractually obligated to protect your data.
            </p>
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Payment Information</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
             All payments are processed securely through third-party providers.
            
             <br/>
 <span className='font-semibold'>  Adorned by Sophia does not store your full credit or debit card information.</span>

            </p>
            {/* <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Payment processors</li>
              <li>Shipping & logistics partners</li>
              <li>Analytics tools</li>
              <li>Email marketing platforms</li>
              <li>Hosting and security providers</li>
            </ul> */}
            {/* <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
           These parties are contractually obligated to protect your data.
            </p> */}
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Google Services</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
            We use Google services to help us understand Website performance and search visibility.
Google may collect data such as device information, usage patterns, and general location.
All data is processed according to Google’s privacy policies.

            </p>
            {/* <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Payment processors</li>
              <li>Shipping & logistics partners</li>
              <li>Analytics tools</li>
              <li>Email marketing platforms</li>
              <li>Hosting and security providers</li>
            </ul> */}
            {/* <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
           These parties are contractually obligated to protect your data.
            </p> */}
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Email Marketing & Communication</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
          If you subscribe to our mailing list, we may send

            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Product Updates</li>
              <li>Promotions</li>
              <li>Restock Alerts</li>
              <li>Order Information</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
You can unsubscribe anytime by clicking “Unsubscribe” in any email.            </p>
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub'>Data Retention</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
          We retain your information only as long as necessary to

            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Provide our services</li>
              <li>Comply with legal requirements</li>
              <li>Resolve disputes</li>
              <li>Maintain transaction records</li>
            
            </ul>
            {/* <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
You can unsubscribe anytime by clicking “Unsubscribe” in any email.            </p> */}
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>Your Rights</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
         Depending on your region, you have the right to

            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request that we limit or restrict processing of your data</li>
              <li>Download your data (data portability)</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
To make a request contact us at <Link href="mailto:support@adornedbysophia.com" className='border-b border-gray-500 hover:border-gray-600 hover:text-gray-600'>support@adornedbysophia.com</Link>          </p>
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>Children's Privacy</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
Our Website is not intended for children under 16, and we do not knowingly collect data from minors.
            </p>
            {/* <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request that we limit or restrict processing of your data</li>
              <li>Download your data (data portability)</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
To make a request contact us at <Link href="mailto:support@adornedbysophia.com" className='border-b border-gray-500 hover:border-gray-600 hover:text-gray-600'>support@adornedbysophia.com</Link>          </p> */}
          </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>Data Security</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
We take seriously the security of your personal data and implement appropriate measures to protect it. We use safeguards including            </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>HTTPS encryption</li>
              <li>Secure hosting</li>
              <li>Access controls</li>
              <li>Regular monitoring</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
While no online service is 100% secure, we take all reasonable measures to protect your data.     </p>
     </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>International Users</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
If you access our Website from outside your country, be aware that your information may be transferred and stored in locations with different data protection laws. We ensure appropriate safeguards are in place.</p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>HTTPS encryption</li>
              <li>Secure hosting</li>
              <li>Access controls</li>
              <li>Regular monitoring</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
While no online service is 100% secure, we take all reasonable measures to protect your data.     </p>
     </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>Changes to Privacy Policy</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy regularly.
              </p>
            {/* <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li>HTTPS encryption</li>
              <li>Secure hosting</li>
              <li>Access controls</li>
              <li>Regular monitoring</li>
            
            </ul>
            <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
While no online service is 100% secure, we take all reasonable measures to protect your data.     </p> */}
     </section>
          <section className=''>
            <h2 className='text-lg font-[650] text-gray-600 mb-3 sub '>Contact Us</h2>
            <p className='sub text-[15px] text-gray-500 leading-6'>
If you have questions, concerns, or requests regarding your privacy, contact us at              </p>
            <ul className='list-disc list-inside mt-1 space-y-1 text-gray-500 sub text-[15px]'>
              <li className=''>
                <Link href="mailto:support@adornedbysophia.com" className='border-b border-gray-500  '>
                support@adornedbysophia.com ↗</Link>
              </li>
              <li className=''>
                <Link href="https://www.adornedbysophia.com" className='border-b border-gray-500  '>
                www.adornedbysophia.com ↗</Link>
              </li>
             
            
            </ul>
            {/* <p className='sub text-[15px] text-gray-500 leading-6 mt-5'>
While no online service is 100% secure, we take all reasonable measures to protect your data.     </p> */}
     </section>

         

         
        </div>
      </div>
    </div>
  )
}

export default Page
