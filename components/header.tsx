"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { LoginModal } from "./login-modal"
import { SignUpModal } from "./sign-up-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

  // Check authentication status on mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const storedUsername = localStorage.getItem("username")
      setIsAuthenticated(authStatus === "true")
      setUsername(storedUsername || "")
    }

    checkAuth()

    // Listen for storage changes (for cross-tab sync)
    window.addEventListener("storage", checkAuth)

    // Custom event for same-tab updates
    window.addEventListener("authChange", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("authChange", checkAuth)
    }
  }, [])

  const handleLoginSuccess = (user: { username: string; email: string }) => {
    setIsAuthenticated(true)
    setUsername(user.username)
    setIsLoginModalOpen(false)

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("authChange"))
  }

  const handleSignUpSuccess = (user: { username: string; email: string }) => {
    setIsAuthenticated(true)
    setUsername(user.username)
    setIsSignUpModalOpen(false)

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("authChange"))
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    setIsAuthenticated(false)
    setUsername("")
    setIsMenuOpen(false)

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("authChange"))

    // Redirect to home page
    window.location.href = "/"
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  LocalServe
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/services"
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
              >
                Services
              </Link>
              <Link
                href="/provider/register"
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
              >
                Become a Provider
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
              >
                Dashboard
              </Link>
            </nav>

            {/* Desktop Auth Buttons / User Profile */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-violet-50 rounded-lg">
                    <User className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium text-violet-900">Welcome back, {username}!</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/services"
                  className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/provider/register"
                  className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Provider
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <div className="pt-4 border-t flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-violet-50 rounded-lg">
                        <User className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-medium text-violet-900">Welcome, {username}!</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 bg-transparent"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsLoginModalOpen(true)
                          setIsMenuOpen(false)
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsSignUpModalOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSuccess={handleSignUpSuccess}
      />
    </>
  )
}
