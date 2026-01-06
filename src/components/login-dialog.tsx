'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut } from 'lucide-react';

export function LoginDialog() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This effect ensures the RecaptchaVerifier is only created once on the client
  useEffect(() => {
    if (!open || !auth || window.recaptchaVerifier) return;

    try {
      // The verifier is initialized only when the dialog is open, ensuring
      // the 'recaptcha-container' div is in the DOM.
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
    } catch (error) {
      console.error('Error creating RecaptchaVerifier:', error);
      toast({
        variant: 'destructive',
        title: 'Recaptcha Error',
        description: 'Could not initialize Recaptcha. Please refresh the page.',
      });
    }
  }, [open, auth, toast]);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Phone Number Required',
        description: 'Please enter a valid phone number.',
      });
      return;
    }
    if (!window.recaptchaVerifier) {
      toast({
        variant: 'destructive',
        title: 'Recaptcha Not Ready',
        description: 'Please wait a moment and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      toast({
        title: 'OTP Sent',
        description: 'A one-time password has been sent to your phone.',
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.message || 'An unknown error occurred.',
      });
      // Reset reCAPTCHA if it fails
      window.recaptchaVerifier.render().then((widgetId: any) => {
        if(window.grecaptcha) {
          window.grecaptcha.reset(widgetId);
        }
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        variant: 'destructive',
        title: 'OTP Required',
        description: 'Please enter the one-time password.',
      });
      return;
    }
    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Please request an OTP first.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Login Successful!',
        description: 'You are now signed in.',
      });
      setOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'An unknown error occurred.',
      });
    }
  };

  if (isUserLoading) {
    return <Button variant="ghost" size="icon" disabled><User className="h-6 w-6" /></Button>;
  }

  if (user) {
    return (
      <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
        <LogOut className="h-6 w-6 text-primary" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Sign In">
          <User className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login with Phone</DialogTitle>
          <DialogDescription>
            Enter your phone number to receive a one-time password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!confirmationResult ? (
            <div className="space-y-4">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555-555-5555"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="tel"
              />
              <Button onClick={handleSendOtp} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                autoComplete="one-time-code"
              />
              <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Verifying...' : 'Verify & Login'}
              </Button>
            </div>
          )}
        </div>
        <div id="recaptcha-container"></div>
      </DialogContent>
    </Dialog>
  );
}

// Extend the Window interface to include properties we are adding
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}
