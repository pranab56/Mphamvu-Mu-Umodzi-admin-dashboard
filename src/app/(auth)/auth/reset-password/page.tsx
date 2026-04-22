"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter} from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const router = useRouter();

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset successfully!');

      // Redirect to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/images/auth/image.png')" }}>

      {/* Dark Brown Overlay */}
      <div className="absolute inset-0 bg-[#4A200B]/30 backdrop-blur-[2px]" />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 p-8 flex flex-col items-center shadow-2xl"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/20 overflow-hidden relative">
            <Image src="/icons/logo.png" alt="MMU Logo" fill className="object-contain p-2" />
          </div>
          <h1 className="text-[32px] font-black text-[#A53200] leading-none mb-2 tracking-tight">MMU</h1>
          <h2 className="text-4xl font-bold text-black mb-2 leading-tight">Reset Password</h2>
          <p className="text-black/60 text-sm font-normal">Your new password must be different.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-normal text-black/80 ml-1">New Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
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

          <div className="space-y-2">
            <label className="text-sm font-normal text-black/80 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                className={cn(
                  "h-12 pl-12 pr-12 bg-white/5 border-white/20 rounded-xl text-black placeholder:text-black/80 focus-visible:ring-1 focus-visible:ring-white/40 transition-all tracking-widest",
                  errors.confirmPassword && "border-red-500/50 bg-red-500/10"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-black/40 hover:text-black transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-xl text-base font-medium transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/auth/login"
              className="text-black/60 hover:text-[#8B2F0E] font-medium inline-flex items-center gap-2 group transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center w-full">
            <p className="text-xs text-black/50 font-normal tracking-wide">
              Secure Admin Access • MMU &copy; 2026
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
