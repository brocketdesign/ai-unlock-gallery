import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const gems = parseInt(session.metadata?.gems || '0');

      if (userId && gems > 0) {
        await connectDB();

        // Update user gems
        const user = await User.findOne({ clerkId: userId });
        
        if (user) {
          user.gems += gems;
          await user.save();

          // Create transaction record
          await Transaction.create({
            userId: user.clerkId,
            type: 'purchase',
            amount: gems,
            description: `Purchased ${gems} gems`,
            stripeSessionId: session.id,
          });
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
