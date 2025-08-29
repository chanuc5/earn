"use client"

import { useMemo, useState } from "react"

type Job = {
  title: string
  company: string
  type: string
  location: string
  tags: string[]
  pay: string
}

const seedJobs: Job[] = [
  {
    title: "Frontend Engineer",
    company: "Acme Inc.",
    type: "Remote",
    location: "Global",
    tags: ["React", "TypeScript"],
    pay: "$90k–$120k",
  },
  {
    title: "Backend Developer",
    company: "Nimbus",
    type: "Hybrid",
    location: "Berlin",
    tags: ["Node.js", "Postgres"],
    pay: "€70k–€95k",
  },
  {
    title: "ML Engineer",
    company: "VisionAI",
    type: "Onsite",
    location: "Bangalore",
    tags: ["Python", "PyTorch"],
    pay: "₹18–28 LPA",
  },
  {
    title: "Fullstack Dev",
    company: "Nova Labs",
    type: "Remote",
    location: "US",
    tags: ["Next.js", "Prisma"],
    pay: "$100k–$140k",
  },
  {
    title: "DevOps Engineer",
    company: "Cloudify",
    type: "Remote",
    location: "EU",
    tags: ["AWS", "Kubernetes"],
    pay: "€80k–€110k",
  },
  {
    title: "Data Analyst",
    company: "Insight Co.",
    type: "Hybrid",
    location: "Toronto",
    tags: ["SQL", "Tableau"],
    pay: "CA$75k–CA$95k",
  },
]

export default function DashboardSections() {
  const [query, setQuery] = useState("")
  const jobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return seedJobs
    return seedJobs.filter((j) =>
      [j.title, j.company, j.type, j.location, ...j.tags].join(" ").toLowerCase().includes(q),
    )
  }, [query])

  const promptText = `You are a professional job application assistant.
Write a concise cover letter (120-160 words) that references 1-2 relevant skills from the job description.
Use a friendly, confident tone. End with a short call to action.`

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <section aria-labelledby="welcome" className="mb-6">
        <h1 id="welcome" className="text-2xl font-semibold text-balance">
          Welcome to your dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Search jobs and use AI resources to accelerate your applications.
        </p>
      </section>

      <section aria-labelledby="search" className="mb-6">
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <input
          id="job-search"
          placeholder="Search jobs, companies, skills..."
          className="w-full rounded-md border bg-background px-3 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      <section aria-labelledby="quick" className="mb-8">
        <h2 id="quick" className="text-lg font-semibold mb-3">
          Quick access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a href="#prompt-engineering" className="rounded-lg border p-4 hover:bg-muted">
            <h3 className="font-semibold mb-1">Prompt Engineering</h3>
            <p className="text-sm text-muted-foreground">Ready-to-use prompts for better applications.</p>
          </a>
          <a href="#ai-tools" className="rounded-lg border p-4 hover:bg-muted">
            <h3 className="font-semibold mb-1">AI Tools</h3>
            <p className="text-sm text-muted-foreground">Helpful tools for resumes, cover letters, and more.</p>
          </a>
          <a href="#ebooks" className="rounded-lg border p-4 hover:bg-muted">
            <h3 className="font-semibold mb-1">eBooks</h3>
            <p className="text-sm text-muted-foreground">Curated reading to level up your job search.</p>
          </a>
        </div>
      </section>

      <section aria-labelledby="jobs" className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 id="jobs" className="text-lg font-semibold">
            Jobs
          </h2>
          <span className="text-sm text-muted-foreground">{jobs.length} results</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {jobs.map((j, idx) => (
            <article key={idx} className="rounded-lg border p-4">
              <h3 className="font-semibold">{j.title}</h3>
              <div className="mt-1 text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                <span>{j.company}</span>
                <span>• {j.type}</span>
                <span>• {j.location}</span>
                <span>• {j.pay}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span key={t} className="rounded-full border px-2 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md bg-primary text-primary-foreground px-3 py-2">Apply</button>
                <button className="rounded-md border px-3 py-2 hover:bg-muted">View</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="prompt-engineering" aria-labelledby="pe" className="mb-10">
        <h2 id="pe" className="text-lg font-semibold mb-3">
          Prompt Engineering
        </h2>
        <div className="rounded-lg border p-4">
          <label htmlFor="prompt" className="font-medium">
            Cover letter prompt
          </label>
          <textarea
            id="prompt"
            className="mt-2 w-full min-h-[120px] rounded-md border bg-background p-3"
            defaultValue={promptText}
          />
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-md bg-primary text-primary-foreground px-3 py-2"
              onClick={() => copy(promptText)}
            >
              Copy
            </button>
            <a className="rounded-md border px-3 py-2 hover:bg-muted" href="#ai-tools">
              Use with AI Tool
            </a>
          </div>
        </div>
      </section>

      <section id="ai-tools" aria-labelledby="tools" className="mb-10">
        <h2 id="tools" className="text-lg font-semibold mb-3">
          AI Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Resume Improver</h3>
            <p className="text-sm text-muted-foreground">Paste your resume; get concise edits and keyword boosts.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Open</button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">JD Analyzer</h3>
            <p className="text-sm text-muted-foreground">Extract top skills and tailor your summary.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Open</button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Email Polisher</h3>
            <p className="text-sm text-muted-foreground">Improve outreach emails with a friendly tone.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Open</button>
          </div>
        </div>
      </section>

      <section id="ebooks" aria-labelledby="books" className="mb-6">
        <h2 id="books" className="text-lg font-semibold mb-3">
          eBooks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <article className="rounded-lg border p-4">
            <h3 className="font-semibold">Effective Resumes</h3>
            <p className="text-sm text-muted-foreground">Craft clear, focused resumes with impact.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Download</button>
          </article>
          <article className="rounded-lg border p-4">
            <h3 className="font-semibold">Interview Mastery</h3>
            <p className="text-sm text-muted-foreground">Practice concise answers with real examples.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Download</button>
          </article>
          <article className="rounded-lg border p-4">
            <h3 className="font-semibold">Portfolio Playbook</h3>
            <p className="text-sm text-muted-foreground">Showcase work with strong narratives.</p>
            <button className="mt-2 rounded-md border px-3 py-2 hover:bg-muted">Download</button>
          </article>
        </div>
      </section>
    </div>
  )
}
