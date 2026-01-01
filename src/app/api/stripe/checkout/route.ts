import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

const GEM_PACKAGES = {
  small: { gems: 50, price: 499 }, // $4.99
  medium: { gems: 150, price: 999 }, // $9.99
  large: { gems: 500, price: 2999 }, // $29.99
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!stripe) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    const body = await req.json();
    const { packageType } = body;

    if (!packageType || !(packageType in GEM_PACKAGES)) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const gemPackage = GEM_PACKAGES[packageType as keyof typeof GEM_PACKAGES];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${gemPackage.gems} Gems`,
              description: `Purchase ${gemPackage.gems} gems for AI image generation`,
            },
            unit_amount: gemPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      customer_email: userEmail,
      metadata: {
        userId,
        gems: gemPackage.gems.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
