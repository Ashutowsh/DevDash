'use client'

export default function GlobalError({ error }: { error: unknown }) {
  const err = error as Error & { digest?: string }

  console.error("🌍 Global RSC Error:", err?.message ?? 'No message', err?.stack ?? 'No stack')

  return (
    <html>
      <body>
        <h2>⚠️ Something went wrong!</h2>
        <p>Error Digest: <code>{err?.digest ?? 'No digest available'}</code></p>
      </body>
    </html>
  )
}
