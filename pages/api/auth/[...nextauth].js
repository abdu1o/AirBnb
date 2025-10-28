import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("airbnb");

        const existingUser = await db.collection("users").findOne({ email: user.email });

        if (!existingUser) {
          // создаём временного пользователя без phone и dob
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name || "",
            password: null,
            avatarUrl: user.image || "",
            description: "",
            phone: "",
            dob: "",
            createdAt: new Date(),
          });
        }

        return true;
      } catch (err) {
        console.error("Ошибка signIn:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/", // редирект на главную
  },
});
