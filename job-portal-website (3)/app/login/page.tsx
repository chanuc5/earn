"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthed, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"seeker" | "hr">("seeker")

  if (isAuthed) {
    router.replace("/")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo auth: accept any credentials
    login({ name: "Meechto User", email: email || "user@meechto.com", role })
    router.replace(role === "hr" ? "/hr" : "/")
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-pretty text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Login to continue to Meechto.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border bg-white p-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("seeker")}
            className={`rounded-md border px-3 py-2 text-sm ${role === "seeker" ? "border-blue-600 text-blue-600" : ""}`}
            aria-pressed={role === "seeker"}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("hr")}
            className={`rounded-md border px-3 py-2 text-sm ${role === "hr" ? "border-blue-600 text-blue-600" : ""}`}
            aria-pressed={role === "hr"}
          >
            HR (Job Post)
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800">
          Login
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        New to Meechto?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  )
}
