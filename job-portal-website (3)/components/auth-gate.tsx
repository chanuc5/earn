"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/hooks/use-auth"

export default function AuthGate({
  children,
  requireRole,
  redirectTo = "/login",
}: {
  children: React.ReactNode
  requireRole?: UserRole | "any"
  redirectTo?: string
}) {
  const { isAuthed, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not logged in, go to login
    if (!isAuthed) {
      router.replace(redirectTo)
      return
    }
    // If a specific role is required, enforce it
    if (requireRole && requireRole !== "any" && role !== requireRole) {
      // HR visiting "/" should be sent to /hr, seekers visiting "/hr" should be sent to "/"
      router.replace(role === "hr" ? "/hr" : "/")
    }
  }, [isAuthed, role, requireRole, router, redirectTo])

  if (!isAuthed) return null
  if (requireRole && requireRole !== "any" && role !== requireRole) return null

  return <>{children}</>
}
