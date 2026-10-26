"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getUserRole, isSuperAdmin } from "@/lib/roles"
import { OwnerSidebar } from "@/components/owner/owner-sidebar"
import { DashboardOverview } from "@/components/owner/dashboard-overview"
import MyProperties from "@/components/owner/my-properties"
import { BookingsManagement } from "@/components/owner/bookings-management"
import { DomesticHelpers } from "@/components/owner/domestic-helpers"
import { MessagesInbox } from "@/components/owner/messages-inbox"
import { OwnerProfile } from "@/components/owner/owner-profile"
import { Analytics } from "@/components/owner/analytics"
import { Menu, Plus, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export default function OwnerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [ownerUser, setOwnerUser] = useState<any>(null)

  // Guard: Only Property Owners and Super Admin can access
  useEffect(() => {
    async function checkOwnerAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace("/login?redirect=/owner/dashboard")
          return
        }

        const role = getUserRole(user)
        const isSuper = isSuperAdmin(user.email)

        // If not owner and not super admin, route to their respective dashboard
        if (!isSuper && role !== "owner") {
          if (role === "student") {
            router.replace("/dashboard/tenant")
            return
          }
          if (role === "maushi") {
            router.replace("/dashboard/helper")
            return
          }
        }

        setOwnerUser(user)
      } catch (err) {
        console.error("Owner auth verification failed:", err)
        router.replace("/login")
      } finally {
        setCheckingAuth(false)
      }
    }

    checkOwnerAuth()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying Property Owner Workspace...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />
      case "properties":
        return <MyProperties />
      case "bookings":
        return <BookingsManagement />
      case "helpers":
        return <DomesticHelpers />
      case "messages":
        return <MessagesInbox />
      case "profile":
        return <OwnerProfile />
      case "analytics":
        return <Analytics />
      default:
        return <DashboardOverview />
    }
  }

  const ownerDisplayName = ownerUser?.user_metadata?.full_name || ownerUser?.email?.split("@")[0] || "Owner"

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <OwnerSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab)
              setSidebarOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "properties" && "My Listed Properties"}
                  {activeTab === "bookings" && "Bookings Management"}
                  {activeTab === "helpers" && "Domestic Helpers (Maushi)"}
                  {activeTab === "messages" && "Messages Inbox"}
                  {activeTab === "profile" && "Owner Profile"}
                  {activeTab === "analytics" && "Analytics & Performance"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Welcome back, <span className="font-semibold text-gray-800">{ownerDisplayName}</span>
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex text-xs gap-1.5 text-gray-600">
                  <Home className="w-3.5 h-3.5" /> Main Website
                </Button>
              </Link>

              <Link href="/list-property">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm">
                  <Plus className="w-4 h-4" /> Add Room / Property
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
