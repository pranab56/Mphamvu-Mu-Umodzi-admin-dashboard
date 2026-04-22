"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
      setIsSuccess(true);
      toast.success('Reset link sent successfully!');

      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
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
          <h2 className="text-4xl font-bold text-black mb-2 leading-tight">Forgot Password</h2>
          <p className="text-black/60 text-sm font-normal">Enter your registered email to receive an OTP.</p>
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
                disabled={isLoading || isSuccess}
                className={cn(
                  "h-12 pl-12 bg-white/5 border-white/20 rounded-xl text-black placeholder:text-black/80 focus-visible:ring-1 focus-visible:ring-white/40 transition-all",
                  errors.email && "border-red-500/50 bg-red-500/10"
                )}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full h-12 bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-xl text-base font-medium transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : isSuccess ? 'Code Sent!' : 'Send Reset Link'}
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
