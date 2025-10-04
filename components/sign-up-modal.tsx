"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"

interface SignUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: { username: string; email: string }) => void
}

type SignUpStep = "method" | "email-form" | "otp-verification" | "success"

export function SignUpModal({ open, onOpenChange, onSuccess }: SignUpModalProps) {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("method")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("") // Added username state
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpTimer, setOtpTimer] = useState(60)
  const [canResendOtp, setCanResendOtp] = useState(false)

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would integrate with Google OAuth
      console.log("Google sign-up initiated")
      setCurrentStep("success")
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!username.trim()) {
      setError("Username is required")
      setIsLoading(false)
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      setIsLoading(false)
      return
    }

    if (!fullName.trim()) {
      setError("Full name is required")
      setIsLoading(false)
      return
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("OTP sent to:", email)
      setCurrentStep("otp-verification")
      startOtpTimer()
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code")
      setIsLoading(false)
      return
    }

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("OTP verified:", otp)
      // Call onSuccess with user data
      onSuccess({ username, email })
      setCurrentStep("success")
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const startOtpTimer = () => {
    setOtpTimer(60)
    setCanResendOtp(false)

    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setCanResendOtp(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("OTP resent to:", email)
      startOtpTimer()
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setCurrentStep("method")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFullName("")
    setUsername("") // Included username in resetModal
    setOtp("")
    setError("")
    setIsLoading(false)
    setCanResendOtp(false)
    setOtpTimer(60)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      onSuccess({
        username,
        email,
      })
      setUsername("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setIsLoading(false)
    }, 1000)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {currentStep === "method" && "Create Account"}
            {currentStep === "email-form" && "Sign Up with Email"}
            {currentStep === "otp-verification" && "Verify Your Email"}
            {currentStep === "success" && "Welcome to LocalServe!"}
          </DialogTitle>
          {currentStep === "method" && <DialogDescription>Create an account to get started</DialogDescription>}
        </DialogHeader>
        {/* Step 1: Choose Sign-up Method */}
        {currentStep === "method" && (
          <div className="space-y-4">
            <p className="text-gray-600 text-center mb-6">Choose how you'd like to create your account</p>

            {/* Google Sign-up */}
            <Button
              onClick={handleGoogleSignUp}
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
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
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

            {/* Email Sign-up */}
            <Button
              onClick={() => setCurrentStep("email-form")}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Continue with Email
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        )}

        {/* Step 2: Email Registration Form */}
        {currentStep === "email-form" && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentStep("method")} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {currentStep === "otp-verification" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-2">We've sent a 6-digit verification code to</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="mt-1 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <div className="text-center">
                {!canResendOtp ? (
                  <p className="text-sm text-gray-500">Resend code in {otpTimer} seconds</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("email-form")} className="flex-1">
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === "success" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Created Successfully!</h3>
              <p className="text-gray-600">
                Welcome to LocalServe! You can now start booking services from trusted professionals.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700">
                Start Exploring Services
              </Button>
              <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                Complete Your Profile
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
