"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { isSuperAdmin, SUPER_ADMIN_EMAIL, getDashboardUrl, getUserRole } from "@/lib/roles"
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Building2, 
  Home, 
  CreditCard, 
  Utensils, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Trash2,
  Check,
  Filter,
  BarChart3,
  Lock,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Properties State
  const [properties, setProperties] = useState([
    { id: "P-101", title: "Luxury 2BHK Apartment", location: "Koramangala, Bangalore", owner: "Rajesh Kumar", price: 16500, status: "Active", verified: true, views: 342 },
    { id: "P-102", title: "Single Room PG for Students", location: "Indiranagar, Bangalore", owner: "Priya Sharma", price: 8000, status: "Active", verified: true, views: 512 },
    { id: "P-103", title: "3BHK Villa with Terrace", location: "Whitefield, Bangalore", owner: "Anand Verma", price: 32000, status: "Pending Approval", verified: false, views: 89 },
    { id: "P-104", title: "Studio Flat with Kitchen", location: "HSR Layout, Bangalore", owner: "Deepak Patel", price: 12000, status: "Active", verified: true, views: 290 },
    { id: "P-105", title: "Girls PG with Food", location: "Electronic City, Bangalore", owner: "Sunita Roy", price: 9500, status: "Under Review", verified: false, views: 64 },
  ])

  // Users State
  const [usersList, setUsersList] = useState([
    { id: "U-1", name: "Ritesh Kumar Lenka", email: "lenkariteshkumar2005@gmail.com", role: "admin", status: "Super Admin", joined: "12 Oct 2024" },
    { id: "U-2", name: "Amit Sharma", email: "amit.sharma@example.com", role: "student", status: "Active Tenant", joined: "01 Jan 2025" },
    { id: "U-3", name: "Rajesh Kumar", email: "rajesh.k@example.com", role: "owner", status: "Property Owner", joined: "15 Jan 2025" },
    { id: "U-4", name: "Sunita Devi", email: "sunita.helper@example.com", role: "maushi", status: "Verified Helper", joined: "20 Jan 2025" },
    { id: "U-5", name: "Priya Patel", email: "priya.patel@example.com", role: "student", status: "Active Tenant", joined: "05 Feb 2025" },
    { id: "U-6", name: "Vikas Singh", email: "vikas.singh@example.com", role: "owner", status: "Property Owner", joined: "14 Feb 2025" },
  ])

  // Helpers State
  const [helpersList, setHelpersList] = useState([
    { id: "H-1", name: "Sunita Tai", role: "Cook & Cleaner", rating: 4.9, location: "Koramangala", verified: true, assignedHomes: 3 },
    { id: "H-2", name: "Lakshmi Bai", role: "Chef (Multi-Cuisine)", rating: 4.8, location: "Indiranagar", verified: true, assignedHomes: 4 },
    { id: "H-3", name: "Geeta Kumari", role: "Baby Sitter & Housemaid", rating: 4.7, location: "HSR Layout", verified: false, assignedHomes: 1 },
    { id: "H-4", name: "Meena Devi", role: "Daily Cleaner", rating: 4.6, location: "Whitefield", verified: true, assignedHomes: 2 },
  ])

  // Verify Super Admin Access
  useEffect(() => {
    async function checkSuperAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.replace("/login?redirect=/dashboard/admin")
          return
        }

        setUser(user)

        // Strict hardcoded email check
        if (isSuperAdmin(user.email)) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkSuperAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-gray-300">Verifying Super Admin Authorization...</p>
        </div>
      </div>
    )
  }

  // ACCESS DENIED SCREEN for unauthorized users
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full border-red-200 shadow-xl overflow-hidden">
          <div className="h-2 bg-red-600" />
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Access Denied (403)</h2>
              <p className="text-sm text-gray-600 mt-2">
                This Super Admin control panel is restricted strictly to:
              </p>
              <code className="inline-block bg-slate-100 text-purple-700 px-3 py-1 rounded text-xs font-mono font-semibold mt-1">
                {SUPER_ADMIN_EMAIL}
              </code>
            </div>

            <div className="p-3 bg-red-50 rounded-lg text-xs text-red-800 text-left">
              <p className="font-medium">Logged-in Account:</p>
              <p className="truncate text-red-600 mt-0.5">{user?.email || "Anonymous"}</p>
              <p className="mt-1">You do not have administrative privileges to view or modify this area.</p>
            </div>

            <div className="pt-2">
              <Link href={getDashboardUrl(user)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  Go to My Respective Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Toggle Property Verification
  const togglePropertyStatus = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === "Active" ? "Pending Approval" : "Active"
        return { ...p, status: newStatus, verified: newStatus === "Active" }
      }
      return p
    }))
  }

  // Delete Property
  const deleteProperty = (id: string) => {
    if (confirm("Are you sure you want to remove this property?")) {
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  // Toggle Helper Verification
  const toggleHelperVerified = (id: string) => {
    setHelpersList(prev => prev.map(h => h.id === id ? { ...h, verified: !h.verified } : h))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      
      {/* Super Admin Top Header */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Super Admin Panel</h1>
                  <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-[10px] uppercase font-bold tracking-wider">
                    👑 Owner Control
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Logged in as <span className="text-purple-300 font-mono font-medium">{SUPER_ADMIN_EMAIL}</span>
                </p>
              </div>
            </div>

            {/* Quick Preview Switchers for Admin */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 hidden lg:inline">Inspect Views:</span>
              <Link href="/dashboard/tenant">
                <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs h-8">
                  🏠 Tenant View
                </Button>
              </Link>
              <Link href="/owner/dashboard">
                <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs h-8">
                  🏢 Owner View
                </Button>
              </Link>
              <Link href="/dashboard/helper">
                <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 text-xs h-8">
                  🧹 Helper View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/90 border-slate-700 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Registered Users</p>
                  <p className="text-2xl font-bold text-white mt-1">1,482</p>
                  <p className="text-xs text-purple-400 mt-1">780 Tenants • 412 Owners</p>
                </div>
                <div className="w-12 h-12 bg-purple-900/50 text-purple-300 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-slate-700 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Properties Listed</p>
                  <p className="text-2xl font-bold text-white mt-1">524 Rooms</p>
                  <p className="text-xs text-emerald-400 mt-1">410 Active • 84 Rented</p>
                </div>
                <div className="w-12 h-12 bg-emerald-900/50 text-emerald-300 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-slate-700 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">Domestic Helpers (Maushi)</p>
                  <p className="text-2xl font-bold text-white mt-1">290 Helpers</p>
                  <p className="text-xs text-amber-400 mt-1">240 Verified & Active</p>
                </div>
                <div className="w-12 h-12 bg-amber-900/50 text-amber-300 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/90 border-slate-700 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-400">Platform GMV (Volume)</p>
                  <p className="text-2xl font-bold text-white mt-1">₹1.42 Cr</p>
                  <p className="text-xs text-blue-400 mt-1">₹4.8L platform revenue</p>
                </div>
                <div className="w-12 h-12 bg-blue-900/50 text-blue-300 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Master Management Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 p-1 rounded-xl shadow-sm flex flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs gap-1.5 text-slate-300">
              <BarChart3 className="w-4 h-4" /> Master Overview
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs gap-1.5 text-slate-300">
              <Building2 className="w-4 h-4" /> Properties ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs gap-1.5 text-slate-300">
              <Users className="w-4 h-4" /> Users Directory ({usersList.length})
            </TabsTrigger>
            <TabsTrigger value="helpers" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs gap-1.5 text-slate-300">
              <Utensils className="w-4 h-4" /> Helpers (Maushi) ({helpersList.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-white">Platform Health & Quick Controls</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Direct Super Admin operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Database Status</p>
                      <p className="text-slate-400">Supabase PostgreSQL connected & operational</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white">100% Online</Badge>
                  </div>

                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Google OAuth Authentication</p>
                      <p className="text-slate-400">OAuth redirect & session verification active</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white">Active</Badge>
                  </div>

                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Super Admin Authority</p>
                      <p className="text-slate-400">Hardcoded email whitelist: {SUPER_ADMIN_EMAIL}</p>
                    </div>
                    <Badge className="bg-purple-600 text-white">Protected</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 text-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-white">Recent System Activity</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Live platform events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {[
                    { text: "New property listed: '2BHK Apartment Koramangala' by Rajesh Kumar", time: "10 mins ago", type: "property" },
                    { text: "Payment of ₹16,500 processed for Room #PROP-8821 via UPI", time: "25 mins ago", type: "payment" },
                    { text: "New Google OAuth sign up: 'sneha.reddy@gmail.com' (Role: Student)", time: "1 hour ago", type: "user" },
                    { text: "Domestic helper 'Lakshmi Bai' completed profile verification", time: "3 hours ago", type: "helper" },
                  ].map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-lg border border-slate-700/60">
                      <span className="text-slate-300 font-medium">{act.text}</span>
                      <span className="text-slate-500 text-[10px] shrink-0 ml-2">{act.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          </TabsContent>

          {/* TAB 2: Properties Master Table */}
          <TabsContent value="properties" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 text-slate-200">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base text-white">All Listed Properties</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Moderate and approve properties listed by room owners</CardDescription>
                </div>
                <Link href="/list-property">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                    + Add Super Admin Property
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3">Property Title</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Rent</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-750">
                          <td className="p-3 font-semibold text-white">
                            {prop.title}
                            <p className="text-[10px] text-slate-500 font-mono">{prop.id} • {prop.views} views</p>
                          </td>
                          <td className="p-3 text-slate-300">{prop.owner}</td>
                          <td className="p-3 text-slate-400">{prop.location}</td>
                          <td className="p-3 font-bold text-emerald-400">₹{prop.price.toLocaleString()}/mo</td>
                          <td className="p-3">
                            <Badge className={prop.status === "Active" ? "bg-emerald-900 text-emerald-300" : "bg-amber-900 text-amber-300"}>
                              {prop.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs border-slate-600 text-slate-200 hover:bg-slate-700"
                              onClick={() => togglePropertyStatus(prop.id)}
                            >
                              {prop.status === "Active" ? "Suspend" : "Approve"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-950"
                              onClick={() => deleteProperty(prop.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Users Directory */}
          <TabsContent value="users" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 text-slate-200">
              <CardHeader>
                <CardTitle className="text-base text-white">Platform Users & Roles Directory</CardTitle>
                <CardDescription className="text-xs text-slate-400">View registered users and manage their assigned permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Joined</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-750">
                          <td className="p-3 font-semibold text-white">{u.name}</td>
                          <td className="p-3 font-mono text-slate-300">{u.email}</td>
                          <td className="p-3">
                            <Badge className={
                              u.role === "admin" ? "bg-purple-900 text-purple-300" :
                              u.role === "owner" ? "bg-emerald-900 text-emerald-300" :
                              u.role === "maushi" ? "bg-amber-900 text-amber-300" :
                              "bg-blue-900 text-blue-300"
                            }>
                              {u.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-400">{u.joined}</td>
                          <td className="p-3 text-right">
                            {u.role !== "admin" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                                onClick={() => alert(`Role management dialog for ${u.name}`)}
                              >
                                Edit Role
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Domestic Helpers Management */}
          <TabsContent value="helpers" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 text-slate-200">
              <CardHeader>
                <CardTitle className="text-base text-white">Domestic Helpers (Maushi Services) Moderation</CardTitle>
                <CardDescription className="text-xs text-slate-400">Review helper background checks, assigned homes, and verification badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3">Helper Name</th>
                        <th className="p-3">Skill / Speciality</th>
                        <th className="p-3">Area</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Assigned Homes</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {helpersList.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-750">
                          <td className="p-3 font-semibold text-white">{h.name}</td>
                          <td className="p-3 text-slate-300">{h.role}</td>
                          <td className="p-3 text-slate-400">{h.location}</td>
                          <td className="p-3 font-bold text-amber-400">⭐ {h.rating}</td>
                          <td className="p-3 text-slate-300">{h.assignedHomes} Households</td>
                          <td className="p-3">
                            <Badge className={h.verified ? "bg-emerald-900 text-emerald-300" : "bg-slate-700 text-slate-400"}>
                              {h.verified ? "Verified" : "Unverified"}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs border-slate-600 text-slate-200 hover:bg-slate-700"
                              onClick={() => toggleHelperVerified(h.id)}
                            >
                              {h.verified ? "Revoke Badge" : "Grant Verified Badge"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
}
