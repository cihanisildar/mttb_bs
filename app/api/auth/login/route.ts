import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserJwtPayload } from '@/lib/auth';
import { signJWT, setJWTCookie } from '@/lib/server-auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    const payload: UserJwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const { token, refreshToken } = await signJWT(payload);
    
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );

    return setJWTCookie(response, token, refreshToken);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 