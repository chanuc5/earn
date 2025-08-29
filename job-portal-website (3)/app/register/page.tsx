"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthed, login } = useAuth()
  const [role, setRole] = useState<"seeker" | "hr">("seeker")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (isAuthed) {
    // If user is already logged in, go to their dashboard
    router.replace("/")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    login({ name: name || "User", email: email || "user@example.com", role })
    router.replace(role === "hr" ? "/hr" : "/")
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-pretty text-2xl font-semibold">Create your Meechto account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Choose your role and join Meechto.</p>

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
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
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
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </section>
  )
}
