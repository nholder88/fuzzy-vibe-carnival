import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Make request to auth microservice
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3003';
    const response = await axios.post(
      `${authServiceUrl}/api/auth/register`,
      body
    );

    // Return the response with user data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Registration error:', error);

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const message =
        error.response?.data?.message ||
        'An error occurred during registration';

      return NextResponse.json({ message }, { status: statusCode });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
