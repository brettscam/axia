import { useState } from 'react';
import type { FormEvent } from 'react';
import { Logo } from '@/brand';
import { useAuth } from './useAuth';

export function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const signIn = useAuth((s) => s.signIn);
  const signUp = useAuth((s) => s.signUp);

  const isSignIn = mode === 'signin';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const action = isSignIn ? signIn : signUp;
    const { error: authError } = await action(email, password);

    if (authError) {
      setError(authError.message);
    }

    setSubmitting(false);
  }

  function toggleMode() {
    setMode(isSignIn ? 'signup' : 'signin');
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo variant="color" size={48} />
          <h1 className="font-display text-2xl font-medium text-ink">Axia</h1>
        </div>

        <div className="rounded-[12px] border border-fog/20 bg-white/50 p-8">
          <h2 className="mb-6 font-display text-xl font-medium text-ink">
            {isSignIn ? 'Sign in' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-[8px] border border-fog/30 bg-white px-3 py-2 text-slate placeholder:text-fog/50 focus:border-ink focus:outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate">Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-[8px] border border-fog/30 bg-white px-3 py-2 text-slate placeholder:text-fog/50 focus:border-ink focus:outline-none"
                placeholder="At least 6 characters"
              />
            </label>

            {error && (
              <p className="text-sm text-flag">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-[8px] bg-ink px-4 py-2.5 font-medium text-parchment transition-opacity disabled:opacity-50"
            >
              {submitting
                ? 'Please wait...'
                : isSignIn
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fog">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-fog underline transition-colors hover:text-ink"
            >
              {isSignIn ? 'Create account' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
