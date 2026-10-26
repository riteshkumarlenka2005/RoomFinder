"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { getUserRole, isSuperAdmin } from "@/lib/roles"
import { 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  CreditCard, 
  Download, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Search, 
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Wrench,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TenantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasHelper, setHasHelper] = useState(true)
  const [activeTab, setActiveTab] = useState("property")
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false)
  const [maintenanceIssue, setMaintenanceIssue] = useState("")

  // Check authentication & role
  useEffect(() => {
    async function loadTenant() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login?redirect=/dashboard/tenant")
        return
      }

      const role = getUserRole(user)
      const isSuper = isSuperAdmin(user.email)

      // If user is owner or helper and not super admin, inform or redirect
      if (!isSuper && role !== "student") {
        if (role === "owner") {
          router.replace("/owner/dashboard")
          return
        }
        if (role === "maushi") {
          router.replace("/dashboard/helper")
          return
        }
      }

      setUser(user)
      setLoading(false)
    }

    loadTenant()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your Tenant Dashboard...</p>
        </div>
      </div>
    )
  }

  // Sample data for active rented room
  const rentedProperty = {
    id: "PROP-8821",
    title: "Greenwood Residency - 2BHK Semi-Furnished",
    address: "Flat 302, 4th Cross, Koramangala 4th Block, Bangalore",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    roomType: "2BHK Apartment",
    monthlyRent: 16500,
    securityDeposit: 33000,
    totalPaidTillNow: 66000,
    moveInDate: "01 Jan 2025",
    leaseEndDate: "30 Nov 2025",
    totalDurationMonths: 11,
    monthsCompleted: 4,
    nextDueDate: "05 May 2025",
    paymentStatus: "Paid for April 2025",
    owner: {
      name: "Rajesh Kumar Lenka",
      phone: "+91 98765 43210",
      email: "owner.rajesh@roomfinder.com",
    },
    amenities: ["High-speed WiFi", "24/7 Water & Geyser", "RO Purifier", "Power Backup", "Two-Wheeler Parking", "CCTV Security"]
  }

  // Payment history records
  const paymentHistory = [
    { id: "TXN-9021", month: "April 2025", amount: 16500, date: "02 Apr 2025", mode: "UPI (Google Pay)", status: "Success" },
    { id: "TXN-8432", month: "March 2025", amount: 16500, date: "03 Mar 2025", mode: "UPI (PhonePe)", status: "Success" },
    { id: "TXN-7910", month: "February 2025", amount: 16500, date: "02 Feb 2025", mode: "Net Banking (HDFC)", status: "Success" },
    { id: "TXN-7001", month: "January 2025 + Deposit", amount: 49500, date: "01 Jan 2025", mode: "UPI (Paytm)", status: "Success" },
  ]

  // Domestic Helper details
  const helperData = {
    name: "Sunita Tai",
    role: "Cook & Daily Cleaner",
    rating: 4.9,
    reviewsCount: 38,
    phone: "+91 94380 12345",
    monthlyWage: 4200,
    timings: "Morning 7:30 AM – 9:30 AM",
    status: "Active & Assigned",
    cuisine: "North Indian, South Indian, Breakfast",
    joinedDate: "10 Jan 2025"
  }

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!maintenanceIssue.trim()) return
    setMaintenanceSubmitted(true)
    setMaintenanceIssue("")
    setTimeout(() => setMaintenanceSubmitted(false), 4000)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Tenant Dashboard
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Lease
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user.user_metadata?.full_name || "Tenant"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage your rented room, rent payments, duration, and domestic helper services.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/search">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Search className="w-3.5 h-3.5" /> Explore Rooms
                </Button>
              </Link>
              <Link href="/maushi-services">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs text-amber-700 border-amber-200 hover:bg-amber-50">
                  <Utensils className="w-3.5 h-3.5 text-amber-600" /> Helper Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Rented Room */}
          <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Current Rented Room</p>
                  <p className="text-lg font-bold text-gray-900 mt-1 truncate max-w-[180px]">
                    {rentedProperty.roomType}
                  </p>
                  <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> Koramangala
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Payment Details */}
          <Card className="border-l-4 border-l-emerald-600 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Monthly Rent</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ₹{rentedProperty.monthlyRent.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
                  </p>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> {rentedProperty.paymentStatus}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Rental Duration */}
          <Card className="border-l-4 border-l-indigo-600 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Lease Duration</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {rentedProperty.totalDurationMonths} Months
                  </p>
                  <p className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> 7 Months Remaining
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Domestic Helper Status */}
          <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Domestic Helper</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {hasHelper ? "Assigned (Sunita Tai)" : "Not Hired Yet"}
                  </p>
                  <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${hasHelper ? "text-amber-700" : "text-gray-500"}`}>
                    <Utensils className="w-3 h-3" /> {hasHelper ? "Cook & Cleaning" : "Click to hire"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="property" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-xl shadow-sm flex flex-wrap h-auto gap-1">
            <TabsTrigger value="property" className="rounded-lg gap-2 text-sm">
              <Home className="w-4 h-4" /> Rented Property
            </TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg gap-2 text-sm">
              <CreditCard className="w-4 h-4" /> Payments & Rent
            </TabsTrigger>
            <TabsTrigger value="helper" className="rounded-lg gap-2 text-sm">
              <Utensils className="w-4 h-4" /> Domestic Helper
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="rounded-lg gap-2 text-sm">
              <Wrench className="w-4 h-4" /> Maintenance
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Rented Property Details */}
          <TabsContent value="property" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Property Overview & Gallery */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm overflow-hidden">
                  <div className="relative h-64 sm:h-72 w-full bg-slate-200">
                    <img 
                      src={rentedProperty.image} 
                      alt={rentedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-600 text-white font-medium">Currently Rented</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg text-white">
                      <p className="font-semibold text-base sm:text-lg">{rentedProperty.title}</p>
                      <p className="text-xs text-gray-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {rentedProperty.address}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 text-base">Lease Agreement & Timeline</h3>
                    <div className="bg-slate-50 border rounded-xl p-4 mb-6">
                      <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
                        <span>Move-in: {rentedProperty.moveInDate}</span>
                        <span>Month 4 of 11</span>
                        <span>Lease End: {rentedProperty.leaseEndDate}</span>
                      </div>
                      <Progress value={36} className="h-2.5 bg-slate-200" />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        7 Months remaining until contract renewal (30 Nov 2025).
                      </p>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 text-base">Included Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                      {rentedProperty.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-gray-800 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Download className="w-4 h-4 text-blue-600" /> Download Rent Agreement (PDF)
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => setActiveTab("maintenance")}>
                        <Wrench className="w-4 h-4 text-amber-600" /> Report Issue to Owner
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Col: Property Owner Contact & Quick Info */}
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Property Owner Details</CardTitle>
                    <CardDescription className="text-xs">Direct contact for room queries & repairs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {rentedProperty.owner.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{rentedProperty.owner.name}</p>
                        <p className="text-xs text-gray-500">Verified Landlord</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{rentedProperty.owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium truncate">{rentedProperty.owner.email}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a href={`tel:${rentedProperty.owner.phone}`} className="w-full block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-2">
                          <Phone className="w-3.5 h-3.5" /> Call Landlord
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Payment Status Box */}
                <Card className="shadow-sm border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">Rent Overview</p>
                    <p className="text-2xl font-bold text-gray-900">₹{rentedProperty.monthlyRent.toLocaleString()}<span className="text-xs font-normal text-gray-600">/month</span></p>
                    <p className="text-xs text-gray-600 mt-1">Security Deposit: ₹{rentedProperty.securityDeposit.toLocaleString()} (Paid)</p>
                    <div className="mt-4 pt-3 border-t border-blue-200 flex justify-between items-center">
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Up to date
                      </span>
                      <Button size="sm" variant="default" className="text-xs h-8 bg-blue-600" onClick={() => setActiveTab("payments")}>
                        View Invoices
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* TAB 2: Payments & Invoices */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Payment Summary */}
              <Card className="shadow-sm md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Payment Summary</CardTitle>
                  <CardDescription className="text-xs">Summary of your rent expenditures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Monthly Rent</span>
                    <span className="font-semibold text-gray-900">₹{rentedProperty.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Security Deposit Paid</span>
                    <span className="font-semibold text-gray-900">₹{rentedProperty.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-500">Total Paid Till Date</span>
                    <span className="font-bold text-emerald-600">₹{rentedProperty.totalPaidTillNow.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500">Next Rent Due Date</span>
                    <span className="font-semibold text-blue-600">{rentedProperty.nextDueDate}</span>
                  </div>

                  <div className="pt-2">
                    <Link href="/payment">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-10">
                        <CreditCard className="w-4 h-4 mr-2" /> Pay Next Month Rent Online
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card className="shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Rent Payment Receipts</CardTitle>
                  <CardDescription className="text-xs">All past transactions with downloadable receipts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-gray-600 border-b">
                        <tr>
                          <th className="p-3">Reference / Period</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paymentHistory.map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-medium text-gray-900">
                              {txn.month}
                              <p className="text-[10px] text-gray-400 font-mono">{txn.id}</p>
                            </td>
                            <td className="p-3 text-gray-600">{txn.date}</td>
                            <td className="p-3 font-bold text-gray-900">₹{txn.amount.toLocaleString()}</td>
                            <td className="p-3 text-gray-600">{txn.mode}</td>
                            <td className="p-3">
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-[10px]">
                                {txn.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => alert(`Downloading Receipt for ${txn.month} (${txn.id})...`)}
                              >
                                <Download className="w-3.5 h-3.5 mr-1" /> PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* TAB 3: Domestic Helper (Maushi Services) */}
          <TabsContent value="helper" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    Domestic Helper (Maushi Services)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Your assigned domestic helper, cook, or home caretaker status
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={() => setHasHelper(!hasHelper)}
                  >
                    {hasHelper ? "Simulate: No Helper Hired" : "Simulate: Helper Hired"}
                  </Button>
                  <Link href="/maushi-services">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5" /> Find More Helpers
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                {hasHelper ? (
                  <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/80 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-200/60">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                          {helperData.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{helperData.name}</h3>
                            <Badge className="bg-amber-600 text-white text-[10px]">Verified Helper</Badge>
                          </div>
                          <p className="text-sm font-medium text-amber-800 mt-0.5">{helperData.role}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span>⭐ {helperData.rating} ({helperData.reviewsCount} reviews)</span>
                            <span>•</span>
                            <span>Assigned since {helperData.joinedDate}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500">Monthly Helper Wage</p>
                        <p className="text-2xl font-bold text-gray-900">₹{helperData.monthlyWage.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span></p>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] mt-1">
                          Payment Active
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-sm">
                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <p className="text-xs text-gray-500 font-medium">Daily Service Timing</p>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-1.5 text-xs">
                          <Clock className="w-4 h-4 text-amber-600" /> {helperData.timings}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <p className="text-xs text-gray-500 font-medium">Specialized Cuisines / Tasks</p>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-1.5 text-xs">
                          <Utensils className="w-4 h-4 text-amber-600" /> {helperData.cuisine}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-100">
                        <p className="text-xs text-gray-500 font-medium">Contact Helper</p>
                        <a href={`tel:${helperData.phone}`} className="font-semibold text-blue-600 mt-1 flex items-center gap-1.5 text-xs hover:underline">
                          <Phone className="w-4 h-4 text-emerald-600" /> {helperData.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-amber-200/60">
                      <a href={`tel:${helperData.phone}`}>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Call Sunita Tai
                        </Button>
                      </a>
                      <Link href="/maushi-services">
                        <Button size="sm" variant="outline" className="text-xs border-amber-300 text-amber-800 hover:bg-amber-100">
                          Change Helper / Hire Additional
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Domestic Helper Hired Yet</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                      Looking for wholesome home-cooked meals, daily room cleaning, or laundry assistance? Browse our verified domestic helpers (Maushi Services).
                    </p>
                    <Link href="/maushi-services">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm h-11 px-6 shadow-md">
                        <Sparkles className="w-4 h-4 mr-2" /> Browse & Hire Domestic Helper
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Maintenance Request */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" /> Raise Maintenance Request
                </CardTitle>
                <CardDescription className="text-xs">
                  Directly notify your landlord ({rentedProperty.owner.name}) for plumbing, electrical, or appliance repairs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {maintenanceSubmitted && (
                  <div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your maintenance request has been submitted to the landlord! They will contact you shortly.</span>
                  </div>
                )}

                <form onSubmit={handleMaintenanceSubmit} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Issue Category</label>
                    <select className="w-full text-xs border rounded-lg p-2.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Plumbing & Water leakage</option>
                      <option>Electricity & Power Backup</option>
                      <option>WiFi & Internet Router</option>
                      <option>Geyser & Kitchen Appliances</option>
                      <option>Other / Structural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Describe the Issue</label>
                    <textarea 
                      rows={4}
                      value={maintenanceIssue}
                      onChange={(e) => setMaintenanceIssue(e.target.value)}
                      placeholder="e.g. Bathroom geyser is not turning on since yesterday evening..."
                      className="w-full text-xs border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Send Request to Landlord
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
}
