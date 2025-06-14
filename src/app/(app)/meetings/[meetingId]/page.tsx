"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff, Circle, Square, PhoneOff, Send, Users, MessageSquare, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface Message {
  id: string;
  user: string;
  text: string;
  avatar?: string;
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const meetingId = params.meetingId as string;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const participants: Participant[] = [
    { id: "1", name: "Alice", avatar: "https://placehold.co/40x40.png?text=A", isMuted: false, isVideoOff: false },
    { id: "2", name: "Bob", avatar: "https://placehold.co/40x40.png?text=B", isMuted: true, isVideoOff: false },
    { id: "3", name: "You", avatar: "https://placehold.co/40x40.png?text=Y", isMuted: isMuted, isVideoOff: isVideoOff },
    { id: "4", name: "Charlie", avatar: "https://placehold.co/40x40.png?text=C", isMuted: false, isVideoOff: true },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now().toString(),
          user: "You",
          text: chatInput.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setChatInput("");
    }
  };
  
  // Mock video streams
  const videoStreams = Array(participants.length).fill(0);


  return (
    <TooltipProvider>
    <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.16)-2*theme(spacing.8))] flex-col lg:flex-row bg-background rounded-lg shadow-2xl overflow-hidden">
      {/* Main meeting area */}
      <main className="flex-1 flex flex-col bg-muted/30 p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Meeting: <span className="text-primary">{meetingId}</span></h2>
            {currentTime && <div className="text-sm text-muted-foreground font-mono">{currentTime}</div>}
        </div>
        
        {/* Video grid */}
        <div className={`grid gap-4 flex-1 ${videoStreams.length === 1 ? 'grid-cols-1' : videoStreams.length <= 4 ? 'grid-cols-2' : 'grid-cols-3' } content-start`}>
          {participants.map((p, index) => (
            <Card key={p.id} className="aspect-video bg-card shadow-md overflow-hidden relative">
              <Image
                src={`https://placehold.co/600x338.png?text=${p.name.substring(0,1)}`}
                alt={`${p.name}'s video stream`}
                data-ai-hint="person video"
                layout="fill"
                objectFit="cover"
                className={p.isVideoOff ? "opacity-50 grayscale" : ""}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 {p.isVideoOff && <VideoOff className="h-12 w-12 text-white/70" />}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                {p.isMuted ? <MicOff className="h-4 w-4 text-red-400"/> : <Mic className="h-4 w-4"/>}
                {p.name}
              </div>
            </Card>
          ))}
        </div>

        {/* Controls bar */}
        <div className="mt-4 py-3 px-4 bg-card border-t border-border rounded-lg shadow-md">
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={isMuted ? "destructive" : "outline"} size="icon" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <MicOff /> : <Mic />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={isVideoOff ? "destructive" : "outline"} size="icon" onClick={() => setIsVideoOff(!isVideoOff)} aria-label={isVideoOff ? "Start Video" : "Stop Video"}>
                  {isVideoOff ? <VideoOff /> : <Video />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVideoOff ? "Start Video" : "Stop Video"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsScreenSharing(!isScreenSharing)} aria-label={isScreenSharing ? "Stop Sharing" : "Share Screen"}>
                  {isScreenSharing ? <ScreenShareOff className="text-primary" /> : <ScreenShare />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsRecording(!isRecording)} aria-label={isRecording ? "Stop Recording" : "Start Recording"}>
                  {isRecording ? <Square className="text-destructive fill-destructive" /> : <Circle className="text-red-500" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRecording ? "Stop Recording" : "Start Recording"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="outline" size="icon" aria-label="Settings">
                    <Settings2 />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" aria-label="Leave Meeting" className="px-3 sm:px-4">
                  <PhoneOff className="h-5 w-5" />
                   <span className="ml-2 hidden sm:inline">Leave</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave Meeting</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </main>

      {/* Sidebar for Chat/Participants */}
      <aside className="w-full lg:w-80 xl:w-96 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex">
            <Button variant={activeTab === "chat" ? "secondary" : "ghost"} onClick={() => setActiveTab("chat")} className="flex-1 rounded-r-none">
              <MessageSquare className="mr-2 h-4 w-4"/>Chat
            </Button>
            <Button variant={activeTab === "participants" ? "secondary" : "ghost"} onClick={() => setActiveTab("participants")} className="flex-1 rounded-l-none">
              <Users className="mr-2 h-4 w-4"/>Participants ({participants.length})
            </Button>
          </div>
        </div>

        {activeTab === "chat" && (
          <>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 mb-3 ${msg.user === "You" ? "justify-end" : ""}`}>
                  {msg.user !== "You" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>{msg.user.substring(0,1)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] p-3 rounded-lg ${msg.user === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.user === "You" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.timestamp} {msg.user !== "You" ? `- ${msg.user}` : ""}</p>
                  </div>
                   {msg.user === "You" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participants.find(p=>p.name==="You")?.avatar} />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {chatMessages.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Start the conversation!</p>}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1"
                  aria-label="Chat message input"
                />
                <Button type="submit" size="icon" aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}

        {activeTab === "participants" && (
          <ScrollArea className="flex-1 p-4">
            <ul className="space-y-3">
              {participants.map(p => (
                <li key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback>{p.name.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{p.name} {p.name === "You" && "(You)"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.isMuted ? <MicOff className="h-4 w-4 text-muted-foreground" /> : <Mic className="h-4 w-4 text-green-500" />}
                    {p.isVideoOff ? <VideoOff className="h-4 w-4 text-muted-foreground" /> : <Video className="h-4 w-4 text-green-500" />}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </aside>
    </div>
    </TooltipProvider>
  );
}

// Adding a placeholder Image component if next/image is not fully configured or causing issues in this context
const Image = ({ src, alt, className, layout, objectFit, width, height, ...props }: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} style={{objectFit: objectFit, width: '100%', height: '100%'}} {...props} />;
};
