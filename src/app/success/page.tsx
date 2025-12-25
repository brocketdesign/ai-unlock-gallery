"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-black/40 backdrop-blur-lg border-purple-500/50 text-white">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-400" size={64} />
          </div>
          <CardTitle className="text-3xl text-center text-purple-300">Payment Successful!</CardTitle>
          <CardDescription className="text-center text-gray-300 text-lg mt-4">
            Your gems have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-300">
            Thank you for your purchase. You can now use your gems to generate AI images!
          </p>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Go to Gallery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
