import Link from 'next/link'

export const metadata = {
  title: 'Terms & Privacy - ZK3',
  description: 'Terms of Service and Privacy Policy for ZK3 link in bio platform.',
}

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Terms of Service & Privacy Policy</h1>
          <p className="text-gray-600 text-center">Effective Date: November 1, 2025</p>
          <p className="text-gray-600 text-center">Last Updated: November 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6 text-lg leading-relaxed">These Terms of Service constitute a legally binding agreement between you and ZK3 regarding your use of the ZK3 platform and services. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
          
          <p className="mb-6 text-lg leading-relaxed">ZK3 provides a link-in-bio platform that enables users to create, customize, and share professional profile pages containing multiple links and content. Our Service operates under two distinct data hosting models: <strong>CDN-Hosted Profiles</strong> are stored in public repositories and are accessible to all users, search engines, and available for direct file download. <strong>Server-Hosted Profiles</strong> are viewable through our user interface but are not available for direct file download or repository access.</p>

          <p className="mb-6 text-lg leading-relaxed">By uploading content to our CDN, you grant ZK3 a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content. This content becomes part of our public repository and may be indexed by search engines and downloaded directly. Content hosted on our private servers remains your exclusive property. We maintain strict access controls and do not claim any ownership rights over this private content. You retain all intellectual property rights in your original content, subject to the licenses granted herein.</p>

          <p className="mb-6 text-lg leading-relaxed">You are solely responsible for all content you upload, share, or display through our Service. You warrant that you have all necessary rights to use and share the content you provide. You agree not to use our Service for any unlawful, harmful, or prohibited activities. You shall not attempt to circumvent our security measures or access unauthorized areas of our Service.</p>

          <p className="mb-6 text-lg leading-relaxed">ZK3 is committed to protecting your privacy. When you create a profile, we collect information such as your username, display name, bio, profile picture, links, and any other content you choose to include. We automatically collect certain technical information including IP addresses, browser type, device information, and usage analytics. If you contact us, we may collect information from your communications with us.</p>

          <p className="mb-6 text-lg leading-relaxed">TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZK3 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF OUR SERVICE.</p>
        </div>

        <div className="text-center mt-12 pt-8 border-t">
          <Link href="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}