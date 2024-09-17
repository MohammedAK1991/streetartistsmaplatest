import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const locationId = searchParams.get('locationId');

  try {
    const performances = await prisma.performance.findMany({
      where: {
        startTime: startDate ? { gte: new Date(startDate) } : undefined,
        endTime: endDate ? { lte: new Date(endDate) } : undefined,
        locationId: locationId || undefined,
      },
      include: {
        artist: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        location: true,
      },
    });

    return NextResponse.json(performances);
  } catch (error) {
    console.error('Error fetching performances:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = auth();
  if (!userId || sessionClaims?.role !== 'artist') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { locationId, startTime, endTime, description } =
      await request.json();

    const newPerformance = await prisma.performance.create({
      data: {
        artistId: userId,
        locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      },
      include: {
        artist: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        location: true,
      },
    });

    return NextResponse.json(newPerformance, { status: 201 });
  } catch (error) {
    console.error('Error creating performance:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}
