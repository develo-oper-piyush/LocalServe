"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { LoginModal } from "./login-modal"
import { SignUpModal } from "./sign-up-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    const storedUsername = localStorage.getItem("username") || ""
    setIsAuthenticated(authStatus)
    setUsername(storedUsername)
  }, [])

  const handleLoginSuccess = (user: { username: string; email: string }) => {
    setIsAuthenticated(true)
    setUsername(user.username)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("username", user.username)
    localStorage.setItem("email", user.email)
    setIsLoginOpen(false)
  }

  const handleSignUpSuccess = (user: { username: string; email: string }) => {
    setIsAuthenticated(true)
    setUsername(user.username)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("username", user.username)
    localStorage.setItem("email", user.email)
    setIsSignUpOpen(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUsername("")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <>
      <header className="border-b bg-background text-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            LocalServe
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-foreground/70 hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/provider/register" className="text-foreground/70 hover:text-foreground transition-colors">
              Become a Provider
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Welcome back, {username}!</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>
                  Log In
                </Button>
                <Button size="sm" onClick={() => setIsSignUpOpen(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/services" className="text-foreground/70 hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/provider/register" className="text-foreground/70 hover:text-foreground transition-colors">
                Become a Provider
              </Link>
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Welcome, {username}!</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)} className="w-full">
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => setIsSignUpOpen(true)} className="w-full">
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} onSuccess={handleLoginSuccess} />
      <SignUpModal open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onSuccess={handleSignUpSuccess} />
    </>
  )
}
