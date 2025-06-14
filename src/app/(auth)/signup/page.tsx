"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { auth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (values: { email: string; password: any }) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      document.cookie = `firebaseIdToken=true; path=/; max-age=${60 * 60 * 24 * 7}`; // Example: set a dummy token
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error; // Re-throw to let AuthForm handle toast
    }
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSignup}
      title="Create Account"
      description="Get started with Roomium today."
      buttonText="Sign Up"
      footerLinkText="Login"
      footerLinkHref="/login"
    />
  );
}
