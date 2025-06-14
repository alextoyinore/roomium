'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing meeting transcripts.
 *
 * - summarizeMeeting - A function that summarizes the meeting transcript.
 * - SummarizeMeetingInput - The input type for the summarizeMeeting function.
 * - SummarizeMeetingOutput - The return type for the summarizeMeeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to be summarized.'),
  detailLevel: z
    .enum(['high', 'medium', 'low'])
    .default('medium')
    .describe(
      'The level of detail to include in the summary. High includes all details, medium includes key points, and low includes only major decisions.'
    ),
});
export type SummarizeMeetingInput = z.infer<typeof SummarizeMeetingInputSchema>;

const SummarizeMeetingOutputSchema = z.object({
  summary: z.string().describe('The summary of the meeting transcript.'),
});
export type SummarizeMeetingOutput = z.infer<typeof SummarizeMeetingOutputSchema>;

export async function summarizeMeeting(input: SummarizeMeetingInput): Promise<SummarizeMeetingOutput> {
  return summarizeMeetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMeetingPrompt',
  input: {schema: SummarizeMeetingInputSchema},
  output: {schema: SummarizeMeetingOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing meeting transcripts.

  Summarize the following meeting transcript, focusing on the key discussion points and decisions made. The level of detail should be based on the detailLevel parameter.

  Transcript: {{{transcript}}}
  Detail Level: {{{detailLevel}}}

  Summary:
  `,
});

const summarizeMeetingFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingFlow',
    inputSchema: SummarizeMeetingInputSchema,
    outputSchema: SummarizeMeetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
