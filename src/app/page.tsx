import { PlaneTakeoff, Clock, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Booky Airline Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your flights, check-in, and account all in one place.</p>
      </div>

      {/* Stats/Quick Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <PlaneTakeoff className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Flights</dt>
                <dd className="text-2xl font-semibold text-gray-900">2</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Hours to Next Flight</dt>
                <dd className="text-2xl font-semibold text-gray-900">48</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Reward Points</dt>
                <dd className="text-2xl font-semibold text-gray-900">12,500</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Actions</dt>
                <dd className="text-2xl font-semibold text-gray-900">1</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Flight Detail Card */}
        <div className="bg-white shadow rounded-lg border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Next Upcoming Flight</h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">BKK</p>
                <p className="text-sm text-gray-500">Bangkok</p>
              </div>
              <div className="flex-1 px-4 flex justify-center items-center">
                <div className="h-px bg-gray-300 w-full relative">
                  <PlaneTakeoff className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 h-6 w-6" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">NRT</p>
                <p className="text-sm text-gray-500">Tokyo</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium text-gray-900">Oct 24, 2026</p>
              </div>
              <div>
                <p className="text-gray-500">Flight</p>
                <p className="font-medium text-gray-900">BA-104</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  On Time
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/checkin" className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Check-in Now
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white shadow rounded-lg border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <PlaneTakeoff className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Book New Flight</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Flight Status</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Upgrade Seat</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="text-sm font-medium text-gray-900">Need Help?</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
