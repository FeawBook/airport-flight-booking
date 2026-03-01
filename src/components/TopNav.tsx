"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plane, CalendarCheck, Briefcase, Phone } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Flight', href: '/flight', icon: Plane },
  { name: 'Checkin', href: '/checkin', icon: CalendarCheck },
  { name: 'Manage Booking', href: '/manage-booking', icon: Briefcase },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-600">Booky Airline</h1>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-2 h-4 w-4 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
