"use client";

import Link from "next/link";
import styles from "./page.module.css";
import React from "react";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Twitch Badge Notifications</h1>
      <p>
        <AuthLink />
      </p>
    </main>
  );
}

function AuthLink() {
  const CLIENT_ID = "lbupensyhm1cb4hro58k5u2kldby1n";
  const CALLBACK_URL = `${typeof window !== "undefined" ? window.location.protocol + "//" + window.location.host : "https://badger-web.vercel.app"}/api/auth`;
  const PERMISSIONS = "user:read:email";
  const TWITCH_AUTH_URL = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=${PERMISSIONS}`;

  return <Link href={TWITCH_AUTH_URL}>Connect With Twitch!</Link>;
}
