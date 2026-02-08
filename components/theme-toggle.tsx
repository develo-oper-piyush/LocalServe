"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggleFloating() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <Button
        variant="outline"
        size="icon"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="h-10 w-10 rounded-full border-gray-200 bg-white text-gray-800 shadow-lg transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  )
}
