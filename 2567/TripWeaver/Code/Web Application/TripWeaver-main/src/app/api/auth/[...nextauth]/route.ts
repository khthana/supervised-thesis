import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";
import UserRating from "../../../../../models/userRating";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongoDB();

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials?.emailOrUsername || "");
        const user = await User.findOne(
          isEmail ? { email: credentials?.emailOrUsername } : { username: credentials?.emailOrUsername }
        );

        if (user && user.password) {
          const isValidPassword = await bcrypt.compare(credentials!.password, user.password);
          if (isValidPassword) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              name: user.displayName,
              role: user.role,
              imgPath: user.imgPath || undefined,
            };
          }
        }
        throw new Error("Invalid username/email or password");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectMongoDB();

      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const username = user.email

          existingUser = await User.create({
            googleId: user.id,
            username,
            email: user.email,
            displayName: user.name,
            imgPath: user.image,
            role: "user",
          });

          await UserRating.create({
            userId: existingUser._id,
            rating: [],
          });
        }
        
        user.id = existingUser._id.toString();
        (user as { id: string; role: string; }).role = existingUser.role;
        (user as { id: string; imgPath?: string }).imgPath = existingUser.imgPath;
        return true;
      }
      return true;
    },
    async session({ session, token }) {

      await connectMongoDB();

      const user = (await User.findOne({ _id: token.sub }).lean()) as {
        _id: string;
        displayName?: string;
        name?: string;
        email: string;
        imgPath?: string;
        role: string;
      } | null;

      if (user) {
        session.user = {
          id: user._id.toString(),
          name: user.displayName,
          email: user.email,
          image: user.imgPath,
        };
        (session.user as any).role = user.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: { strategy: "jwt" as SessionStrategy },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

