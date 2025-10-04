"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, Clock, MapPin, User, CreditCard, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  provider: {
    id: number
    name: string
    photo: string
    rating: number
    serviceType: string
    distance: string
    price: string
    verified: boolean
    availability: string
  }
  onConfirm: (bookingDetails: {
    date: string
    time: string
  }) => void
}

export function BookingConfirmationModal({ isOpen, onClose, provider, onConfirm }: BookingConfirmationModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<"details" | "confirm" | "success">("details")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep("confirm")
    }
  }

  const handleProceedToPayment = async () => {
    setIsProcessing(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onConfirm({
      date: selectedDate,
      time: selectedTime,
    })

    setIsProcessing(false)
    setStep("success")

    // Redirect to payment after 2 seconds
    setTimeout(() => {
      router.push(`/payment?provider=${provider.id}&date=${selectedDate}&time=${selectedTime}`)
    }, 2000)
  }

  const handleCancel = () => {
    setStep("details")
    setSelectedDate("")
    setSelectedTime("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {step === "details" && "Booking Details"}
              {step === "confirm" && "Confirm Booking"}
              {step === "success" && "Booking Confirmed!"}
            </h2>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step 1: Booking Details */}
          {step === "details" && (
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-200">
                <div className="flex items-center gap-4">
                  <img
                    src={provider.photo || "/placeholder.svg"}
                    alt={provider.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-violet-300"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.serviceType}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-violet-700">{provider.price}</span>
                      <span className="text-xs text-gray-500">• {provider.distance}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-gray-600">Service Type</p>
                      <p className="font-medium text-gray-900">{provider.serviceType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium text-gray-900">{provider.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You will be redirected to the payment gateway to complete your booking.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("details")} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Redirecting to payment gateway...</p>
              </div>

              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-300"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
