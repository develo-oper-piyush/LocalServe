"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Shield, Heart, ChevronRight } from "lucide-react"

export function RecommendedProviders() {
  const router = useRouter()
  const [recommendedProviders, setRecommendedProviders] = useState<
    Array<{
      name: string
      service: string
      rating: number
      distance: string
      photo: string
      price: string
      availability: string
      verified: boolean
      completedJobs: number
      responseTime: string
      phone?: string
      experience?: string
      specialization?: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [expandedProvider, setExpandedProvider] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://randomuser.me/api/?results=3")
        const data = await response.json()

        if (data.results) {
          const serviceTypes = ["Electrician", "House Cleaning", "Carpenter"]
          const fetchedProviders = data.results.map((user: any, index: number) => ({
            name: `${user.name.first} ${user.name.last}`,
            service: serviceTypes[index],
            rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
            distance: `${(1.0 + Math.random() * 2).toFixed(1)} km`,
            photo: user.picture.large,
            price: `₹${Math.floor(300 + Math.random() * 300)}/hr`,
            availability: ["Available Now", "Available Today", "Available Tomorrow"][Math.floor(Math.random() * 3)],
            verified: Math.random() > 0.2,
            completedJobs: Math.floor(50 + Math.random() * 150),
            responseTime: `${Math.floor(15 + Math.random() * 45)} min`,
            phone: user.phone,
            experience: `${Math.floor(3 + Math.random() * 7)} years`,
            specialization: ["Residential", "Commercial", "Industrial"][Math.floor(Math.random() * 3)],
          }))

          setRecommendedProviders(fetchedProviders)
        }
      } catch (error) {
        console.error("Error fetching providers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading recommendations...</p>
          </div>
        ) : recommendedProviders.length > 0 ? (
          <>
            {recommendedProviders.map((provider, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                  expandedProvider === index ? "ring-2 ring-blue-500 shadow-lg" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={provider.photo || "/placeholder.svg"}
                      alt={provider.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=48&width=48"
                      }}
                    />
                    {provider.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 truncate">{provider.name}</h4>
                      <button onClick={() => toggleFavorite(index)} className="transition-colors duration-200">
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.includes(index) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600">{provider.service}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {provider.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {provider.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {provider.responseTime}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{provider.price}</p>
                    <p className="text-xs text-green-600">{provider.availability}</p>
                  </div>
                </div>

                {expandedProvider === index && (
                  <div className="mt-4 pt-4 border-t animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Completed Jobs</p>
                        <p className="font-semibold">{provider.completedJobs}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Response Time</p>
                        <p className="font-semibold">{provider.responseTime}</p>
                      </div>
                      {provider.experience && (
                        <div>
                          <p className="text-gray-600">Experience</p>
                          <p className="font-semibold">{provider.experience}</p>
                        </div>
                      )}
                      {provider.specialization && (
                        <div>
                          <p className="text-gray-600">Specialization</p>
                          <p className="font-semibold">{provider.specialization}</p>
                        </div>
                      )}
                      {provider.phone && (
                        <div className="col-span-2">
                          <p className="text-gray-600">Contact</p>
                          <p className="font-semibold">{provider.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button size="sm" className="flex-1">
                        Book Now
                      </Button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedProvider(expandedProvider === index ? null : index)}
                  className="w-full flex items-center justify-center mt-3 pt-3 border-t text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {expandedProvider === index ? "Show Less" : "Show More"}
                  <ChevronRight
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      expandedProvider === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => router.push("/services")}>
              View All Recommendations
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No recommendations available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
