import { z } from 'zod';
import { PEOPLE } from './people';

export const GPTOptions = z.object({
  conversationId: z.string(),
  parentMessageId: z.string()
});

export type GPTOptions = z.infer<typeof GPTOptions>;

export const RequestData = z.object({
  articleId: z.string().refine((id) => PEOPLE.hasOwnProperty(id)),
  input: z.string(),
  info: GPTOptions.optional()
});

export type RequestData = z.infer<typeof RequestData>;

export interface Person {
  name: string;
  context: string;
}
