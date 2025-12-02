import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getOpenAIKey } from '../utils/env';

dotenv.config();
const openaiKey = getOpenAIKey();
export const openai = new OpenAI({
  apiKey: openaiKey,
});