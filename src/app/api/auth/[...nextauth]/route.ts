import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Đây là cấu hình NextAuth cơ bản. Bạn sẽ cần thay thế logic trong `authorize`
// bằng logic gọi API đăng nhập thực tế của bạn.

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrUsername: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Thay thế logic này bằng việc gọi API đăng nhập của bạn
        // Ví dụ: const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, ...);
        // const data = await res.json();

        // Logic giả định: nếu email và password đúng, trả về user object
        if (credentials?.emailOrUsername && credentials?.password) {
          const user = {
            id: '1',
            name: 'Test User',
            email: credentials.emailOrUsername,
            accessToken: 'mock-access-token', // Bạn sẽ nhận token này từ API
          };
          return user;
        }

        // Trả về null nếu đăng nhập thất bại
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Callback này được gọi sau khi `authorize` thành công
    async jwt({ token, user }) {
      // Khi đăng nhập, user object sẽ có sẵn
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // Callback này quản lý session phía client
    async session({ session, token }) {
      if (token.accessToken) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

