"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getUserRole, isSuperAdmin } from "@/lib/roles"
import { 
  Utensils, 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  IndianRupee, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  UserCheck, 
  Sparkles,
  Check,
  X,
  PlusCircle,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DomesticHelperDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [activeTab, setActiveTab] = useState("households")

  // Authentication & Role verification
  useEffect(() => {
    async function loadHelper() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login?redirect=/dashboard/helper")
        return
      }

      const role = getUserRole(user)
      const isSuper = isSuperAdmin(user.email)

      // Guard: only maushi or super admin
      if (!isSuper && role !== "maushi") {
        if (role === "owner") {
          router.replace("/owner/dashboard")
          return
        }
        if (role === "student") {
          router.replace("/dashboard/tenant")
          return
        }
      }

      setUser(user)
      setLoading(false)
    }

    loadHelper()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Domestic Helper Workspace...</p>
        </div>
      </div>
    )
  }

  // Active households where the helper works
  const assignedHouseholds = [
    {
      id: "JOB-101",
      house: "Greenwood Residency, Flat 302",
      area: "Koramangala 4th Block, Bangalore",
      employer: "Amit Sharma (Tenant)",
      phone: "+91 98765 43210",
      shift: "Morning (07:30 AM – 09:30 AM)",
      tasks: ["North Indian Cooking", "Utensils Cleaning"],
      monthlySalary: 4500,
      status: "Active",
      paymentStatus: "Paid for April"
    },
    {
      id: "JOB-102",
      house: "Palm Meadows, Villa 14",
      area: "Indiranagar 1st Stage, Bangalore",
      employer: "Priya Patel (Owner)",
      phone: "+91 98765 43211",
      shift: "Noon (11:30 AM – 01:30 PM)",
      tasks: ["Full House Sweeping & Mopping", "Laundry"],
      monthlySalary: 6000,
      status: "Active",
      paymentStatus: "Paid for April"
    },
    {
      id: "JOB-103",
      house: "Silver Oak Heights, Apt 501",
      area: "HSR Layout Sector 3, Bangalore",
      employer: "Vikram Singh (Tenant)",
      phone: "+91 98765 43212",
      shift: "Evening (06:00 PM – 08:00 PM)",
      tasks: ["Dinner Cooking", "Kitchen Deep Clean"],
      monthlySalary: 5500,
      status: "Active",
      paymentStatus: "Due in 3 days"
    }
  ]

  // Incoming job requests from new clients
  const [jobRequests, setJobRequests] = useState([
    {
      id: "REQ-301",
      name: "Sneha Reddy",
      phone: "+91 98222 33445",
      location: "Koramangala 6th Block",
      requiredFor: "Morning Breakfast & Lunch Cooking",
      offeredSalary: "₹5,000/mo",
      time: "Morning 8:00 AM",
      date: "Requested Today"
    },
    {
      id: "REQ-302",
      name: "Arjun Verma",
      phone: "+91 97111 55667",
      location: "Indiranagar 2nd Stage",
      requiredFor: "House Cleaning & Laundry",
      offeredSalary: "₹4,500/mo",
      time: "Evening 5:00 PM",
      date: "Requested Yesterday"
    }
  ])

  const totalMonthlyEarnings = assignedHouseholds.reduce((acc, curr) => acc + curr.monthlySalary, 0)

  const handleAcceptRequest = (id: string) => {
    setJobRequests((prev) => prev.filter((r) => r.id !== id))
    alert("Job request accepted! The employer will be notified with your contact details.")
  }

  const handleDeclineRequest = (id: string) => {
    setJobRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Domestic Helper (Maushi) Dashboard
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Partner
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Namaste, {user.user_metadata?.full_name || "Domestic Helper"}!
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your daily house shifts, client requests, and monthly earnings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border">
                <span className="text-xs text-gray-600 font-medium">Availability:</span>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                    isAvailable ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isAvailable ? "Available for New Homes" : "Fully Booked"}
                </button>
              </div>

              <Link href="/maushi-services">
                <Button variant="outline" size="sm" className="text-xs gap-1.5 border-amber-200 text-amber-800">
                  <Briefcase className="w-3.5 h-3.5" /> Public Helper Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Active Households</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{assignedHouseholds.length} Homes</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Daily morning & evening shifts</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-600 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Monthly Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalMonthlyEarnings.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">₹10,500 collected this month</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">New Job Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{jobRequests.length} Pending</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">From Koramangala & Indiranagar</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Overall Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-1">
                    4.9 <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1">Based on 42 reviews</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="households" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm flex flex-wrap h-auto gap-1">
            <TabsTrigger value="households" className="rounded-lg gap-2 text-sm">
              <Home className="w-4 h-4" /> Assigned Households ({assignedHouseholds.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg gap-2 text-sm">
              <Briefcase className="w-4 h-4" /> New Inquiries ({jobRequests.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg gap-2 text-sm">
              <Utensils className="w-4 h-4" /> Skills & Services
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Assigned Households */}
          <TabsContent value="households" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assignedHouseholds.map((job) => (
                <Card key={job.id} className="shadow-sm border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {job.shift}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                        {job.paymentStatus}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-gray-900 mt-2">
                      {job.house}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.area}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                      <p className="font-semibold text-gray-900">{job.employer}</p>
                      <a href={`tel:${job.phone}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" /> {job.phone}
                      </a>
                    </div>

                    <div>
                      <p className="font-medium text-gray-500 mb-1">Assigned Tasks:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.tasks.map((task, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-100">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="text-gray-500">Monthly Wage</span>
                      <span className="text-base font-bold text-gray-900">₹{job.monthlySalary.toLocaleString()}</span>
                    </div>

                    <div className="pt-2">
                      <a href={`tel:${job.phone}`} className="w-full block">
                        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Call Client
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: New Job Inquiries */}
          <TabsContent value="requests" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Incoming Client Requests</CardTitle>
                <CardDescription className="text-xs">Households looking to hire your cooking and domestic help services</CardDescription>
              </CardHeader>
              <CardContent>
                {jobRequests.length > 0 ? (
                  <div className="space-y-4">
                    {jobRequests.map((req) => (
                      <div key={req.id} className="p-4 border rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{req.name}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{req.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {req.location} • Preferred Timing: {req.time}
                          </p>
                          <p className="text-xs text-amber-800 font-medium">
                            Service Required: {req.requiredFor}
                          </p>
                          <p className="text-xs font-semibold text-emerald-700">
                            Offered Salary: {req.offeredSalary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                            onClick={() => handleAcceptRequest(req.id)}
                          >
                            <Check className="w-3.5 h-3.5" /> Accept Job
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs text-red-600 hover:bg-red-50 border-red-200"
                            onClick={() => handleDeclineRequest(req.id)}
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">All caught up!</p>
                    <p className="text-xs text-gray-500">You don&apos;t have any pending inquiries at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Skills & Profile */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Specialized Skills & Rates</CardTitle>
                <CardDescription className="text-xs">Update your cuisines, cleaning services, and expected wages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-xl bg-white">
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Cooking Specialities</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["North Indian Curries", "South Indian Tiffins", "Dal & Rice", "Bhakri & Roti", "Gujarati Thali", "Chinese Snacks"].map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 font-medium">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border rounded-xl bg-white">
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Cleaning & Caretaking</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {["Deep Kitchen Cleaning", "Floor Sweeping & Mopping", "Utensils Dishwashing", "Laundry & Ironing", "Elderly Assistance"].map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 font-medium">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                    Update Profile & Specialties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
}
