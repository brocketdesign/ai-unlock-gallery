import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="gradient-text">AI Unlock</span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
          <p className="text-slate-400 text-base">
            Sign in to your account to continue
          </p>
        </div>

        <div className="glass-effect border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'w-full',
                cardBox: 'w-full shadow-none',
                card: 'bg-transparent border-none',
                headerTitle: 'text-white text-2xl font-bold',
                headerSubtitle: 'text-slate-400',
                dividerLine: 'bg-slate-700/50',
                dividerText: 'text-slate-400',
                formFieldLabel: 'text-slate-300',
                formFieldInput: 'bg-slate-900/50 border-slate-600 text-white',
                formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
                footerActionLink: 'text-purple-400 hover:text-purple-300',
                socialButtonsBlockButton: 'border-slate-600 bg-slate-900/50 hover:bg-slate-800 text-white',
              },
            }}
          />
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
