import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Session, User } from "@prisma/client";
import prisma from "@/db";

const clientId = "lbupensyhm1cb4hro58k5u2kldby1n";
const clientSecret = "e731hk3ou7iocdcxdql188ayikzc37";
const sessionLengthDays = 7;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  const twitchUser = await getTwitchUser(code);

  // Add or update user
  const user = await prisma.user.upsert({
    where: { twitch_id: twitchUser.twitch_id },
    update: { ...twitchUser },
    create: { ...twitchUser },
  });

  // Create session in DB
  const token = randomBytes(16).toString("base64");
  const expires = new Date();
  expires.setDate(expires.getDate() + sessionLengthDays);
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: token,
      expires: expires.toISOString(),
    },
  });

  // Set user and session cookies
  setCookies(user, session);

  // Success
  return NextResponse.redirect(new URL("/dashboard", request.url));

  // return new Response(`Welcome ${user.display_name}! Your session is ${JSON.stringify(session, null, 2)}`, {
  //     status: 200,
  // });
}

function setCookies(user: User, session: Session) {
  const cookieSecure = process.env.NODE_ENV === "production";
  const cookieAge = 60 * 60 * 24 * sessionLengthDays;

  // Set session token (TODO: Add to DB)
  cookies().set("session", session.token, {
    httpOnly: true,
    secure: cookieSecure,
    maxAge: cookieAge,
    path: "/",
  });

  // Set user info
  cookies().set("user", JSON.stringify(user), {
    httpOnly: false,
    secure: cookieSecure,
    maxAge: cookieAge,
    path: "/",
  });
}

async function getTwitchUser(code: string) {
  // Get Bearer token
  const auth = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000/api/auth",
    }),
  });
  const authResponse = await auth.json();

  // Get twitch user data
  const twitchUser = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${authResponse.access_token}`,
      "Client-Id": clientId,
    },
  });
  const twitchUserJson: UserFromTwitchApiResponse = (await twitchUser.json())
    .data[0];
  return convertToDbObject(twitchUserJson);
}

function convertToDbObject(
  rawUser: UserFromTwitchApiResponse,
): Omit<User, "id"> {
  return {
    twitch_id: rawUser.id,
    login: rawUser.login,
    display_name: rawUser.display_name,
    type: rawUser.type,
    broadcaster_type: rawUser.broadcaster_type,
    description: rawUser.description,
    profile_image_url: rawUser.profile_image_url,
    offline_image_url: rawUser.offline_image_url,
    email: rawUser.email,
    created_at: rawUser.created_at,
  };
}

interface UserFromTwitchApiResponse {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  email: string;
  created_at: Date;
}
