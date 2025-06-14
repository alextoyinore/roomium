"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Chrome } from "lucide-react"; // Using Chrome icon for Google
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { auth, GoogleAuthProvider, signInWithPopup } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (values: AuthFormValues) => Promise<void>;
  title: string;
  description: string;
  buttonText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthForm({
  mode,
  onSubmit,
  title,
  description,
  buttonText,
  footerLinkText,
  footerLinkHref,
}: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (values: AuthFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
      // Redirect is handled by middleware or page effect after successful Firebase auth
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // On successful sign-in, Firebase onAuthStateChanged will trigger,
      // and middleware/page effects should handle redirect.
      // We set a cookie here to ensure middleware can pick it up immediately if needed.
      document.cookie = `firebaseIdToken=true; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Error",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {buttonText}
            </Button>
          </form>
        </Form>

        <div className="my-6 flex items-center">
          <Separator className="flex-1" />
          <span className="px-4 text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          Sign {mode === "login" ? "in" : "up"} with Google
        </Button>

        <div className="mt-6 text-center text-sm">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
            {footerLinkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
