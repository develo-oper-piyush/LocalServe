"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Wrench, Zap, Hammer, Sparkles, Users, Truck, Home, Settings, Square } from "lucide-react"

interface Service {
  id: string
  name: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  popular?: boolean
  description?: string
}

interface ServiceSearchProps {
  placeholder?: string
  onServiceSelect?: (service: string) => void
  className?: string
  showPopular?: boolean
  dropdownDirection?: "auto" | "up" | "down"
  maxHeight?: number
}

const availableServices: Service[] = [
  // Popular Services
  {
    id: "house-cleaning",
    name: "House Cleaning",
    category: "Cleaning",
    icon: Sparkles,
    popular: true,
    description: "Professional home cleaning services",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    category: "Home Repair",
    icon: Wrench,
    popular: true,
    description: "Pipe repairs, installations, and maintenance",
  },
  {
    id: "electrician",
    name: "Electrician",
    category: "Home Repair",
    icon: Zap,
    popular: true,
    description: "Electrical repairs and installations",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    category: "Home Repair",
    icon: Hammer,
    popular: true,
    description: "Furniture repair and custom woodwork",
  },
  {
    id: "maid-services",
    name: "Maid Services",
    category: "Cleaning",
    icon: Users,
    popular: true,
    description: "Regular household help and maintenance",
  },

  // Additional Services
  {
    id: "tile-flooring",
    name: "Tile & Flooring Work",
    category: "Home Improvement",
    icon: Square,
    description: "Floor installation and tile work",
  },
  {
    id: "house-shifting",
    name: "House Shifting",
    category: "Moving",
    icon: Truck,
    description: "Professional moving and packing services",
  },
  {
    id: "glass-aluminium",
    name: "Glass & Aluminium Work",
    category: "Home Improvement",
    icon: Home,
    description: "Window and door installations",
  },
  {
    id: "pump-repair",
    name: "Submersible Pump Repair",
    category: "Home Repair",
    icon: Settings,
    description: "Water pump maintenance and repair",
  },
  {
    id: "ac-repair",
    name: "AC Repair & Service",
    category: "Appliance Repair",
    icon: Settings,
    description: "Air conditioning maintenance and repair",
  },
  {
    id: "painting",
    name: "Painting Services",
    category: "Home Improvement",
    icon: Home,
    description: "Interior and exterior painting",
  },
  {
    id: "pest-control",
    name: "Pest Control",
    category: "Home Maintenance",
    icon: Home,
    description: "Professional pest management services",
  },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    category: "Appliance Repair",
    icon: Settings,
    description: "Repair for washing machines, refrigerators, etc.",
  },
  {
    id: "gardening",
    name: "Gardening Services",
    category: "Outdoor",
    icon: Home,
    description: "Lawn care and garden maintenance",
  },
  {
    id: "security-systems",
    name: "Security System Installation",
    category: "Home Security",
    icon: Settings,
    description: "CCTV and security system setup",
  },
]

export function ServiceSearch({
  placeholder = "What service do you need?",
  onServiceSelect,
  className = "",
  showPopular = true,
  dropdownDirection: initialDropdownDirection = "auto",
  maxHeight,
}: ServiceSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Service[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down")

  const getServicesBySearch = (searchQuery: string): Service[] => {
    if (!searchQuery || searchQuery.length < 1) return []

    const searchTerm = searchQuery.toLowerCase()
    return availableServices
      .filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm) ||
          service.category.toLowerCase().includes(searchTerm) ||
          (service.description && service.description.toLowerCase().includes(searchTerm)),
      )
      .slice(0, 10) // Limit to 10 results
  }

  const getPopularServices = (): Service[] => {
    return availableServices.filter((service) => service.popular)
  }

  useEffect(() => {
    if (query.length >= 1) {
      const results = getServicesBySearch(query)
      setSuggestions(results)
      setShowSuggestions(true)
    } else if (query.length === 0 && showPopular) {
      const popular = getPopularServices()
      setSuggestions(popular)
      // Don't automatically show suggestions on page load
      // Only show when user focuses the input (handled by handleInputFocus)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query, showPopular])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setQuery(service.name)
    setShowSuggestions(false)
    onServiceSelect?.(service.name)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setSelectedService(null)
  }

  useEffect(() => {
    if (inputRef.current && showSuggestions) {
      const rect = inputRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      // If there's not enough space below and more space above, show dropdown upward
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownDirection("up")
      } else {
        setDropdownDirection("down")
      }
    }
  }, [showSuggestions, suggestions])

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-500 z-10" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 text-gray-900 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl z-[60] overflow-hidden animate-fade-in-down ${
            dropdownDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{
            maxHeight:
              dropdownDirection === "up" ? "min(280px, calc(100vh - 100px))" : "min(280px, calc(100vh - 200px))",
          }}
        >
          {query.length === 0 && showPopular && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b bg-gray-50 sticky top-0 z-10">
              Popular Services
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((service, index) => (
              <button
                key={service.id}
                className="w-full px-3 py-3 text-left hover:bg-blue-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors duration-200 animate-fade-in-up group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-blue-100 group-hover:scale-110">
                  <service.icon className="w-5 h-5 text-gray-600 transition-colors duration-200 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate transition-colors duration-200 group-hover:text-blue-600">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {service.category}
                    {service.description && ` • ${service.description}`}
                  </div>
                </div>
                {service.popular && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded transition-all duration-200 group-hover:bg-blue-200 flex-shrink-0">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div className="border-t bg-gray-50 p-2">
            <div className="text-xs text-gray-500 text-center">
              Can't find what you're looking for?{" "}
              <button className="text-blue-600 hover:text-blue-700 hover:underline">Browse all services</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
