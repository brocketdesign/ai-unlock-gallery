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
    // Check if user has already verified their age
    const savedAgeVerification = localStorage.getItem('ageVerified');
    if (savedAgeVerification === 'true') {
      setAgeVerified(true);
      setShowAgeGate(false);
    }
  }, []);

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
        <Card className="glass-effect border-slate-700/50 max-w-md w-full text-white shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="glass-effect p-4 rounded-full border border-red-500/30">
                <AlertCircle className="text-red-400" size={40} />
              </div>
            </div>
            <CardTitle className="text-3xl text-center gradient-text">Age Verification Required</CardTitle>
            <CardDescription className="text-center text-slate-400 text-base mt-4">
              This platform contains adult content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="glass-effect border border-red-500/30 rounded-lg p-5 space-y-3">
              <p className="text-sm text-red-300 font-medium">⚠️ Content Warning</p>
              <p className="text-sm text-red-200/90 leading-relaxed">
                By continuing, you confirm that you are 18+ years old and wish to view adult content.
              </p>
            </div>
            <div className="space-y-2 text-sm text-slate-400 bg-slate-900/50 rounded-lg p-4">
              <p className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                This app generates NSFW AI images
              </p>
              <p className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                All content is AI-generated and fictional
              </p>
              <p className="flex items-center gap-2">
                <span className="text-purple-400">•</span>
                You must be 18+ to proceed
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              onClick={() => {
                setAgeVerified(true);
                setShowAgeGate(false);
                localStorage.setItem('ageVerified', 'true');
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              I'm 18+ - Continue
            </Button>
            <Button
              onClick={() => window.location.href = 'https://www.google.com'}
              variant="outline"
              className="flex-1 border border-slate-600 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white rounded-lg transition-all"
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
        <div className="max-w-2xl w-full animate-fade-in">
          <Card className="glass-effect border-slate-700/50 text-white shadow-2xl">
            <CardHeader className="border-b border-slate-700/50 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="glass-effect p-2 rounded-lg">
                  {selectedImage.unlockGameType === 'scratch' ? (
                    <span className="text-xl">🎨</span>
                  ) : (
                    <span className="text-xl">🧩</span>
                  )}
                </div>
                <CardTitle className="text-2xl gradient-text">
                  {selectedImage.unlockGameType === 'scratch' ? 'Scratch to Reveal' : 'Solve the Puzzle'}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Complete the game to unlock your image
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8 flex justify-center">
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
            <CardFooter className="border-t border-slate-700/50 pt-6">
              <Button
                onClick={() => {
                  setShowGame(false);
                  setSelectedImage(null);
                }}
                variant="outline"
                className="w-full border border-slate-600 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white rounded-lg py-2 transition-all"
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
    <div className="min-h-screen p-6 md:p-12 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">AI Unlock</span> Gallery
            </h1>
            <p className="text-base text-slate-400">Generate, unlock, and collect stunning AI images through interactive games</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-effect px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700/50 hover:border-purple-500/50 transition-all">
              <Coins className="text-yellow-400" size={24} />
              <span className="text-2xl font-bold text-white">{gems}</span>
            </div>
            <div className="rounded-full border border-slate-700/50 p-0.5">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="glass-effect border border-red-500/30 rounded-xl p-4 mb-6 animate-slide-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-red-300 text-sm">18+ Content Warning</p>
              <p className="text-xs text-red-300/80 leading-relaxed">
                This app generates NSFW AI images. All content is AI-generated and fictional. Verify your age to proceed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Generate & Buy Gems */}
          <div className="space-y-8 animate-fade-in">
            {/* Generate Image */}
            <Card className="glass-effect border-slate-700/50 hover:border-purple-500/50 text-white shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="gradient-text text-xl">Generate Image</CardTitle>
                <CardDescription className="text-slate-400 text-sm">Cost: 5 gems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your ideal image... (NSFW content welcome)"
                  className="w-full h-24 p-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                  disabled={generatingImage}
                />
                <Button
                  onClick={handleGenerateImage}
                  disabled={generatingImage || gems < 5}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
                >
                  {generatingImage ? (
                    <span className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ImageIcon size={18} />
                      Generate Image
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Buy Gems */}
            <Card className="glass-effect border-slate-700/50 hover:border-purple-500/50 text-white shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="gradient-text text-xl">Buy Gems</CardTitle>
                <CardDescription className="text-slate-400 text-xs">Fuel your creativity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleBuyGems('small')}
                  className="w-full justify-between border border-slate-600 hover:border-purple-500 bg-slate-900/50 hover:bg-slate-800 text-white py-3 rounded-lg transition-all"
                >
                  <span className="font-semibold">50 Gems</span>
                  <span className="text-yellow-400">$4.99</span>
                </Button>
                <Button
                  onClick={() => handleBuyGems('medium')}
                  className="w-full justify-between border border-green-500/50 bg-gradient-to-r from-green-900/20 to-emerald-900/20 hover:from-green-900/40 hover:to-emerald-900/40 text-white py-3 rounded-lg transition-all relative overflow-hidden"
                >
                  <span className="font-semibold">150 Gems</span>
                  <span className="text-green-400 font-bold">$9.99 ⭐</span>
                </Button>
                <Button
                  onClick={() => handleBuyGems('large')}
                  className="w-full justify-between border border-slate-600 hover:border-purple-500 bg-slate-900/50 hover:bg-slate-800 text-white py-3 rounded-lg transition-all"
                >
                  <span className="font-semibold">500 Gems</span>
                  <span className="text-yellow-400">$29.99</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card className="glass-effect border-slate-700/50 hover:border-purple-500/50 text-white shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="gradient-text text-xl">Your Gallery</CardTitle>
                <CardDescription className="text-slate-400">
                  {images.length} {images.length === 1 ? 'image' : 'images'} • {images.filter(img => img.isUnlocked).length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <div className="mb-4 flex justify-center">
                      <div className="glass-effect p-6 rounded-full">
                        <ImageIcon size={48} className="opacity-70" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">No images yet</p>
                    <p className="text-sm text-slate-500 mt-1">Generate your first image to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="group cursor-pointer animate-fade-in relative"
                        onClick={() => !image.isUnlocked && handleUnlockImage(image)}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                          <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              image.isUnlocked ? 'group-hover:scale-110' : 'blur-lg group-hover:blur-xl'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        {!image.isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl group-hover:bg-black/60 transition-all duration-300 border border-slate-700/50 group-hover:border-purple-500/50">
                            <div className="text-center">
                              <Lock className="mx-auto mb-2 text-purple-400 group-hover:text-purple-300 transition-colors" size={36} />
                              <p className="text-sm text-white font-semibold">
                                {image.unlockGameType === 'scratch' ? '🎨 Scratch' : '🧩 Puzzle'}
                              </p>
                              <p className="text-xs text-slate-300 mt-1">Click to unlock</p>
                            </div>
                          </div>
                        )}
                        {image.isUnlocked && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1.5 border border-white/20 animate-pulse-glow">
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
