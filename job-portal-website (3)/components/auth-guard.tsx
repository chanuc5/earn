"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "jp_user"

export function getStoredUser<T = { name: string; email: string } | null>(): T | null {
  try {
    if (typeof window === "undefined") return null as unknown as T
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
  } catch {
    return null as unknown as T
  }
}

export function setStoredUser(user: { name: string; email: string } | null) {
  if (typeof window === "undefined") return
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null
  return <>{children}</>
}
