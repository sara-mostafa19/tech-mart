import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    token:string
    user: {
      role?: string
      token?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role?: string
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    token?: string
  }
}
