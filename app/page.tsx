import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Twitch Badge Notifications</h1>
      <p>
        <AuthLink />
      </p>
    </main >
  )
}

function AuthLink() {
  const CLIENT_ID = 'lbupensyhm1cb4hro58k5u2kldby1n'
  const CALLBACK_URL = 'http://localhost:3000/api/auth'
  const PERMISSIONS = 'user:read:email'
  const TWITCH_AUTH_URL = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=${PERMISSIONS}`

  return (
    <Link href={TWITCH_AUTH_URL}>
      Connect With Twitch!
    </Link>
  )
}
