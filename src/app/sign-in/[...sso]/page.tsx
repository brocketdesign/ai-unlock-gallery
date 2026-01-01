import { SignIn } from '@clerk/nextjs';

export default function SignInCatchAllPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">AI Unlock Gallery</h1>
        <p className="text-purple-300 mb-8">Sign in to access 18+ content</p>
        <SignIn />
      </div>
    </div>
  );
}
