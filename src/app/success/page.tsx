"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function SuccessPage() {
  const router = useRouter();
  const { setGems } = useUserStore();

  useEffect(() => {
    const fetchUpdatedGems = async () => {
      try {
        const response = await axios.get('/api/user');
        setGems(response.data.gems);
      } catch (error) {
        console.error('Failed to fetch updated gems:', error);
      }
    };

    fetchUpdatedGems();
  }, [setGems]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-effect border-slate-700/50 max-w-md w-full text-white shadow-2xl animate-fade-in">
        <CardHeader className="text-center border-b border-slate-700/50">
          <div className="flex justify-center mb-6">
            <div className="glass-effect p-4 rounded-full border border-green-500/30 animate-pulse">
              <CheckCircle className="text-green-400" size={56} />
            </div>
          </div>
          <CardTitle className="text-4xl gradient-text mb-3">Payment Successful!</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Your gems have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6 pt-8">
          <div className="glass-effect rounded-lg p-6 border border-green-500/20 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-400" size={24} />
              <p className="text-2xl font-bold text-yellow-400">Gems Added!</p>
            </div>
            <p className="text-sm text-slate-400">
              You can now use your gems to generate stunning AI images!
            </p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Thank you for your purchase. We hope you enjoy generating and unlocking amazing content.
          </p>

          <Button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Return to Gallery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
