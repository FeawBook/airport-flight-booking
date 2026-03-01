'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Step 1: Login / Retrieve Booking
export async function getBookingAction(formData: FormData) {
  const pnr = formData.get('pnr') as string
  const lastName = formData.get('lastName') as string

  if (!pnr || !lastName) {
    return { error: 'PNR and Last Name are required' }
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { pnr: pnr.toUpperCase() },
      include: {
        flight: true,
        passengers: true
      }
    })

    if (!booking) {
      return { error: 'Booking not found' }
    }

    // Verify if any passenger has the matching last name
    const hasMatchingPassenger = booking.passengers.some(
      p => p.lastName.toLowerCase() === lastName.toLowerCase()
    )

    if (!hasMatchingPassenger) {
      return { error: 'No passenger found with this last name on this booking' }
    }

    return { 
      success: true, 
      booking 
    }
  } catch (error) {
    console.error('Retrieve booking error:', error)
    return { error: 'An error occurred. Please try again later.' }
  }
}

// Step 4: Perform Check-in and save passenger details
export async function completeCheckInAction(
  passengers: { id: string; nationality: string; phoneNumber: string }[]
) {
  try {
    const updatePromises = passengers.map(p => 
      prisma.passenger.update({
        where: { id: p.id },
        data: { 
          isCheckedIn: true,
          nationality: p.nationality,
          phoneNumber: p.phoneNumber
        },
        include: {
          booking: {
            include: {
              flight: true
            }
          }
        }
      })
    )

    const updatedPassengers = await Promise.all(updatePromises)

    revalidatePath('/checkin')

    return { 
      success: true, 
      passengers: updatedPassengers
    }
  } catch (error) {
    console.error('Complete check-in error:', error)
    return { error: 'Failed to complete check-in.' }
  }
}

