import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { GalleryImage } from '@/models/GalleryImage';
import { Transaction } from '@/models/Transaction';
import axios from 'axios';

const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
const NOVITA_API_URL = process.env.NOVITA_API_URL || 'https://api.novita.ai/v3/async/txt2img';
const GEMS_COST = 5; // Cost to generate one image

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, gameType = 'scratch' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Get user and check gems
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.gems < GEMS_COST) {
      return NextResponse.json({ error: 'Insufficient gems' }, { status: 400 });
    }

    // Deduct gems
    user.gems -= GEMS_COST;
    await user.save();

    // Create transaction
    await Transaction.create({
      userId: user.clerkId,
      type: 'spend',
      amount: -GEMS_COST,
      description: `Generated image: ${prompt.substring(0, 50)}`,
    });

    // Call Novita AI API
    try {
      const response = await axios.post(
        NOVITA_API_URL,
        {
          model_name: 'dreamshaper_8_93211.safetensors',
          prompt: prompt,
          negative_prompt: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
          width: 512,
          height: 512,
          sampler_name: 'Euler a',
          steps: 20,
          cfg_scale: 7,
          seed: -1,
        },
        {
          headers: {
            'Authorization': `Bearer ${NOVITA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const taskId = response.data.task_id;

      // Poll for result (simplified - in production use webhooks)
      let imageUrl = '';
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await axios.get(
          `https://api.novita.ai/v3/async/task-result?task_id=${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${NOVITA_API_KEY}`,
            },
          }
        );

        if (statusResponse.data.task.status === 'TASK_STATUS_SUCCEED') {
          imageUrl = statusResponse.data.images[0].image_url;
          break;
        } else if (statusResponse.data.task.status === 'TASK_STATUS_FAILED') {
          throw new Error('Image generation failed');
        }

        attempts++;
      }

      if (!imageUrl) {
        throw new Error('Image generation timeout');
      }

      // Save to gallery
      const galleryImage = await GalleryImage.create({
        userId: user.clerkId,
        imageUrl,
        prompt,
        isUnlocked: false,
        unlockGameType: gameType,
      });

      return NextResponse.json({
        success: true,
        imageId: galleryImage._id.toString(),
        imageUrl,
        remainingGems: user.gems,
      });

    } catch (apiError: any) {
      // Refund gems on API failure
      user.gems += GEMS_COST;
      await user.save();

      console.error('Novita API error:', apiError);
      return NextResponse.json(
        { error: 'Failed to generate image', details: apiError.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Generate image error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
