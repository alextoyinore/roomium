"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter }  from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (values: { email: string; password: any }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // For client-side redirects after login, use router.push or rely on middleware
      // Setting a cookie might be one way to inform middleware if not using server-side sessions
      document.cookie = `firebaseIdToken=true; path=/; max-age=${60 * 60 * 24 * 7}`; // Example: set a dummy token
      router.push('/dashboard'); 
    } catch (error: any) {
      console.error("Login error:", error);
      // The AuthForm component handles displaying toast errors.
      // Re-throw to let AuthForm handle it.
      throw error;
    }
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      title="Welcome Back!"
      description="Sign in to continue to Roomium."
      buttonText="Login"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    />
  );
}
