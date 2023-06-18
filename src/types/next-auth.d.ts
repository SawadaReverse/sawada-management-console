import { JWT, OAuth2Client } from "google-auth-library";
import { DefaultSession } from "next-auth";

export interface CustomUserSession {
  token: string;
  expiresAt: number;
  email: string;
}

declare module "next-auth" {
  interface Session {
    user: CustomUserSession & DefaultSession["user"];
  }
}

// https://zenn.dev/nrikiji/articles/d37393da5ae9bc#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%92%E4%BD%BF%E3%81%86
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
  }
}
