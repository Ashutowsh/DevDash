'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { Github, ShieldCheck, Brain, BarChart } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center">
        <Logo />
        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-20 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-primary">DevDash</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your unified developer dashboard to monitor code quality, track commits, analyze security scans, and ask intelligent questions — all in one place.
        </p>
        <Link href="/new-project">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
        <FeatureCard
          title="GitHub Integration"
          icon={<Github className="w-6 h-6 text-primary" />}
          description="Connect your GitHub repo to visualize commit activity, contributors, and project structure."
        />
        <FeatureCard
          title="AI-Powered Q&A"
          icon={<Brain className="w-6 h-6 text-primary" />}
          description="Ask technical questions about your codebase and get instant, intelligent responses."
        />
        <FeatureCard
          title="Security Insights"
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
          description="Scan your repositories for vulnerabilities and view severity levels in real-time."
        />
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} DevDash. All rights reserved.
      </footer>
    </main>
  )
}

function FeatureCard({
  title,
  icon,
  description,
}: {
  title: string
  icon: React.ReactNode
  description: string
}) {
  return (
    <div className="rounded-xl border bg-muted/40 p-6 shadow-sm hover:shadow-md transition-colors text-left flex flex-col gap-4">
      <div>{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
