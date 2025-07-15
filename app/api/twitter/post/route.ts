import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function POST(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('PRIVY_APP_SECRET set:', Boolean(process.env.PRIVY_APP_SECRET));
    console.log('PRIVY_APP_SECRET length:', process.env.PRIVY_APP_SECRET?.length);
    console.log('NEXT_PUBLIC_PRIVY_APP_ID set:', Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID));
    
    /* ------------------------------------------------------------
     * 1. Verify the caller's Privy auth token
     * ---------------------------------------------------------- */
    const auth = request.headers.get('authorization') ?? '';
    if (!auth.startsWith('Bearer '))
      return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });

    const privyToken = auth.substring(7);
    const { userId } = await privy.verifyAuthToken(privyToken);

    /* ------------------------------------------------------------
     * 2. Pull the user's Twitter OAuth credentials from Privy
     * ---------------------------------------------------------- */
    console.log('Getting user data for userId:', userId);
    
    // includeTokens = true enables returning the oauth object
    const user = await privy.getUser(userId, { include: ['linked_accounts', 'oauth_tokens'] });
    console.log('User data:', JSON.stringify(user, null, 2));
    console.log('Linked accounts:', user.linkedAccounts);

    const twitterAccount = user.linkedAccounts.find(
      (acc: any) => acc.type === 'twitter_oauth'
    );
    console.log('Twitter account found:', twitterAccount);
    
    if (!twitterAccount) {
      return NextResponse.json({ error: 'Twitter account not linked' }, { status: 400 });
    }
    
    if (!twitterAccount.oauth) {
      return NextResponse.json({ 
        error: 'OAuth tokens not available. Please enable "Return OAuth tokens" in Privy dashboard' 
      }, { status: 400 });
    }
    
    console.log('OAuth tokens available:', !!twitterAccount.oauth);

    const {
      accessToken,
      accessTokenSecret,
      consumerKey,    // aka appKey
      consumerSecret, // aka appSecret
    } = twitterAccount.oauth;

    /* ------------------------------------------------------------
     * 3. Send the tweet via Twitter API v2
     * ---------------------------------------------------------- */
    const { text } = await request.json() as { text: string };

    // Dynamic import to avoid Next.js bundling issues
    const { TwitterApi } = await import('twitter-api-v2');
    
    const twitter = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    });

    const tweet = await twitter.v2.tweet(text);  // POST https://api.twitter.com/2/tweets

    /* ------------------------------------------------------------
     * 4. Return success to client
     * ---------------------------------------------------------- */
    return NextResponse.json({
      success: true,
      tweetId: tweet.data.id,
      text,
    });
  } catch (error: any) {
    console.error('[twitter/post] error', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
