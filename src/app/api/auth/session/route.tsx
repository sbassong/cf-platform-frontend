import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value; // extract token

  // user is not authenticated if no token found
  if (!token) {
    return NextResponse.json(
      { message: 'Authentication required.' },
      { status: 401 },
    );
  }

  const nestApiUrl = process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL;
  try {
    const response = await fetch(`${nestApiUrl}/auth/session`, { 
      headers: {
        'Cookie': `access_token=${token}`,
      },
      // Important for server components to avoid overly aggressive caching
      cache: 'no-store',
    });

    const userData = await response.json();

    if (!response.ok) {
      // token might be invalid, expired, or the user was deleted
      return NextResponse.json(
        { message: userData.message || 'Authentication failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json(
      { message: 'An internal error occurred.' },
      { status: 500 }
    );
  }
}


// ACCESS TOKEN NOT BEING READ? 404 ON SESSION CHECK