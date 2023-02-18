import { z } from 'zod';

export const GPTOptions = z.object({
  conversationId: z.string(),
  parentMessageId: z.string()
});

export type GPTOptions = z.infer<typeof GPTOptions>;

export const RequestData = z.object({
  input: z.string(),
  info: GPTOptions.optional()
});

export type RequestData = z.infer<typeof RequestData>;
