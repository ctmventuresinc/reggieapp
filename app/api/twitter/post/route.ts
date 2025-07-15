import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify the Privy token
    const claims = await privy.verifyAuthToken(token);
    const userId = claims.userId;

    const { text } = await request.json();

    // For now, just return success - actual Twitter integration would require more setup
    return NextResponse.json({ 
      success: true, 
      message: 'Tweet would be posted successfully',
      userId: userId,
      text: text
    });

  } catch (error) {
    console.error('Error posting to Twitter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
