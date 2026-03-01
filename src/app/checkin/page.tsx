'use client';

import { useState } from 'react';
import { CalendarCheck, AlertCircle, CheckCircle2, User, FileText, AlertTriangle, Smartphone } from 'lucide-react';
import { getBookingAction, completeCheckInAction } from '@/app/actions/checkin';
import Barcode from 'react-barcode';

// Define types to remove 'any'
interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  status: string;
}

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  seatNumber: string | null;
  nationality: string | null;
  phoneNumber: string | null;
  isCheckedIn: boolean;
}

interface Booking {
  id: string;
  pnr: string;
  flight: Flight;
  passengers: Passenger[];
}

export default function CheckinPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for data
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedPassengers, setSelectedPassengers] = useState<Passenger[]>([]);
  
  // Passenger details keyed by passenger ID
  const [passengersDetails, setPassengersDetails] = useState<Record<string, { nationality: string; phoneNumber: string }>>({});
  
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);
  const [finalResult, setFinalResult] = useState<{ message: string; passengers: Passenger[]; booking: Booking } | null>(null);

  // Step 1: Login
  async function handleLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookingAction(formData);
      if (response.error || !response.booking) {
        setError(response.error || 'Failed to retrieve booking');
      } else {
        setBooking(response.booking as unknown as Booking);
        setStep(2); // Go to Select Passenger
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Toggle Passenger Selection
  function togglePassenger(passenger: Passenger) {
    if (passenger.isCheckedIn) return; // Cannot select already checked-in passengers

    setSelectedPassengers(prev => {
      const isSelected = prev.some(p => p.id === passenger.id);
      if (isSelected) {
        return prev.filter(p => p.id !== passenger.id);
      } else {
        // Pre-fill details if they exist in DB
        setPassengersDetails(details => ({
          ...details,
          [passenger.id]: {
            nationality: passenger.nationality || '',
            phoneNumber: passenger.phoneNumber || ''
          }
        }));
        return [...prev, passenger];
      }
    });
  }

  function proceedToDetails() {
    if (selectedPassengers.length === 0) {
      setError('Please select at least one passenger to check-in');
      return;
    }
    setError(null);
    setStep(3);
  }

  // Step 3: Save Passenger Details
  function handleDetailsChange(passengerId: string, field: 'nationality' | 'phoneNumber', value: string) {
    setPassengersDetails(prev => ({
      ...prev,
      [passengerId]: {
        ...prev[passengerId],
        [field]: value
      }
    }));
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate all selected passengers have details
    for (const p of selectedPassengers) {
      const details = passengersDetails[p.id];
      if (!details?.nationality || !details?.phoneNumber) {
        setError(`Please fill in all fields for ${p.firstName} ${p.lastName}`);
        return;
      }
    }
    
    setError(null);
    setStep(4); // Go to Declaration
  }

  // Step 4: Declaration & Final Check-in
  async function handleCheckIn() {
    if (!acceptedDeclaration) {
      setError('You must accept the Dangerous Goods Declaration to proceed.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const passengersData = selectedPassengers.map(p => ({
        id: p.id,
        nationality: passengersDetails[p.id].nationality,
        phoneNumber: passengersDetails[p.id].phoneNumber
      }));

      const response = await completeCheckInAction(passengersData);
      
      if (response.error || !response.passengers) {
        setError(response.error || 'Failed to complete check-in');
      } else {
        setFinalResult({
          message: 'Check-in successful!',
          passengers: response.passengers as unknown as Passenger[],
          booking: booking!
        });
        setStep(5); // Go to Boarding Pass
      }
    } catch {
      setError('Failed to complete check-in.');
    } finally {
      setLoading(false);
    }
  }

  function resetCheckIn() {
    setStep(1);
    setBooking(null);
    setSelectedPassengers([]);
    setPassengersDetails({});
    setAcceptedDeclaration(false);
    setFinalResult(null);
    setError(null);
  }

  // Stepper UI Component
  const renderStepper = () => (
    <div className="w-full max-w-3xl mb-8 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        {[
          { num: 1, label: 'Retrieve', icon: CalendarCheck },
          { num: 2, label: 'Select', icon: User },
          { num: 3, label: 'Details', icon: FileText },
          { num: 4, label: 'Declaration', icon: AlertTriangle },
        ].map((s, idx) => (
          <div key={s.num} className="flex flex-col items-center relative flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 z-10 
              ${step === s.num ? 'bg-blue-600 text-white' : 
                step > s.num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className={`text-[10px] sm:text-xs font-medium text-center ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.label.slice(0, 3)}</span>
            </span>
            {idx < 3 && (
              <div className={`absolute top-4 sm:top-5 left-1/2 w-full h-1 -z-0 
                ${step > s.num ? 'bg-green-500' : 'bg-gray-200'}`} 
                style={{ width: '100%', left: '50%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-col items-center pb-12 px-4 sm:px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Check-in</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">Complete your check-in in a few simple steps.</p>
      </div>
      
      {step < 5 && renderStepper()}
      
      <div className="bg-white shadow rounded-lg border border-gray-100 p-4 sm:p-8 flex flex-col items-center w-full max-w-3xl min-h-[400px]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center w-full">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Login */}
        {step === 1 && (
          <div className="w-full max-w-md flex flex-col items-center">
            <CalendarCheck className="h-16 w-16 text-blue-200 mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Retrieve Booking</h2>
            <p className="text-gray-500 mt-2 text-center text-sm">
              Enter your PNR (<span className="font-bold">XYZ123</span>) and Last Name (<span className="font-bold">Doe</span>).
            </p>
            
            <form action={handleLogin} className="mt-6 w-full flex flex-col gap-4">
              <div>
                <input 
                  type="text" name="pnr" required placeholder="Booking Reference (PNR)" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <input 
                  type="text" name="lastName" required placeholder="Last Name" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 disabled:opacity-70 mt-2"
              >
                {loading ? 'Searching...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Select Passenger */}
        {step === 2 && booking && (
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-6 text-center">Select Passengers</h2>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-6">Choose the passengers you want to check-in.</p>
            
            <div className="grid gap-3 sm:gap-4 w-full max-w-xl mx-auto">
              {booking.passengers.map((p) => {
                const isSelected = selectedPassengers.some(sp => sp.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePassenger(p)}
                    disabled={p.isCheckedIn}
                    className={`flex items-center justify-between p-4 sm:p-5 border-2 rounded-xl transition-all text-left ${
                      p.isCheckedIn 
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' 
                        : isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2 sm:p-3 rounded-full ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <User className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-base sm:text-lg text-gray-900">{p.firstName} {p.lastName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">Seat: {p.seatNumber || 'Unassigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.isCheckedIn ? (
                        <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full">Checked In</span>
                      ) : (
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-center gap-3 sm:gap-4">
              <button onClick={() => setStep(1)} className="w-full sm:w-auto px-6 py-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium border border-gray-200 sm:border-none">Back</button>
              <button 
                onClick={proceedToDetails}
                disabled={selectedPassengers.length === 0}
                className="w-full sm:w-auto px-8 py-3 sm:py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Passenger Details */}
        {step === 3 && (
          <div className="w-full max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Passenger Details</h2>
            
            <form onSubmit={handleDetailsSubmit} className="space-y-6 sm:space-y-8">
              {selectedPassengers.map((p, index) => (
                <div key={p.id} className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">{p.firstName} {p.lastName}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                        value={passengersDetails[p.id]?.nationality || ''}
                        onChange={e => handleDetailsChange(p.id, 'nationality', e.target.value)}
                        required
                      >
                        <option value="">Select Nationality</option>
                        <option value="TH">Thai</option>
                        <option value="JP">Japanese</option>
                        <option value="US">American</option>
                        <option value="GB">British</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        value={passengersDetails[p.id]?.phoneNumber || ''}
                        onChange={e => handleDetailsChange(p.id, 'phoneNumber', e.target.value)}
                        placeholder="+66 81 234 5678"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 justify-center">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 border border-gray-200 sm:border-none"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Declaration */}
        {step === 4 && (
          <div className="w-full max-w-xl">
            <div className="flex flex-col items-center mb-6">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">Dangerous Goods Declaration</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 sm:p-6 rounded-lg mb-6 text-xs sm:text-sm text-gray-700 space-y-4">
              <p>For safety reasons, dangerous goods must not be packed in checked or cabin baggage. These include, but are not limited to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Explosives, fireworks, flares</li>
                <li>Flammable liquids and solids</li>
                <li>Radioactive materials</li>
                <li>Corrosives and toxic substances</li>
              </ul>
              <p className="font-semibold text-red-600">Lithium batteries (power banks) must be carried in cabin baggage only.</p>
            </div>

            <label className="flex items-start gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 text-blue-600 shrink-0"
                checked={acceptedDeclaration}
                onChange={e => setAcceptedDeclaration(e.target.checked)}
              />
              <span className="text-xs sm:text-sm font-medium text-gray-900 leading-tight sm:leading-normal">
                I declare on behalf of all selected passengers that our baggage does not contain any dangerous goods and I understand the regulations regarding lithium batteries.
              </span>
            </label>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8">
              <button 
                type="button" 
                onClick={() => setStep(3)}
                className="w-full sm:flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-200 border border-gray-200 sm:border-none"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={handleCheckIn}
                disabled={loading || !acceptedDeclaration}
                className="w-full sm:flex-1 bg-green-600 text-white font-medium py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Check-in'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Boarding Pass */}
        {step === 5 && finalResult && (
          <div className="w-full flex flex-col items-center">
            <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-2" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{finalResult.message}</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 text-center">Successfully checked in {finalResult.passengers.length} passenger(s)</p>
            
            <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-md">
              {finalResult.passengers.map((passenger) => (
                <div key={passenger.id} className="w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 relative">
                  {/* Header */}
                  <div className="bg-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
                    <div>
                      <p className="text-blue-200 text-xs sm:text-sm font-medium">BOARDING PASS</p>
                      <p className="font-bold text-lg sm:text-xl tracking-wider">BOOKY AIRLINE</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200 text-[10px] sm:text-xs">FLIGHT</p>
                      <p className="font-bold text-lg sm:text-xl">{finalResult.booking.flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  {/* Route */}
                  <div className="p-4 sm:p-6 border-b border-gray-200 border-dashed flex justify-between items-center bg-gray-50">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-black text-gray-900">{finalResult.booking.flight.origin}</p>
                    </div>
                    <div className="flex-1 px-2 sm:px-4 flex justify-center items-center relative">
                      <div className="w-full h-0 border-t-2 border-gray-300 border-dashed"></div>
                      <div className="absolute bg-gray-50 px-1 sm:px-2 text-blue-500 text-sm sm:text-base">✈️</div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-black text-gray-900">{finalResult.booking.flight.destination}</p>
                    </div>
                  </div>

                  {/* Cutout circles for boarding pass aesthetic */}
                  <div className="absolute w-6 h-6 bg-white rounded-full -left-3 top-[92px] sm:top-[108px] border-r border-gray-200"></div>
                  <div className="absolute w-6 h-6 bg-white rounded-full -right-3 top-[92px] sm:top-[108px] border-l border-gray-200"></div>

                  {/* Details */}
                  <div className="p-4 sm:p-6 grid grid-cols-2 gap-y-4 sm:gap-y-6">
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">PASSENGER</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-lg uppercase truncate">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">SEAT</p>
                      <p className="font-bold text-blue-600 text-xl sm:text-2xl">{passenger.seatNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">DATE</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{new Date(finalResult.booking.flight.departureTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">BOARDING TIME</p>
                      <p className="font-bold text-red-600 text-lg sm:text-xl">{new Date(new Date(finalResult.booking.flight.departureTime).getTime() - 40*60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">CLASS</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">ECONOMY (Y)</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">GATE</p>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">TBA</p>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col items-center justify-center border-dashed overflow-hidden">
                    <div className="scale-75 sm:scale-100 origin-top">
                      <Barcode value={`${finalResult.booking.pnr}-${passenger.lastName}`} width={1.5} height={50} displayValue={false} />
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2 font-mono">{finalResult.booking.pnr}</p>
                  </div>
                  
                  {/* Apple Wallet Mock Button */}
                  <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex justify-center">
                    <button className="flex items-center justify-center gap-2 w-full bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                      <Smartphone className="w-4 h-4" />
                      Add to Apple Wallet
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={resetCheckIn}
              className="mt-8 px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
