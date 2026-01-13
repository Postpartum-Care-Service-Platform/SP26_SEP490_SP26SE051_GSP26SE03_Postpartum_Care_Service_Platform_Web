import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      accessToken?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken?: string | null;
  }
}

