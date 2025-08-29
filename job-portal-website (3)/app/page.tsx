"use client"

import AuthGate from "@/components/auth-gate"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SeekerDashboard() {
  const { role } = useAuth()

  return (
    <AuthGate requireRole="seeker">
      <section className="space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-semibold">Find your next role with Meechto</h1>
          <p className="text-muted-foreground">Search jobs, explore AI tools, and upskill with curated eBooks.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Latest Jobs</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                <span>Frontend Engineer • Remote</span>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Apply</Button>
              </li>
              <li className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                <span>Data Analyst • Onsite</span>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Apply</Button>
              </li>
              <li className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                <span>AI Prompt Engineer • Hybrid</span>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Apply</Button>
              </li>
            </ul>
          </div>

          <div id="ai-tools" className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">AI Tools & Prompt Engineering</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Boost your productivity with curated AI tools and ready-to-use prompts.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="bg-slate-900 text-white hover:bg-slate-800">Resume Optimizer</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Interview Q&A</Button>
              <Button className="bg-cyan-500 text-white hover:bg-cyan-600">Prompt Library</Button>
            </div>
          </div>

          <div id="ebooks" className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">eBooks</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                <span>Mastering Prompt Engineering</span>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">Read</Button>
              </li>
              <li className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                <span>Job Hunt Playbook</span>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">Read</Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Are you an HR?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Switch to the HR dashboard to manage vacancies and companies.
          </p>
          <Link href="/hr">
            <Button className="mt-3 bg-slate-900 text-white hover:bg-slate-800">Go to HR Dashboard</Button>
          </Link>
        </div>
      </section>
    </AuthGate>
  )
}
