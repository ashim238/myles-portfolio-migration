import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { hasJuliusAccess, JULIUS_COOKIE, JULIUS_PATH, JULIUS_UNLOCK_PATH, unlockJulius } from "@/lib/julius-access";
import styles from "./unlock.module.css";

export const metadata = {
  title: "Julius Design System · Password required",
  robots: { index: false, follow: false },
};

async function unlock(form: FormData) {
  "use server";
  const password = form.get("password");
  const token = typeof password === "string" ? await unlockJulius(password) : null;
  if (!token) redirect(`${JULIUS_UNLOCK_PATH}?error=1`);
  (await cookies()).set(JULIUS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Session cookie: no password or verifier is sent to the client.
  });
  redirect(JULIUS_PATH);
}

export default async function JuliusUnlockPage({ searchParams }: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (hasJuliusAccess((await cookies()).get(JULIUS_COOKIE)?.value)) redirect(JULIUS_PATH);
  const { error } = await searchParams;
  return (
    <ReaderShell slug="julius-design-system" title="Julius Design System">
      <section className={styles.gate} aria-labelledby="unlock-title">
        <p>Private case study</p>
        <h1 id="unlock-title">Julius Design System</h1>
        <p>Enter the password to read this case study.</p>
        <form action={unlock} className={styles.form}>
          <label htmlFor="julius-password">Password</label>
          <input id="julius-password" name="password" type="password" autoComplete="current-password" required maxLength={256} aria-invalid={error ? true : undefined} aria-describedby={error ? "password-error" : undefined} />
          {error && <p id="password-error" role="alert">That password isn’t correct. Please try again.</p>}
          <button type="submit" className="reader-control">View case study</button>
        </form>
      </section>
    </ReaderShell>
  );
}
