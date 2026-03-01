import { Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-1 text-sm text-gray-500">Get in touch with our customer support team.</p>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Phone className="h-16 w-16 text-blue-200 mb-4" />
        <h2 className="text-xl font-medium text-gray-900">24/7 Support</h2>
        <p className="text-gray-500 mt-2">Call us at 1-800-BOOKY-AIR or email support@bookyairline.com</p>
      </div>
    </div>
  );
}
