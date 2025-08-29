"use client"

import { useEffect, useMemo, useState } from "react"

export type UserRole = "seeker" | "hr"
export type MeechtoUser = {
  name: string
  email: string
  role: UserRole
}

const KEY = "meechto:user"

export function getStoredUser(): MeechtoUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as MeechtoUser) : null
  } catch {
    return null
  }
}

export function useAuth() {
  const [user, setUser] = useState<MeechtoUser | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const isAuthed = !!user
  const role = user?.role ?? null

  function login(u: MeechtoUser) {
    localStorage.setItem(KEY, JSON.stringify(u))
    setUser(u)
  }

  function logout() {
    localStorage.removeItem(KEY)
    setUser(null)
  }

  return useMemo(() => ({ user, isAuthed, role, login, logout }), [user, isAuthed, role])
}
