"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, FileText, Video as VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-primary-foreground shadow-lg">
        <h1 className="text-4xl font-headline font-bold">Welcome to Roomium{user?.displayName ? `, ${user.displayName}` : ""}!</h1>
        <p className="mt-2 text-lg text-primary-foreground/90">
          Your all-in-one solution for seamless video conferencing and smart meeting summaries.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">Get Started</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <PlusCircle className="h-6 w-6 text-accent" />
                Start a New Meeting
              </CardTitle>
              <CardDescription>Instantly create a new video call room and invite participants.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/meetings/new">
                  <VideoIcon className="mr-2 h-4 w-4" /> Create Meeting
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <FileText className="h-6 w-6 text-accent" />
                Generate Meeting Summary
              </CardTitle>
              <CardDescription>Use AI to summarize your meeting transcripts and extract key insights.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/summaries">
                  <FileText className="mr-2 h-4 w-4" /> Go to Summaries
                </Link>
              </Button>
            </CardContent>
          </Card>

           <Card className="hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <VideoIcon className="h-6 w-6 text-accent" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>View your scheduled meetings and join with one click.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
              {/* Placeholder for upcoming meetings list */}
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mt-8">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-6">
                <h3 className="text-2xl font-headline font-semibold text-foreground">Powerful AI Summaries</h3>
                <p className="mt-2 text-muted-foreground">
                  Never miss a detail. Roomium's AI automatically transcribes and summarizes your meetings, highlighting action items and key decisions.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/summaries">Learn More</Link>
                </Button>
              </div>
              <div className="hidden md:block h-full">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="AI Summaries Illustration"
                  data-ai-hint="team collaboration"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </section>
    </div>
  );
}
