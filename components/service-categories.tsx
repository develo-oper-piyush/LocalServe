"use client"

import { useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Hammer,
  Wrench,
  Zap,
  Home,
  Truck,
  Sparkles,
  Users,
  Settings,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"

const services = [
  { name: "Carpenter", icon: Hammer, color: "bg-orange-100 text-orange-600", hoverColor: "hover:bg-orange-200" },
  {
    name: "Tile & Flooring Work",
    icon: Square,
    color: "bg-purple-100 text-purple-600",
    hoverColor: "hover:bg-purple-200",
  },
  {
    name: "Submersible Pump Repair",
    icon: Settings,
    color: "bg-blue-100 text-blue-600",
    hoverColor: "hover:bg-blue-200",
  },
  { name: "Maid Services", icon: Users, color: "bg-pink-100 text-pink-600", hoverColor: "hover:bg-pink-200" },
  { name: "Plumbing", icon: Wrench, color: "bg-green-100 text-green-600", hoverColor: "hover:bg-green-200" },
  { name: "Electrician", icon: Zap, color: "bg-yellow-100 text-yellow-600", hoverColor: "hover:bg-yellow-200" },
  { name: "House Shifting", icon: Truck, color: "bg-red-100 text-red-600", hoverColor: "hover:bg-red-200" },
  { name: "Home Cleaning", icon: Sparkles, color: "bg-teal-100 text-teal-600", hoverColor: "hover:bg-teal-200" },
  {
    name: "Glass & Aluminium Work",
    icon: Home,
    color: "bg-indigo-100 text-indigo-600",
    hoverColor: "hover:bg-indigo-200",
  },
]

export function ServiceCategories() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      skipSnaps: false,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Popular Services
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
            Choose from our wide range of professional services
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md border-violet-200 hover:bg-violet-100 hover:border-violet-300 shadow-lg hidden md:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-5 h-5 text-violet-600" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md border-violet-200 hover:bg-violet-100 hover:border-violet-300 shadow-lg hidden md:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="w-5 h-5 text-violet-600" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)] xl:flex-[0_0_calc(20%-19.2px)]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href="/services" className="block h-full">
                    <Card className="h-full backdrop-blur-xl bg-white/70 border-violet-200/50 hover:bg-white/90 hover:shadow-2xl hover:shadow-violet-300/50 transition-all duration-500 cursor-pointer group transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up relative overflow-hidden">
                      {/* Glassmorphism Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Animated Border Glow */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400/0 via-purple-400/50 to-violet-400/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>

                      <CardContent className="p-6 text-center relative z-10">
                        <div
                          className={`w-16 h-16 rounded-full ${service.color} ${service.hoverColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-125 transition-all duration-500 group-hover:rotate-5 shadow-lg group-hover:shadow-md backdrop-blur-sm`}
                        >
                          <service.icon className="w-8 h-8 transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm transition-colors duration-300 group-hover:text-violet-600 group-hover:scale-105">
                          {service.name}
                        </h3>

                        {/* Floating particles on hover */}
                        <div className="absolute top-2 right-2 w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-1"></div>
                        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-2"></div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {services.slice(0, 5).map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-violet-300 hover:bg-violet-500 transition-colors duration-300"
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>

        {/* View All Services Button */}
        <div className="text-center mt-8">
          <Link href="/services">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-violet-400/50 transition-all duration-300 transform hover:scale-105">
              View All Services
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
