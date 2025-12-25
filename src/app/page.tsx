"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { useUserStore, useGalleryStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScratchCard } from '@/components/games/ScratchCard';
import { SlidingPuzzle } from '@/components/games/SlidingPuzzle';
import { Coins, Image as ImageIcon, Lock, Unlock, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const { user, isLoaded } = useUser();
  const { gems, setGems, setUserId } = useUserStore();
  const { images, setImages, updateImage } = useGalleryStore();
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showGame, setShowGame] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
      fetchUserData();
      fetchGalleryImages();
    }
  }, [isLoaded, user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user');
      setGems(response.data.gems);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get('/api/gallery');
      setImages(response.data.images);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (gems < 5) {
      alert('Insufficient gems! You need 5 gems to generate an image.');
      return;
    }

    setGeneratingImage(true);

    try {
      const gameType = Math.random() > 0.5 ? 'scratch' : 'puzzle';
      const response = await axios.post('/api/generate', {
        prompt,
        gameType,
      });

      setGems(response.data.remainingGems);
      
      const newImage = {
        id: response.data.imageId,
        imageUrl: response.data.imageUrl,
        prompt,
        isUnlocked: false,
        unlockGameType: gameType,
      };

      setImages([newImage, ...images]);
      setPrompt('');
      alert('Image generated! Find it in your gallery to unlock.');
    } catch (error: any) {
      console.error('Failed to generate image:', error);
      alert(error.response?.data?.error || 'Failed to generate image');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleUnlockImage = (image: any) => {
    setSelectedImage(image);
    setShowGame(true);
  };

  const handleGameComplete = async () => {
    if (!selectedImage) return;

    try {
      await axios.patch('/api/gallery', {
        imageId: selectedImage.id,
      });

      updateImage(selectedImage.id, { isUnlocked: true });
      setShowGame(false);
      setSelectedImage(null);
      alert('Image unlocked! View it in your gallery.');
    } catch (error) {
      console.error('Failed to unlock image:', error);
    }
  };

  const handleBuyGems = async (packageType: string) => {
    try {
      const response = await axios.post('/api/stripe/checkout', { packageType });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (showAgeGate && !ageVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-300">⚠️ Age Verification Required</CardTitle>
            <CardDescription className="text-center text-gray-300 text-lg mt-4">
              This website contains adult content (18+)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-200">
                <AlertCircle className="inline mr-2" size={16} />
                By continuing, you confirm that you are at least 18 years old and agree to view adult content.
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• This app generates NSFW AI images</p>
              <p>• All content is AI-generated and fictional</p>
              <p>• You must be 18+ to use this service</p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              onClick={() => {
                setAgeVerified(true);
                setShowAgeGate(false);
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              I am 18+ - Continue
            </Button>
            <Button
              onClick={() => window.location.href = 'https://www.google.com'}
              variant="outline"
              className="flex-1"
            >
              Exit
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showGame && selectedImage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">
                {selectedImage.unlockGameType === 'scratch' ? 'Scratch to Reveal' : 'Solve the Puzzle'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complete the game to unlock your image
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {selectedImage.unlockGameType === 'scratch' ? (
                <ScratchCard
                  imageUrl={selectedImage.imageUrl}
                  onComplete={handleGameComplete}
                />
              ) : (
                <SlidingPuzzle
                  imageUrl={selectedImage.imageUrl}
                  onComplete={handleGameComplete}
                />
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setShowGame(false);
                  setSelectedImage(null);
                }}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AI Unlock Gallery</h1>
            <p className="text-purple-300">Generate NSFW AI images and unlock them through mini-games</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-lg px-4 py-2 rounded-lg border border-purple-500/50">
              <Coins className="text-yellow-400" size={24} />
              <span className="text-2xl font-bold text-white">{gems}</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-red-200">
            <AlertCircle className="inline mr-2" size={16} />
            18+ Content Warning: This app generates NSFW AI images. All content is AI-generated and fictional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generate & Buy Gems */}
          <div className="space-y-6">
            {/* Generate Image */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
              <CardHeader>
                <CardTitle className="text-purple-300">Generate Image</CardTitle>
                <CardDescription className="text-gray-300">Cost: 5 gems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your image... (NSFW content allowed)"
                  className="w-full h-32 p-3 rounded-lg bg-black/50 border border-purple-500/50 text-white placeholder-gray-400 resize-none"
                  disabled={generatingImage}
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || gems < 5}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {generatingImage ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ImageIcon size={20} />
                      Generate Image
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Buy Gems */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
              <CardHeader>
                <CardTitle className="text-purple-300">Buy Gems</CardTitle>
                <CardDescription className="text-gray-300">Get more gems to generate images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleBuyGems('small')}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>50 Gems</span>
                  <span>$4.99</span>
                </Button>
                <Button
                  onClick={() => handleBuyGems('medium')}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>150 Gems</span>
                  <span className="text-green-400">$9.99 (Best Value)</span>
                </Button>
                <Button
                  onClick={() => handleBuyGems('large')}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>500 Gems</span>
                  <span>$29.99</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
              <CardHeader>
                <CardTitle className="text-purple-300">Your Gallery</CardTitle>
                <CardDescription className="text-gray-300">
                  {images.length} images ({images.filter(img => img.isUnlocked).length} unlocked)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                    <p>No images yet. Generate your first image!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer"
                        onClick={() => !image.isUnlocked && handleUnlockImage(image)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className={`w-full h-full object-cover ${
                              image.isUnlocked ? '' : 'blur-xl'
                            }`}
                          />
                        </div>
                        {!image.isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg group-hover:bg-black/50 transition-colors">
                            <div className="text-center">
                              <Lock className="mx-auto mb-2 text-purple-400" size={32} />
                              <p className="text-sm text-white font-semibold">
                                {image.unlockGameType === 'scratch' ? 'Scratch' : 'Puzzle'}
                              </p>
                              <p className="text-xs text-gray-300">Click to unlock</p>
                            </div>
                          </div>
                        )}
                        {image.isUnlocked && (
                          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                            <Unlock size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
