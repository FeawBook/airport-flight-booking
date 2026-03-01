'use client';

import { useState } from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkInAction } from '@/app/actions/checkin';

export default function CheckinPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleCheckIn(formData: FormData) {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await checkInAction(formData);
      setResult(response);
    } catch (error) {
      setResult({ error: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Check-in</h1>
        <p className="mt-1 text-sm text-gray-500">Check-in for your upcoming flight and get your boarding pass.</p>
      </div>
      
      <div className="bg-white shadow rounded-lg border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        {result?.success ? (
          <div className="flex flex-col items-center text-center max-w-lg">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.message}</h2>
            
            <div className="w-full mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
              <h3 className="font-semibold text-lg border-b pb-2 mb-4">Boarding Pass</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Passenger</p>
                  <p className="font-medium text-lg">{result.passenger.firstName} {result.passenger.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Flight</p>
                  <p className="font-medium text-lg">{result.booking.flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">From</p>
                  <p className="font-medium text-lg">{result.booking.flight.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">To</p>
                  <p className="font-medium text-lg">{result.booking.flight.destination}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Seat</p>
                  <p className="font-medium text-lg text-blue-600">{result.passenger.seatNumber || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Checked In
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setResult(null)}
              className="mt-8 text-blue-600 hover:text-blue-800 font-medium"
            >
              Check in another passenger
            </button>
          </div>
        ) : (
          <>
            <CalendarCheck className="h-16 w-16 text-blue-200 mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Online Check-in</h2>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              Enter your Booking Reference (PNR) and Last Name to check-in. Try using <span className="font-bold">XYZ123</span> and <span className="font-bold">Doe</span> for testing.
            </p>
            
            {result?.error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center w-full max-w-md">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{result.error}</span>
              </div>
            )}

            <form action={handleCheckIn} className="mt-6 w-full max-w-md flex flex-col gap-4">
              <div>
                <label htmlFor="pnr" className="sr-only">Booking Reference (PNR)</label>
                <input 
                  type="text" 
                  id="pnr"
                  name="pnr"
                  required
                  placeholder="Booking Reference (PNR)" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Last Name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Retrieve Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
