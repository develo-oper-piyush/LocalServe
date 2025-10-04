"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useBookings } from "@/contexts/booking-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MessageCircle, Star, MapPin, User, CreditCard, X } from "lucide-react"
import { ChatModal } from "@/components/chat-modal"

import type { Booking } from "@/contexts/booking-context"

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter()
  const { removeBooking, updateBookingStatus } = useBookings()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [paymentStep, setPaymentStep] = useState(1)
  const [showChatModal, setShowChatModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    removeBooking(booking.id)
  }

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Service Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={booking.providerPhoto || "/placeholder.svg?height=50&width=50"}
                alt={booking.provider}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                <p className="text-sm text-gray-600">with {booking.provider}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">{booking.price}</span>
            </div>
          </div>

          {paymentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>

              {/* Payment Methods */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedPaymentMethod("card")}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedPaymentMethod === "card"
                      ? "border-blue-500 bg-blue-50"
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
                  onClick={() => setSelectedPaymentMethod("upi")}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedPaymentMethod === "upi"
                      ? "border-blue-500 bg-blue-50"
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
                  onClick={() => setSelectedPaymentMethod("wallet")}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedPaymentMethod === "wallet"
                      ? "border-blue-500 bg-blue-50"
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

                <button
                  onClick={() => setSelectedPaymentMethod("later")}
                  className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                    selectedPaymentMethod === "later"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Pay Later</p>
                      <p className="text-sm text-gray-500">Complete payment after service</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setPaymentStep(2)}
                  disabled={!selectedPaymentMethod}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {paymentStep === 2 && selectedPaymentMethod === "card" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Card Details</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setPaymentStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    setShowPaymentModal(false)
                    setIsProcessing(true)

                    // Simulate payment processing
                    await new Promise((resolve) => setTimeout(resolve, 2000))

                    // Update booking status to confirmed
                    updateBookingStatus(booking.id, "confirmed")
                    setIsProcessing(false)

                    // Show success message or redirect
                    window.location.reload()
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Pay {booking.price}
                </button>
              </div>
            </div>
          )}

          {paymentStep === 2 && selectedPaymentMethod === "later" && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Scheduled</h3>
                <p className="text-gray-600 mb-4">
                  You can complete the payment after the service is completed. We'll send you a payment reminder.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Payment must be completed within 24 hours of service completion.
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setShowPaymentModal(false)
                  updateBookingStatus(booking.id, "confirmed")
                  window.location.reload()
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={booking.providerPhoto || "/placeholder.svg?height=50&width=50"}
                alt={booking.provider}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {booking.provider}
                </p>
                {booking.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{booking.rating}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                title="Delete booking"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {booking.date}
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              {booking.price}
            </div>
            {booking.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {booking.location}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => setShowChatModal(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button size="sm" className="flex-1" onClick={() => setShowPaymentModal(true)}>
              Book & Pay
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPaymentModal && <PaymentModal />}
      {showChatModal && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          providerName={booking.provider}
          providerPhoto={booking.providerPhoto || "/placeholder.svg"}
        />
      )}
    </>
  )
}
