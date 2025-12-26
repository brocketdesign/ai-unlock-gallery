import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">AI Unlock Gallery</h1>
        <p className="text-purple-300 mb-4">Create an account to get started</p>
        <p className="text-red-400 mb-8 text-sm">⚠️ You must be 18+ to use this service</p>
        <SignUp />
      </div>
    </div>
  );
}
