"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Booking {
  id: string
  service: string
  provider: string
  providerPhoto: string
  date: string
  time: string
  status: "confirmed" | "pending" | "completed"
  price: string
  rating?: number
  location: string
  serviceType: string
  distance: string
}

interface BookingContextType {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, "id">) => void
  removeBooking: (id: string) => void
  updateBookingStatus: (id: string, status: "confirmed" | "pending" | "completed") => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem("localserve-bookings")
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("localserve-bookings", JSON.stringify(bookings))
  }, [bookings])

  const addBooking = (booking: Omit<Booking, "id">) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
    }
    setBookings((prev) => [newBooking, ...prev])
  }

  const removeBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id))
  }

  const updateBookingStatus = (id: string, status: "confirmed" | "pending" | "completed") => {
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)))
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking, removeBooking, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider")
  }
  return context
}
