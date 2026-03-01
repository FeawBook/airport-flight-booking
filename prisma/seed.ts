import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create mock flight DMK to NRT
  const flight1 = await prisma.flight.upsert({
    where: { flightNumber: 'BA104' },
    update: {},
    create: {
      flightNumber: 'BA104',
      origin: 'DMK',
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

  // Delete existing passengers to avoid duplicates if re-running
  await prisma.passenger.deleteMany({
    where: { bookingId: booking1.id }
  })

  // Create 2 passengers for this booking
  const passenger1 = await prisma.passenger.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      seatNumber: '12A',
      nationality: 'TH',
      phoneNumber: '+66812345678',
      isCheckedIn: false,
      bookingId: booking1.id,
    },
  })

  const passenger2 = await prisma.passenger.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      seatNumber: '12B',
      nationality: 'TH',
      phoneNumber: '+66812345679',
      isCheckedIn: false,
      bookingId: booking1.id,
    },
  })

  console.log({ flight1, booking1, passenger1, passenger2 })
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
