import { CalendarCheck } from 'lucide-react';

export default function CheckinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
        <p className="mt-1 text-sm text-gray-500">Check-in for your upcoming flight and get your boarding pass.</p>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <CalendarCheck className="h-16 w-16 text-blue-200 mb-4" />
        <h2 className="text-xl font-medium text-gray-900">Online Check-in</h2>
        <p className="text-gray-500 mt-2">Enter your PNR and Last Name to check-in.</p>
        <div className="mt-6 w-full max-w-md">
          <input type="text" placeholder="Booking Reference (PNR)" className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4" />
          <input type="text" placeholder="Last Name" className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4" />
          <button className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700">Retrieve Booking</button>
        </div>
      </div>
    </div>
  );
}
