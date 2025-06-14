import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MeetingsPage() {
  // Generate a pseudo-random meeting ID for demonstration
  const newMeetingId = `room-${Math.random().toString(36).substring(2, 10)}`;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <CardTitle className="text-3xl md:text-4xl font-headline flex items-center text-primary">
              <Video className="mr-3 h-10 w-10" />
              Video Meetings
            </CardTitle>
            <CardDescription className="mt-4 text-lg text-muted-foreground">
              Start or join video calls with screen sharing, chat, and recording capabilities.
              Connect with your team 얼굴을 맞대고 (face-to-face).
            </CardDescription>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/meetings/${newMeetingId}`}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Start New Meeting
                </Link>
              </Button>
            </div>
          </div>
           <div className="bg-gradient-to-br from-primary/10 to-accent/10 hidden md:flex items-center justify-center p-8">
             <Image 
              src="https://placehold.co/600x400.png"
              alt="Video conference illustration"
              data-ai-hint="video conference team"
              width={500}
              height={350}
              className="rounded-lg shadow-xl object-cover"
            />
           </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline">Join a Meeting</CardTitle>
            <CardDescription>Have a meeting ID? Enter it here to join.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            {/* This input and button are for demonstration and not functional yet */}
            <input type="text" placeholder="Enter Meeting ID" className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            <Button variant="outline">Join</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline">Scheduled Meetings</CardTitle>
            <CardDescription>View your upcoming scheduled meetings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No meetings scheduled. (Feature coming soon)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
