"use client";

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Email verified successfully!');

      // Redirect to Reset Password
      setTimeout(() => {
        router.push('/auth/reset-password');
      }, 1000);
    }, 1500);
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate resend
    setTimeout(() => {
      setIsResending(false);
      toast.success('Verification code resent!');
    }, 2000);
  }

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
          <h2 className="text-4xl font-bold text-black mb-2 leading-tight">Verify OTP</h2>
          <p className="text-black/60 text-sm font-normal">
            We have sent a verification code to <span className="font-semibold text-black/80">{email || "your email"}</span>.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-8 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2 sm:gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index} 
                    className="w-12 h-14 border border-white/20 bg-white/5 rounded-xl text-xl font-bold text-black focus:ring-1 focus:ring-[#8B2F0E]/50 focus:border-[#8B2F0E]" 
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="w-full space-y-4">
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 bg-[#8B2F0E] hover:bg-[#70260B] text-white rounded-xl text-base font-medium transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center text-sm text-black/60">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#8B2F0E] font-semibold hover:underline disabled:opacity-50 transition-colors"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </div>

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
