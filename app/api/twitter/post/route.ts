import { NextRequest, NextResponse } from 'next/server';
import { PrivyApi } from '@privy-io/server-auth';

const privy = new PrivyApi({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
});

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

    // Get user's linked accounts from Privy
    const user = await privy.getUser(userId);
    const twitterAccount = user.linkedAccounts.find(
      (account) => account.type === 'twitter_oauth'
    );

    if (!twitterAccount) {
      return NextResponse.json({ error: 'No Twitter account linked' }, { status: 400 });
    }

    // Use Privy's API to make the Twitter post
    // Note: You'll need to implement the actual Twitter API call here
    // This is a placeholder - you'll need to use Twitter's API v2
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tweet posted successfully',
      twitterUsername: twitterAccount.username
    });

  } catch (error) {
    console.error('Error posting to Twitter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
