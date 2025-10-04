"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Mail, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (userData: { username: string; email: string }) => void
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [currentStep, setCurrentStep] = useState<
    "method" | "email-login" | "forgot-password" | "reset-sent" | "success"
  >("method")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would integrate with Google OAuth
      console.log("Google login initiated")
      setCurrentStep("success")
    } catch (err) {
      setError("Failed to login with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!username.trim() && !email.trim()) {
      setError("Please enter a username or email address")
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate login validation
      if (email === "demo@localserve.com" && password === "password123") {
        console.log("Login successful:", { email, rememberMe })
        // Use a default username or extract from email
        const extractedUsername = username || email.split("@")[0]
        if (onSuccess) {
          onSuccess({ username: extractedUsername, email })
        }
        setCurrentStep("success")
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Simulate password reset email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Password reset email sent to:", email)
      setCurrentStep("reset-sent")
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setCurrentStep("method")
    setEmail("")
    setPassword("")
    setUsername("")
    setError("")
    setIsLoading(false)
    setRememberMe(false)
    setShowPassword(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {(currentStep === "email-login" || currentStep === "forgot-password") && (
                <button
                  onClick={() => setCurrentStep("method")}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStep === "method" && "Welcome Back"}
                {currentStep === "email-login" && "Sign In"}
                {currentStep === "forgot-password" && "Reset Password"}
                {currentStep === "reset-sent" && "Check Your Email"}
                {currentStep === "success" && "Welcome!"}
              </h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Choose Login Method */}
          {currentStep === "method" && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">Sign in to your LocalServe account</p>

              {/* Google Login */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 8.55 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Login */}
              <Button
                onClick={() => setCurrentStep("email-login")}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 font-medium mb-1">Demo Credentials:</p>
                <p className="text-xs text-blue-700">Username: demo / Email: demo@localserve.com</p>
                <p className="text-xs text-blue-700">Password: password123</p>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Don't have an account?{" "}
                <button onClick={handleClose} className="text-blue-600 hover:underline">
                  Sign up here
                </button>
              </p>
            </div>
          )}

          {/* Step 2: Email Login Form */}
          {currentStep === "email-login" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address (optional if username provided)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep("forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* Step 3: Forgot Password */}
          {currentStep === "forgot-password" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Step 4: Reset Email Sent */}
          {currentStep === "reset-sent" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-2">We've sent a password reset link to</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Didn't receive the email?</strong> Check your spam folder or{" "}
                  <button onClick={() => setCurrentStep("forgot-password")} className="text-blue-600 hover:underline">
                    try again
                  </button>
                </p>
              </div>

              <Button onClick={() => setCurrentStep("method")} variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === "success" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back!</h3>
                <p className="text-gray-600">You have successfully signed in to your LocalServe account.</p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Dashboard
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                  Browse Services
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
