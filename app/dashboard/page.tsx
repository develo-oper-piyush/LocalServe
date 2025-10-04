"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { DashboardStats } from "@/components/dashboard-stats"
import { BookingCard } from "@/components/booking-card"
import { RecommendedProviders } from "@/components/recommended-providers"
import { Footer } from "@/components/footer"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Filter, Calendar, TrendingUp, Users, MapPin, Star, Gift } from "lucide-react"
import { useBookings } from "@/contexts/booking-context"

const recentActivity = [
  {
    type: "booking",
    message: "New booking confirmed with Priya Sharma",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    type: "rating",
    message: "You rated Amit Singh 5 stars",
    time: "1 day ago",
    icon: Star,
    color: "text-yellow-600",
  },
  {
    type: "offer",
    message: "Special discount available for cleaning services",
    time: "2 days ago",
    icon: Gift,
    color: "text-purple-600",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "price" | "status">("date")
  const { bookings } = useBookings()
  const router = useRouter()

  const filteredBookings = bookings
    .filter((booking) => {
      if (activeTab === "all") return true
      return booking.status === activeTab
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "price") {
        const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
        const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
        return priceB - priceA
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status)
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-gilroy font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Welcome back, Rahul!
              </h1>
              <p className="text-gray-600">Here's what's happening with your services today.</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-white/80 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <div className="flex items-center gap-2 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sort by:</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSortBy("date")
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          sortBy === "date" ? "bg-violet-100 text-violet-700" : "hover:bg-gray-100"
                        }`}
                      >
                        Date (Newest First)
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("price")
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          sortBy === "price" ? "bg-violet-100 text-violet-700" : "hover:bg-gray-100"
                        }`}
                      >
                        Price (High to Low)
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("status")
                          setShowFilterMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          sortBy === "status" ? "bg-violet-100 text-violet-700" : "hover:bg-gray-100"
                        }`}
                      >
                        Status
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <Card className="mb-6 animate-fade-in-down backdrop-blur-xl bg-white/80 border-violet-200/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg backdrop-blur-sm">
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
              <div className="flex items-center gap-2">
                {/* Filter button section replaced with functional dropdown */}
              </div>
            </div>

            {/* Booking Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/80 backdrop-blur-sm p-1 rounded-lg">
              {[
                { key: "all", label: "All", count: bookings.length },
                {
                  key: "confirmed",
                  label: "Confirmed",
                  count: bookings.filter((b) => b.status === "confirmed").length,
                },
                {
                  key: "pending",
                  label: "Pending",
                  count: bookings.filter((b) => b.status === "pending").length,
                },
                {
                  key: "completed",
                  label: "Completed",
                  count: bookings.filter((b) => b.status === "completed").length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} router={router} />)
              ) : (
                <div className="text-center py-12 backdrop-blur-xl bg-white/70 rounded-lg border border-violet-200/50">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any {activeTab !== "all" ? activeTab : ""} bookings at the moment.
                  </p>
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Book a Service
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecommendedProviders />

            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-white/80 border-violet-200/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Service
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Providers
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Location
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Loyalty Points</h3>
                  <Gift className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-2">1,250</div>
                <p className="text-purple-100 text-sm mb-4">You're 250 points away from your next reward!</p>
                <Button variant="secondary" size="sm" className="w-full">
                  Redeem Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <AIVoiceAssistant />
    </div>
  )
}
