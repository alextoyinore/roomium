"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, BotMessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeMeetingAction } from "./actions";
import type { SummarizeMeetingOutput } from "@/ai/flows/summarize-meeting";


const summaryFormSchema = z.object({
  transcript: z.string().min(50, { message: "Transcript must be at least 50 characters long." }),
  detailLevel: z.enum(["high", "medium", "low"]),
});

type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export default function SummariesPage() {
  const [summary, setSummary] = useState<SummarizeMeetingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
    defaultValues: {
      transcript: "",
      detailLevel: "medium",
    },
  });

  async function onSubmit(values: SummaryFormValues) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeMeetingAction(values);
      if (result.summary) {
        setSummary(result);
      } else {
         toast({
          variant: "destructive",
          title: "Summarization Error",
          description: "Failed to generate summary. The AI might not have found noteworthy content or an error occurred.",
        });
      }
    } catch (error: any) {
      console.error("Summarization error:", error);
      toast({
        variant: "destructive",
        title: "Summarization Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center">
            <BotMessageSquare className="mr-3 h-8 w-8 text-primary" />
            AI Meeting Summarizer
          </CardTitle>
          <CardDescription>
            Paste your meeting transcript below and let our AI generate a concise summary for you.
            Choose the level of detail you need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="transcript"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Meeting Transcript</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your full meeting transcript here..."
                        className="min-h-[200px] resize-y"
                        {...field}
                        aria-label="Meeting Transcript Input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detailLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Detail Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} aria-label="Summary Detail Level">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select detail level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Major decisions only</SelectItem>
                        <SelectItem value="medium">Medium - Key points</SelectItem>
                        <SelectItem value="high">High - All details</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="shadow-md animate-pulse">
          <CardHeader>
            <CardTitle>Generating Summary...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      )}

      {summary && !isLoading && (
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Meeting Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-md bg-secondary/50 p-4 font-sans text-sm text-secondary-foreground leading-relaxed">
              {summary.summary}
            </pre>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Summary generated by Roomium AI.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
