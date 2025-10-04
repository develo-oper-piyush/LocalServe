"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ServiceFilters, type FilterOptions } from "@/components/service-filters"
import { ProviderCard } from "@/components/provider-card"
import { Footer } from "@/components/footer"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"
import { Loader2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface RandomUser {
  name: {
    first: string
    last: string
  }
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
}

const serviceTypes = [
  "Carpenter",
  "House Cleaning",
  "Electrician",
  "Maid Services",
  "Plumbing",
  "Tile & Flooring",
  "Glass & Aluminium Work",
  "House Shifting",
]

const availabilityOptions = ["Available Today", "Available Tomorrow", "Available This Week"]

export default function ServicesPage() {
  const [allProviders, setAllProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    location: null,
    serviceTypes: [],
    minRating: null,
    priceRange: [0, 1000],
    availability: [],
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://randomuser.me/api/?results=20")
        const data = await response.json()

        if (data.results) {
          const fetchedProviders: Provider[] = data.results.map((user: RandomUser, index: number) => ({
            id: index + 1,
            name: `${user.name.first} ${user.name.last}`,
            photo: user.picture.large,
            rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
            serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
            distance: `${(0.5 + Math.random() * 3).toFixed(1)} km`,
            price: `₹${Math.floor(250 + Math.random() * 450)}/hour`,
            verified: Math.random() > 0.3,
            availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
          }))

          setAllProviders(fetchedProviders)
          setFilteredProviders(fetchedProviders)
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching providers:", err)
        setError("Failed to load service providers. Please try again later.")

        const fallbackProviders = [
          {
            id: 1,
            name: "Rajesh Kumar",
            photo: "/placeholder.svg?height=80&width=80",
            rating: 4.8,
            serviceType: "Carpenter",
            distance: "1.2 km",
            price: "₹500/hour",
            verified: true,
            availability: "Available Today",
          },
          {
            id: 2,
            name: "Priya Sharma",
            photo: "/placeholder.svg?height=80&width=80",
            rating: 4.9,
            serviceType: "House Cleaning",
            distance: "0.8 km",
            price: "₹300/hour",
            verified: true,
            availability: "Available Tomorrow",
          },
          {
            id: 3,
            name: "Mohammed Ali",
            photo: "/placeholder.svg?height=80&width=80",
            rating: 4.7,
            serviceType: "Electrician",
            distance: "2.1 km",
            price: "₹400/hour",
            verified: true,
            availability: "Available Today",
          },
          {
            id: 4,
            name: "Sunita Devi",
            photo: "/placeholder.svg?height=80&width=80",
            rating: 4.6,
            serviceType: "Maid Services",
            distance: "1.5 km",
            price: "₹250/hour",
            verified: false,
            availability: "Available Today",
          },
        ]
        setAllProviders(fallbackProviders)
        setFilteredProviders(fallbackProviders)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters)

    let filtered = [...allProviders]

    // Filter by service type
    if (filters.serviceTypes.length > 0) {
      filtered = filtered.filter((provider) => filters.serviceTypes.includes(provider.serviceType))
    }

    // Filter by rating
    if (filters.minRating !== null) {
      filtered = filtered.filter((provider) => provider.rating >= filters.minRating!)
    }

    // Filter by price range
    const [minPrice, maxPrice] = filters.priceRange
    filtered = filtered.filter((provider) => {
      const price = Number.parseInt(provider.price.replace(/[^\d]/g, ""))
      return price >= minPrice && price <= maxPrice
    })

    // Filter by availability
    if (filters.availability.length > 0) {
      filtered = filtered.filter((provider) => filters.availability.includes(provider.availability))
    }

    // Location filter (you can implement more sophisticated location filtering)
    // For now, we'll just check if location is selected and apply a simple filter
    if (filters.location) {
      // In a real app, you'd filter by actual location proximity
      // For demo purposes, we'll just show all providers when location is selected
      console.log("Filtering by location:", filters.location.name)
    }

    setFilteredProviders(filtered)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (activeFilters.location) count++
    if (activeFilters.serviceTypes.length > 0) count++
    if (activeFilters.minRating !== null) count++
    if (activeFilters.priceRange[0] !== 0 || activeFilters.priceRange[1] !== 1000) count++
    if (activeFilters.availability.length > 0) count++
    return count
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Service Providers
              </h1>
              <p className="text-gray-600">
                Find trusted professionals near you
                {filteredProviders.length !== allProviders.length && (
                  <span className="ml-2 text-violet-600 font-medium">
                    ({filteredProviders.length} of {allProviders.length} providers)
                  </span>
                )}
              </p>
            </div>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 flex items-center gap-2">
                <Filter className="w-3 h-3" />
                {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? "s" : ""} active
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <ServiceFilters onApplyFilters={handleApplyFilters} activeFiltersCount={getActiveFiltersCount()} />
          </aside>

          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
                <p className="text-gray-600 text-lg">Loading service providers...</p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce animation-delay-300"></div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}

            {!loading && filteredProviders.length === 0 && (
              <div className="text-center py-20 backdrop-blur-xl bg-white/70 rounded-lg border border-violet-200/50">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                  Showing 0 of {allProviders.length} providers
                </Badge>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <AIVoiceAssistant />
    </div>
  )
}
