"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LocationSearch } from "@/components/location-search"
import type { Location } from "@/data/locations"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export interface FilterOptions {
  location: Location | null
  serviceTypes: string[]
  minRating: number | null
  priceRange: [number, number]
  availability: string[]
}

interface ServiceFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void
  activeFiltersCount?: number
}

export function ServiceFilters({ onApplyFilters, activeFiltersCount = 0 }: ServiceFiltersProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleServiceTypeChange = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServiceTypes((prev) => [...prev, service])
    } else {
      setSelectedServiceTypes((prev) => prev.filter((s) => s !== service))
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRating(rating)
    } else if (selectedRating === rating) {
      setSelectedRating(null)
    }
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailability((prev) => [...prev, availability])
    } else {
      setSelectedAvailability((prev) => prev.filter((a) => a !== availability))
    }
  }

  const handleApplyFilters = () => {
    const filters: FilterOptions = {
      location: selectedLocation,
      serviceTypes: selectedServiceTypes,
      minRating: selectedRating,
      priceRange: priceRange,
      availability: selectedAvailability,
    }
    onApplyFilters(filters)
  }

  const handleClearFilters = () => {
    setSelectedLocation(null)
    setSelectedServiceTypes([])
    setSelectedRating(null)
    setPriceRange([0, 1000])
    setSelectedAvailability([])

    // Apply empty filters
    onApplyFilters({
      location: null,
      serviceTypes: [],
      minRating: null,
      priceRange: [0, 1000],
      availability: [],
    })
  }

  const hasActiveFilters =
    selectedLocation !== null ||
    selectedServiceTypes.length > 0 ||
    selectedRating !== null ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 1000 ||
    selectedAvailability.length > 0

  return (
    <Card className="sticky top-24 backdrop-blur-xl bg-white/80 border-violet-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-violet-100 text-violet-700">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="relative">
          <Label className="text-sm font-medium mb-2 block">Location</Label>
          <div className="relative z-10">
            <LocationSearch
              placeholder="Search location..."
              onLocationSelect={handleLocationSelect}
              showPopular={false}
              dropdownDirection="auto"
              maxHeight={180}
            />
          </div>
          {selectedLocation && (
            <div className="mt-2 p-2 bg-violet-50 rounded-md border border-violet-200 relative z-10 flex items-center justify-between">
              <div className="text-xs text-violet-700">
                <span className="font-medium">{selectedLocation.name}</span>
                <span className="text-violet-500">, {selectedLocation.state}</span>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-violet-600 hover:text-violet-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Service Type */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Service Type</Label>
          <div className="space-y-2">
            {["Carpenter", "Electrician", "Plumbing", "House Cleaning", "Maid Services"].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={selectedServiceTypes.includes(service)}
                  onCheckedChange={(checked) => handleServiceTypeChange(service, checked as boolean)}
                  className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label htmlFor={service} className="text-sm cursor-pointer hover:text-violet-600 transition-colors">
                  {service}
                </Label>
              </div>
            ))}
          </div>
          {selectedServiceTypes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedServiceTypes.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="bg-violet-100 text-violet-700 text-xs flex items-center gap-1"
                >
                  {service}
                  <button
                    onClick={() => handleServiceTypeChange(service, false)}
                    className="hover:text-violet-900 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating === rating}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                  className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm cursor-pointer hover:text-violet-600 transition-colors"
                >
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
          {selectedRating && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-xs">
                {selectedRating}+ Stars
              </Badge>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Price Range (₹/hour)</Label>
          <div className="mt-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={1000}
              step={50}
              className="w-full cursor-pointer hover:cursor-pointer active:cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-violet-700 font-medium">₹{priceRange[0]}</span>
              <span className="text-violet-700 font-medium">₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Availability</Label>
          <div className="space-y-2">
            {["Available Today", "Available Tomorrow", "Available This Week"].map((availability) => (
              <div key={availability} className="flex items-center space-x-2">
                <Checkbox
                  id={availability}
                  checked={selectedAvailability.includes(availability)}
                  onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                  className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label
                  htmlFor={availability}
                  className="text-sm cursor-pointer hover:text-violet-600 transition-colors"
                >
                  {availability}
                </Label>
              </div>
            ))}
          </div>
          {selectedAvailability.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedAvailability.map((availability) => (
                <Badge
                  key={availability}
                  variant="secondary"
                  className="bg-violet-100 text-violet-700 text-xs flex items-center gap-1"
                >
                  {availability}
                  <button
                    onClick={() => handleAvailabilityChange(availability, false)}
                    className="hover:text-violet-900 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-violet-100">
          <Button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all hover:transition-all duration-300 ease-in-out"
          >
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full border-violet-300 text-violet-700 hover:bg-violet-50 transition-all duration-300 bg-transparent"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
