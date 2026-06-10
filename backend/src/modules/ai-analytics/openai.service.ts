import { Injectable, Logger } from '@nestjs/common';
import { ConfigService }        from '@nestjs/config';
import axios                    from 'axios';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class OpenAiService {
  private readonly log = new Logger(OpenAiService.name);
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(private readonly cfg: ConfigService) {}

  private get apiKey() { return this.cfg.get<string>('OPENAI_API_KEY')!; }

  async chat(messages: ChatMessage[], temperature = 0.3): Promise<string> {
    const { data } = await axios.post(
      `${this.baseUrl}/chat/completions`,
      { model: 'gpt-4o', messages, temperature, max_tokens: 1500 },
      { headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' } },
    );
    return data.choices[0].message.content as string;
  }

  async embed(text: string): Promise<number[]> {
    const { data } = await axios.post(
      `${this.baseUrl}/embeddings`,
      { model: 'text-embedding-3-small', input: text },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return data.data[0].embedding as number[];
  }
}
