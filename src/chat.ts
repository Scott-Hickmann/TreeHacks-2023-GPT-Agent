import { ChatGPTAPIBrowser } from 'chatgpt';
import { PEOPLE } from './people';
import type { GPTOptions } from './types';
import dotenv from 'dotenv';
dotenv.config();

const api = new ChatGPTAPIBrowser({
  email: process.env.OPENAI_EMAIL!,
  password: process.env.OPENAI_PASSWORD!,
  isGoogleLogin: true
});

export const chatWith = async (
  articleId: string,
  input: string,
  onProgress: (partialResponse: string) => void,
  opts?: GPTOptions
) => {
  let previousTextCut = 0;
  const { name, context } = PEOPLE[articleId];
  const response = await api.sendMessage(
    opts
      ? 'Without mentioning the past conversation, respond to the following: ' +
          input
      : `
        I want you to act like ${name}. I want you to respond and answer like ${name} using the tone, manner and vocabulary ${name} would use. Do not write any explanations. Only answer like ${name}. You must know all of the knowledge of ${name}. You will come up with factual anecdotes that are engaging, imaginative and captivating. You will keep it under 3 sentences and stay witty. We've introduced the following about you:
        ${context}
        To start, introduce yourself, summarize what we've already introduced about you, and invite the user to chat with you.
      `,
    {
      ...opts,
      onProgress: ({ response }) => {
        const newText = response.slice(previousTextCut);
        previousTextCut = response.length;
        if (newText) {
          onProgress(newText);
        }
      }
    }
  );
  return response;
};
