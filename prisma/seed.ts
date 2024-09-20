import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: await hash('password123', 10),
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: await hash('password456', 10),
      role: 'ARTIST',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password: await hash('password789', 10),
      role: 'ARTIST',
    },
  });

  // Create artists
  const artist1 = await prisma.artist.upsert({
    where: { id: user2.id },
    update: {},
    create: {
      id: user2.id,
      bio: 'Jane is a talented street musician specializing in acoustic guitar.',
      genres: ['Folk', 'Acoustic'],
    },
  });

  const artist2 = await prisma.artist.upsert({
    where: { id: user3.id },
    update: {},
    create: {
      id: user3.id,
      bio: 'Bob is a skilled juggler and comedian, bringing laughter to the streets.',
      genres: ['Comedy', 'Juggling'],
    },
  });

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      latitude: 51.505,
      longitude: -0.09,
      name: 'London Bridge',
      description: 'Popular tourist spot near the Thames',
    },
  });

  const location2 = await prisma.location.create({
    data: {
      latitude: 51.51,
      longitude: -0.13,
      name: 'Covent Garden',
      description: 'Lively area known for street performances',
    },
  });

  // Create performances
  const performance1 = await prisma.performance.create({
    data: {
      artistId: artist1.id,
      locationId: location1.id,
      startTime: new Date('2023-07-15T14:00:00Z'),
      endTime: new Date('2023-07-15T16:00:00Z'),
      description: 'Acoustic guitar performance featuring original songs',
    },
  });

  const performance2 = await prisma.performance.create({
    data: {
      artistId: artist2.id,
      locationId: location2.id,
      startTime: new Date('2023-07-16T13:00:00Z'),
      endTime: new Date('2023-07-16T15:00:00Z'),
      description: 'Comedy juggling act with audience participation',
    },
  });

  console.log({
    user1,
    user2,
    user3,
    artist1,
    artist2,
    location1,
    location2,
    performance1,
    performance2,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
