'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        // Set a frontend cookie for middleware to see
        Cookies.set('gulf_admin_auth', 'true', { expires: 1, sameSite: 'lax' });
        toast.success('Logged in successfully');
        router.push('/admin');
      } else {
        toast.error('Invalid password');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-4">
      <div className="bg-cream border border-sand-dark p-8 md:p-12 w-full max-w-md shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sand rounded-full text-ink mb-6">
            <Lock size={24} strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl text-ink">Admin Access</h1>
          <p className="font-body text-sm text-ink-light mt-2 tracking-widest uppercase">The Gulf Edit</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter master password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input text-center text-lg tracking-widest"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full h-14">
            {loading ? 'Verifying...' : 'Unlock Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
