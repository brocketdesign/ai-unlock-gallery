import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GalleryImage } from '@/models/GalleryImage';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const images = await GalleryImage.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      images: images.map(img => ({
        id: img._id.toString(),
        imageUrl: img.imageUrl,
        prompt: img.prompt,
        isUnlocked: img.isUnlocked,
        unlockGameType: img.unlockGameType,
        createdAt: img.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('Get gallery error:', error);
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
    const { imageId } = body;

    await connectDB();

    const image = await GalleryImage.findOne({ _id: imageId, userId });
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    image.isUnlocked = true;
    await image.save();

    return NextResponse.json({
      success: true,
      image: {
        id: image._id.toString(),
        imageUrl: image.imageUrl,
        prompt: image.prompt,
        isUnlocked: image.isUnlocked,
        unlockGameType: image.unlockGameType,
        createdAt: image.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Unlock image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
