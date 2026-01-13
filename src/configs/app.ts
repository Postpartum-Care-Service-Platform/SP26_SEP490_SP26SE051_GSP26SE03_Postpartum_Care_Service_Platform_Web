import { env } from './env';

export const appConfig = {
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  },
} as const;
