import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/models/userModel";

export const authOptions:NextAuthOptions={
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id:"credentials",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials:any):Promise<any> {
        await connectDb();
        try {
          console.log(credentials);
          
         const user= await User.findOne(
            {$or:[{username:credentials.identifier},{email:credentials.identifier}]}
          )
          if (!user) {
            throw new Error("User not found")
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login")
          }

          const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid password")
          }

          
        } catch (error:any) {
          throw new Error(error);
        }
        
      }
    })
  ],
  pages:{
    signIn:"/sign-in"
  },
  secret:process.env.NEXTAUTH_SECRET,
  session:{
    strategy:"jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
}