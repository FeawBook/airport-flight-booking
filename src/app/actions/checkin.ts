'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function checkInAction(formData: FormData) {
  const pnr = formData.get('pnr') as string
  const lastName = formData.get('lastName') as string

  if (!pnr || !lastName) {
    return { error: 'PNR and Last Name are required' }
  }

  try {
    // Find the booking with matching PNR and passengers with the given last name
    const booking = await prisma.booking.findUnique({
      where: { pnr: pnr.toUpperCase() },
      include: {
        flight: true,
        passengers: {
          where: {
            lastName: {
              equals: lastName,
              mode: 'insensitive',
            }
          }
        }
      }
    })

    if (!booking || booking.passengers.length === 0) {
      return { error: 'Booking not found or last name does not match' }
    }

    const passenger = booking.passengers[0]

    if (passenger.isCheckedIn) {
      return { 
        success: true, 
        message: 'You are already checked in.',
        booking,
        passenger 
      }
    }

    // Perform check-in
    const updatedPassenger = await prisma.passenger.update({
      where: { id: passenger.id },
      data: { isCheckedIn: true }
    })

    revalidatePath('/checkin')

    return { 
      success: true, 
      message: 'Check-in successful!',
      booking: { ...booking, passengers: [updatedPassenger] },
      passenger: updatedPassenger
    }
  } catch (error) {
    console.error('Check-in error:', error)
    return { error: 'An error occurred during check-in. Please try again later.' }
  }
}
