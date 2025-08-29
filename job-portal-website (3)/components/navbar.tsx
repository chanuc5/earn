"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import BrandLogo from "./brand-logo"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

const palette = {
  primary: "#2563eb",
  accent: "#06b6d4",
  white: "#ffffff",
  slate: "#0f172a",
  gray: "#f3f4f6",
}

export default function Navbar() {
  const { isAuthed, role, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const linkBase = "rounded-md px-3 py-2 text-sm font-medium hover:opacity-90 transition-colors"

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={cn(linkBase, active ? "bg-gray-100 text-slate-900" : "text-slate-900")}
        style={active ? { backgroundColor: palette.gray, color: palette.slate } : {}}
      >
        {children}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <BrandLogo />
          <nav className="hidden items-center gap-1 md:flex">
            {!isAuthed && (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink>
              </>
            )}
            {isAuthed && role === "seeker" && (
              <>
                <NavLink href="/">Jobs</NavLink>
                <NavLink href="/#ai-tools">AI Tools</NavLink>
                <NavLink href="/#ebooks">eBooks</NavLink>
              </>
            )}
            {isAuthed && role === "hr" && (
              <>
                <NavLink href="/hr">HR Dashboard</NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <Button
              onClick={() => {
                logout()
                router.replace("/login")
              }}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Logout
            </Button>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button className="bg-slate-900 text-white hover:bg-slate-800">Login</Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-(--color-primary) text-(--color-primary-foreground)"
                  style={{ backgroundColor: palette.primary }}
                >
                  Register
                </Button>
              </Link>
            </div>
          )}

          <button
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
            onClick={() => setOpen(!open)}
          >
            <span className="h-0.5 w-6 bg-slate-900" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {!isAuthed && (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink>
              </>
            )}
            {isAuthed && role === "seeker" && (
              <>
                <NavLink href="/">Jobs</NavLink>
                <NavLink href="/#ai-tools">AI Tools</NavLink>
                <NavLink href="/#ebooks">eBooks</NavLink>
              </>
            )}
            {isAuthed && role === "hr" && (
              <>
                <NavLink href="/hr">HR Dashboard</NavLink>
              </>
            )}
            <div className="pt-2">
              {isAuthed ? (
                <Button
                  onClick={() => {
                    logout()
                    setOpen(false)
                    router.replace("/login")
                  }}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="w-1/2">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">Login</Button>
                  </Link>
                  <Link href="/register" className="w-1/2">
                    <Button className="w-full text-white" style={{ backgroundColor: palette.primary }}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
