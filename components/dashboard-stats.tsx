"use client"

import { useState } from "react"
import { useBookings } from "@/contexts/booking-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Star, CreditCard, TrendingUp, Users, MapPin, Award } from "lucide-react"

export function DashboardStats() {
  const { bookings } = useBookings()
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  // Calculate dynamic stats
  const totalBookings = bookings.length
  const pendingServices = bookings.filter((b) => b.status === "pending").length
  const completedBookings = bookings.filter((b) => b.status === "completed")
  const averageRating =
    completedBookings.length > 0
      ? (completedBookings.reduce((acc, b) => acc + (b.rating || 0), 0) / completedBookings.length).toFixed(1)
      : "0.0"

  const totalSpent = bookings.reduce((acc, booking) => {
    const price = Number.parseInt(booking.price.replace(/[^\d]/g, ""))
    return acc + price
  }, 0)

  // Calculate trends (compare with previous period - simulated)
  const prevTotalBookings = Math.floor(totalBookings * 0.81) // 23% increase
  const prevPendingServices = Math.floor(pendingServices * 1.14) // 12% decrease
  const prevAvgRating = (Number.parseFloat(averageRating) - 0.2).toFixed(1)
  const prevTotalSpent = Math.floor(totalSpent * 0.87) // 15% increase

  const bookingChange =
    totalBookings > 0 ? `+${Math.round(((totalBookings - prevTotalBookings) / prevTotalBookings) * 100)}%` : "0%"
  const pendingChange =
    pendingServices > 0
      ? `-${Math.round(((prevPendingServices - pendingServices) / prevPendingServices) * 100)}%`
      : "0%"
  const ratingChange = `+${(Number.parseFloat(averageRating) - Number.parseFloat(prevAvgRating)).toFixed(1)}`
  const spentChange = totalSpent > 0 ? `+${Math.round(((totalSpent - prevTotalSpent) / prevTotalSpent) * 100)}%` : "0%"

  // Generate chart data from bookings (last 7 periods)
  const generateChartData = (type: string) => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const relevantBookings = bookings.filter((_, index) => {
        return index % 7 === i
      })

      if (type === "bookings") {
        data.push(relevantBookings.length + Math.floor(Math.random() * 5))
      } else if (type === "rating") {
        const avgRating =
          relevantBookings.length > 0
            ? relevantBookings.reduce((acc, b) => acc + (b.rating || 4.5), 0) / relevantBookings.length
            : 4.5
        data.push(Number(avgRating.toFixed(1)))
      } else if (type === "spent") {
        const spent = relevantBookings.reduce((acc, b) => {
          return acc + Number.parseInt(b.price.replace(/[^\d]/g, ""))
        }, 0)
        data.push(spent || 1000)
      } else {
        data.push(Math.max(1, pendingServices - i))
      }
    }
    return data
  }

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings.toString(),
      change: bookingChange,
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      chartData: generateChartData("bookings"),
    },
    {
      title: "Pending Services",
      value: pendingServices.toString(),
      change: pendingChange,
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      chartData: generateChartData("pending"),
    },
    {
      title: "Average Rating",
      value: averageRating,
      change: ratingChange,
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      chartData: generateChartData("rating"),
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      change: spentChange,
      trend: "up",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100",
      chartData: generateChartData("spent"),
    },
  ]

  const additionalStats = [
    {
      title: "Favorite Providers",
      value: Math.min(5, new Set(bookings.map((b) => b.provider)).size).toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Service Areas",
      value: Math.min(3, new Set(bookings.map((b) => b.location)).size).toString(),
      icon: MapPin,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Loyalty Points",
      value: (totalBookings * 100 + 250).toLocaleString(),
      icon: Award,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Monthly Savings",
      value: `₹${Math.floor(totalSpent * 0.15).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
  ]

  const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min

    return (
      <div className="flex items-end space-x-1 h-8 mt-2">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100
          return (
            <div
              key={index}
              className={`w-2 ${color.replace("text-", "bg-")} rounded-sm transition-all duration-300 hover:opacity-80`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
              expandedCard === index ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-xs flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change}
                </div>
              </div>
              {expandedCard === index && (
                <div className="animate-fade-in">
                  <MiniChart data={stat.chartData} color={stat.color} />
                  <p className="text-xs text-gray-500 mt-2">Last 7 periods</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalStats.map((stat, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
