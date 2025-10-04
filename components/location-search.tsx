"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { getLocationsBySearch, getPopularLocations, type Location } from "@/data/locations"

interface LocationSearchProps {
  placeholder?: string
  onLocationSelect?: (location: Location) => void
  className?: string
  showPopular?: boolean
  dropdownDirection?: "auto" | "up" | "down"
  maxHeight?: number
}

export function LocationSearch({
  placeholder = "Enter your location",
  onLocationSelect,
  className = "",
  showPopular = true,
  dropdownDirection: initialDropdownDirection = "auto",
  maxHeight,
}: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down")

  useEffect(() => {
    if (query.length >= 2) {
      const results = getLocationsBySearch(query)
      setSuggestions(results)
      setShowSuggestions(true)
    } else if (query.length === 0 && showPopular) {
      const popular = getPopularLocations()
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

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setQuery(location.name)
    setShowSuggestions(false)
    onLocationSelect?.(location)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Current position:", position.coords)
          setQuery("Current Location")
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
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
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-500 z-10" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-10 pr-10 text-black transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-colors duration-200 hover:bg-blue-50 z-10"
          onClick={getCurrentLocation}
          title="Use current location"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute left-0 right-0 bg-white border border-gray-200 rounded-md shadow-xl z-[60] overflow-y-auto animate-fade-in-down mt-1 ${
            dropdownDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{
            maxHeight:
              dropdownDirection === "up" ? "min(240px, calc(100vh - 100px))" : "min(240px, calc(100vh - 200px))",
          }}
        >
          {query.length === 0 && showPopular && (
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b bg-gray-50 sticky top-0 z-10">
              Popular Locations
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {suggestions.map((location, index) => (
              <button
                key={location.id}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0 transition-colors duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 transition-colors duration-200 group-hover:text-blue-500" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate transition-colors duration-200 hover:text-blue-600">
                    {location.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {location.state}
                    {location.pincode && ` • ${location.pincode}`}
                  </div>
                </div>
                {location.popular && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded transition-all duration-200 hover:bg-blue-200 flex-shrink-0">
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
