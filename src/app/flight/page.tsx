import { Plane } from 'lucide-react';

export default function FlightPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Flights</h1>
        <p className="mt-1 text-sm text-gray-500">Search and book your next adventure.</p>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Plane className="h-16 w-16 text-blue-200 mb-4" />
        <h2 className="text-xl font-medium text-gray-900">Flight Search Tool</h2>
        <p className="text-gray-500 mt-2">Flight booking interface will be implemented here.</p>
      </div>
    </div>
  );
}
