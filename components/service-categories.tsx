import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Hammer, Wrench, Zap, Home, Truck, Sparkles, Users, Settings, Square } from "lucide-react"

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
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Popular Services</h2>
          <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
            Choose from our wide range of professional services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Link key={service.name} href="/services">
              <Card
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${service.color} ${service.hoverColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6`}
                  >
                    <service.icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm transition-colors duration-200 group-hover:text-blue-600">
                    {service.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
