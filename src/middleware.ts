import { StatusCodes } from "http-status-codes";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { InternalServerError } from "./types/api/error";

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

const redirectToLogin = (req: NextRequest) => {
  const callbackURL = new URL("/api/auth/signin", req.url);
  callbackURL.searchParams.set("callbackUrl", encodeURI(req.url));
  return NextResponse.redirect(callbackURL);
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return redirectToLogin(req);
  }
  const tokenValidResult = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${token.accessToken}`
  );
  if (
    tokenValidResult.status === StatusCodes.UNAUTHORIZED ||
    tokenValidResult.status === StatusCodes.BAD_REQUEST
  ) {
    return redirectToLogin(req);
  }
  if (tokenValidResult.status !== StatusCodes.OK) {
    console.error(tokenValidResult.status);
    throw new InternalServerError();
  }

  NextResponse.next();
}
