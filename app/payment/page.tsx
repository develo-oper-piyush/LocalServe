"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react"
import { useBookings } from "@/contexts/booking-context"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateBookingStatus } = useBookings()

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wallet" | "">("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const providerId = searchParams.get("provider")
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  const handlePayment = async () => {
    if (!paymentMethod) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setPaymentSuccess(true)
    setIsProcessing(false)

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-xl bg-white/90 border-violet-200/50 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">Your booking has been confirmed. Redirecting to dashboard...</p>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-300"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-600">Secure payment powered by LocalServe</p>
          </div>

          <Card className="backdrop-blur-xl bg-white/90 border-violet-200/50 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Secure Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking Details */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
                <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Date:</strong> {date}
                  </p>
                  <p>
                    <strong>Time:</strong> {time}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹500
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      paymentMethod === "card"
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      paymentMethod === "upi"
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-orange-500 rounded"></div>
                      <div>
                        <p className="font-medium">UPI Payment</p>
                        <p className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      paymentMethod === "wallet"
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded"></div>
                      <div>
                        <p className="font-medium">Digital Wallet</p>
                        <p className="text-sm text-gray-500">PayPal, Amazon Pay</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === "card" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="John Doe" className="mt-1" />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handlePayment}
                disabled={!paymentMethod || isProcessing}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Pay ₹500"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
