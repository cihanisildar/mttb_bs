import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromRequest, isAuthenticated, isTutor } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    
    if (!isAuthenticated(currentUser) || !isTutor(currentUser)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only tutors can access this endpoint' },
        { status: 403 }
      );
    }

    // Fetch all store items from the database
    const items = await prisma.storeItem.findMany({
      orderBy: {
        pointsRequired: 'asc'
      }
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching store items:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 