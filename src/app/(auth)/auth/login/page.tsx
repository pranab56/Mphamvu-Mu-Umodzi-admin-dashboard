"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful!');
      router.push('/');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/auth/image.png')" }}>

      {/* Dark Brown Overlay */}
      <div className="absolute inset-0 bg-[#4A200B]/30 backdrop-blur-[2px]" />

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 p-8 flex flex-col items-center shadow-2xl"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-24 h-24 flex items-center justify-center overflow-hidden relative">
            <Image src="/icons/logo.png" alt="MMU Logo" fill className="object-contain p-2" />
          </div>
          <h1 className="text-[32px] font-black text-[#A53200] leading-none mb-2 tracking-tight">MMU</h1>
          <h2 className="text-4xl font-bold text-black mb-2 leading-tight">Welcome Back</h2>
          <p className="text-black/60 text-sm font-normal">Sign in to access the author dashboard</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-normal text-black/80 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                placeholder="admin@rizipt.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={cn(
                  "h-12 pl-12 bg-white/5 border-white/20 rounded-xl text-black placeholder:text-black/80 focus-visible:ring-1 focus-visible:ring-white/40 transition-all",
                  errors.email && "border-red-500/50 bg-red-500/10"
                )}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-normal text-black/80 ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={cn(
                  "h-12 pl-12 pr-12 bg-white/5 border-white/20 rounded-xl text-black placeholder:text-black/80 focus-visible:ring-1 focus-visible:ring-white/40 transition-all tracking-widest",
                  errors.password && "border-red-500/50 bg-red-500/10"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-black/40 hover:text-black transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="w-5 h-5 rounded-[6px] border-black/20 data-[state=checked]:bg-[#8B2F0E] data-[state=checked]:border-[#8B2F0E]"
              />
              <label
                htmlFor="remember"
                className="text-sm font-normal text-black/80 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot-password" title="Forgot Password?" className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12  bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-xl text-base font-medium transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-xs text-black/50 font-normal tracking-wide">
              Secure Admin Access • MMU &copy; 2026
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
