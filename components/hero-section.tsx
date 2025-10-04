"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LocationSearch } from "@/components/location-search"
import type { Location } from "@/data/locations"
import { ServiceSearch } from "@/components/service-search"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [service, setService] = useState("")
  const router = useRouter()

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    console.log("Selected location:", location)
  }

  const handleSearch = () => {
    if (selectedLocation && service) {
      console.log("Searching for:", service, "in", selectedLocation.name)
      // Navigate to services page with filters
      window.location.href = `/services?location=${selectedLocation.id}&service=${encodeURIComponent(service)}`
    }
  }

  return (
    <section className="relative text-white py-20 overflow-hidden">
      {/* Dynamic Violet Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
        {/* Animated Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-fuchsia-500/20 to-purple-600/30 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600/20 via-violet-500/30 to-purple-700/20 animate-gradient-shift-reverse"></div>
        </div>

        {/* Floating 3D-like Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-radial from-violet-400/30 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-radial from-fuchsia-400/25 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-radial from-purple-400/30 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-radial from-indigo-400/20 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>

        {/* Particle Effect Simulation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-violet-300 rounded-full animate-particle-1"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-particle-2"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-purple-300 rounded-full animate-particle-3"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-particle-4"></div>
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-violet-400 rounded-full animate-particle-5"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Radial Gradient Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-violet-950/80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated heading */}
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-200 bg-clip-text text-transparent"
            style={{ fontFamily: "Agbalumo, sans-serif" }}
          >
            Find Trusted Local Services Near You
          </h1>

          {/* Animated subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-violet-100 animate-fade-in-up animation-delay-300">
            Connect with verified professionals for all your home service needs
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 shadow-2xl mb-8 animate-fade-in-up animation-delay-600 hover:shadow-violet-500/20 transition-all duration-300 relative z-10 border border-violet-400/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <LocationSearch
                  placeholder="Enter your location"
                  onLocationSelect={handleLocationSelect}
                  showPopular={true}
                  dropdownDirection="auto"
                  maxHeight={200}
                />
              </div>
              <div className="flex-1 relative">
                <ServiceSearch
                  placeholder="What service do you need?"
                  onServiceSelect={(selectedService) => setService(selectedService)}
                  showPopular={true}
                  dropdownDirection="auto"
                  maxHeight={200}
                />
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50 relative z-20 border-0"
                onClick={handleSearch}
                disabled={!selectedLocation || !service}
              >
                Search Services
              </Button>
            </div>

            {selectedLocation && (
              <div className="mt-2 text-sm text-violet-200 animate-fade-in relative z-10">
                📍 Searching in:{" "}
                <span className="font-medium text-violet-100">
                  {selectedLocation.name}, {selectedLocation.state}
                </span>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-900 mt-16 md:mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/10 backdrop-blur-sm text-white border border-violet-400/30 hover:bg-white/20 transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-400/30"
              onClick={() => router.push("/services")}
            >
              Book a Service
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-violet-300/50 text-white hover:text-white hover:bg-violet-500/20 bg-transparent backdrop-blur-sm transform transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-400/30"
              onClick={() => router.push("/provider/register")}
            >
              Register as Provider
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
