"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Meechto Home">
      <span
        className="inline-flex h-8 w-8 items-center justify-center rounded-md"
        style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
      >
        M
      </span>
      <span className="text-lg font-semibold tracking-tight" style={{ color: "#0f172a" }}>
        Meechto
      </span>
    </Link>
  )
}
