"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Shield, MessageCircle } from "lucide-react"
import { BookingConfirmationModal } from "@/components/booking-confirmation-modal"
import { ChatModal } from "@/components/chat-modal"
import { useBookings } from "@/contexts/booking-context"

interface Provider {
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

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const { addBooking } = useBookings()

  const handleBookingConfirm = (bookingDetails: { date: string; time: string }) => {
    addBooking({
      service: provider.serviceType,
      provider: provider.name,
      providerPhoto: provider.photo,
      date: `${bookingDetails.date}, ${bookingDetails.time}`,
      time: bookingDetails.time,
      status: "pending",
      price: provider.price,
      rating: provider.rating,
      location: provider.distance,
      serviceType: provider.serviceType,
      distance: provider.distance,
    })
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:scale-103 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={provider.photo || "/placeholder.svg"}
                  alt={provider.name}
                  className="w-20 h-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 border-2 border-violet-200 group-hover:border-violet-400"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=80&width=80"
                  }}
                  loading="lazy"
                />
                {provider.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 transition-transform duration-300 group-hover:scale-110">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 transition-colors duration-200 group-hover:text-blue-600">
                    {provider.name}
                    {provider.verified && <Shield className="w-4 h-4 text-green-500 animate-pulse" />}
                  </h3>
                  <p className="text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                    {provider.serviceType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{provider.rating}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                    {provider.price}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <MapPin className="w-3 h-3" />
                  {provider.distance}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 transition-all duration-200 hover:scale-105"
                >
                  <Clock className="w-3 h-3" />
                  {provider.availability}
                </Badge>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="flex p-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all ease-in-out duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChatModal(true)}
                  className="transition-all ease-in-out duration-200 hover:scale-105 active:scale-95 hover:shadow-md bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BookingConfirmationModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        provider={provider}
        onConfirm={handleBookingConfirm}
      />

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        providerName={provider.name}
        providerPhoto={provider.photo}
      />
    </>
  )
}
