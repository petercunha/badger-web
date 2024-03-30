import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from 'crypto';

const clientId = 'lbupensyhm1cb4hro58k5u2kldby1n'
const clientSecret = 'e731hk3ou7iocdcxdql188ayikzc37'

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code') || ''
    const user = await getTwitchUser(code)

    // TODO: Add user to DB

    // Set session token
    const sessionToken = randomBytes(16).toString('base64')
    cookies().set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    })

    // TODO: Add session to db

    // TODO: Authorization middleware on dashboard

    return NextResponse.json(user)
}

async function getTwitchUser(code: string) {
    // Get Bearer token
    const auth = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
        body: new URLSearchParams({
            'client_id': clientId,
            'client_secret': clientSecret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost:3000/api/auth',
        })
    })
    const authResponse = await auth.json()

    // Get twitch user data
    const twitchUser = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${authResponse.access_token}`,
          'Client-Id': clientId
        }
    })
    const twitchUserJson = await twitchUser.json()

    return twitchUserJson
}