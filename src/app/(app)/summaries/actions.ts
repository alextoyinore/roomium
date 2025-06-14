"use server";

import { summarizeMeeting } from "@/ai/flows/summarize-meeting";
import type { SummarizeMeetingInput, SummarizeMeetingOutput } from "@/ai/flows/summarize-meeting";

export async function summarizeMeetingAction(
  input: SummarizeMeetingInput
): Promise<SummarizeMeetingOutput> {
  try {
    const result = await summarizeMeeting(input);
    return result;
  } catch (error) {
    console.error("Error in summarizeMeetingAction:", error);
    // It's better to throw a custom error or a refined error message
    // For now, rethrow the original error if it's an instance of Error
    if (error instanceof Error) {
      throw new Error(`Failed to summarize meeting: ${error.message}`);
    }
    throw new Error("An unknown error occurred during summarization.");
  }
}
