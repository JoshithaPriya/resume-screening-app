"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const handleNavToSection = (sectionId: string) => {
    if (pathname !== "/") {
      window.location.href = "/"
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        element?.scrollIntoView({ behavior: "smooth" })
      }, 500)
    } else {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">AI Resume Ranker</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <button
              onClick={() => handleNavToSection("how-it-works")}
              className="text-foreground hover:text-primary transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => handleNavToSection("project-details")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Project Details
            </button>
          </div>

          {/* Get Started Button */}
          <Link
            href="/analyse"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
