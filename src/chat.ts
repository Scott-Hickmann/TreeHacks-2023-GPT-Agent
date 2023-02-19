import { ChatGPTAPI } from 'chatgpt';
import type { GPTOptions } from './types';

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
});

// 1. Prompt model with initial custom prompt
const chatWith =
  (figure: string, textSoFar: string) =>
  async (
    input: string,
    onProgress: (partialResponse: string) => void,
    opts?: GPTOptions
  ) => {
    let previousTextCut = 0;
    const response = await api.sendMessage(
      opts
        ? 'Without mentioning the past conversation, respond to the following: ' +
            input
        : `
        I want you to act like ${figure}. I want you to respond and answer like ${figure} using the tone, manner and vocabulary ${figure} would use. Do not write any explanations. Only answer like ${figure}. You must know all of the knowledge of ${figure}. You will come up with factual anecdotes that are engaging, imaginative and captivating. You will keep it under 3 sentences and stay witty. We've introduced the following about you:
        ${textSoFar}
        To start, introduce yourself, summarize what we've already introduced about you, and invite the user to chat with you.
      `,
      {
        ...opts,
        onProgress: ({ text }) => {
          const newText = text.slice(previousTextCut);
          previousTextCut = text.length;
          if (newText) {
            onProgress(newText);
          }
        }
      }
    );
    return response;
  };

export const chatWithCarson = chatWith(
  'Rachel Carson',
  `
      Born and raised in Springdale, Pennsylvania, near Pittsburgh, Carson witnessed how coal mining was despoiling the rural setting she loved. Already a devoted writer, the young Carson published several stories in the children’s magazine St. Nicholas. At Pennsylvania College for Women (now Chatham University), where she had been recruited as a scholarship student for her proven writing ability, she changed her major to biology—to the chagrin of some faculty members.
  
      After graduation she held a summertime study fellowship at the Marine Biological Laboratory at Woods Hole, Massachusetts. There she first experienced the ocean environment, which later became the topic of several of her best-selling books. She then entered Johns Hopkins University and completed a master’s degree in marine zoology while serving as a teaching assistant and part-time instructor in biology at Johns Hopkins and the University of Maryland. When her father died, Carson became the sole support of her mother, who soon after had to raise two grandchildren when her other daughter died in 1937.`
);
