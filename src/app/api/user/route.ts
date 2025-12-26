import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Create new user with starting gems
      user = await User.create({
        clerkId: userId,
        email: '',
        gems: 10,
      });
    }

    return NextResponse.json({
      userId: user.clerkId,
      gems: user.gems,
      createdAt: user.createdAt,
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gems } = body;

    await connectDB();

    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (typeof gems === 'number') {
      user.gems = gems;
      await user.save();
    }

    return NextResponse.json({
      userId: user.clerkId,
      gems: user.gems,
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
