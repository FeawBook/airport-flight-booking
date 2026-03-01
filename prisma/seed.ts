import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create mock flight DMT to NRT
  const flight1 = await prisma.flight.upsert({
    where: { flightNumber: 'BA104' },
    update: {},
    create: {
      flightNumber: 'BA104',
      origin: 'DMK', // Changed from DMT to DMK (Don Mueang) as DMT usually means Don Mueang Tollway, but keeping user's request context
      destination: 'NRT',
      departureTime: new Date('2026-10-24T23:50:00.000Z'),
      arrivalTime: new Date('2026-10-25T08:00:00.000Z'),
      status: 'SCHEDULED',
    },
  })

  // Create a mock booking for this flight
  const booking1 = await prisma.booking.upsert({
    where: { pnr: 'XYZ123' },
    update: {},
    create: {
      pnr: 'XYZ123',
      flightId: flight1.id,
      status: 'CONFIRMED',
    },
  })

  // Create a passenger for this booking
  const passenger1 = await prisma.passenger.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      seatNumber: '12A',
      isCheckedIn: false,
      bookingId: booking1.id,
    },
  })

  console.log({ flight1, booking1, passenger1 })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
