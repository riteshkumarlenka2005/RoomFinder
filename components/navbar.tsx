"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { 
  Home, 
  ChevronDown, 
  LogOut, 
  HelpCircle, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  ShieldCheck, 
  Building, 
  Sparkles,
  Utensils
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { getUserRole, getDashboardUrl, getRoleDisplayName, isSuperAdmin } from "@/lib/roles"

// Global in-memory cache to prevent flashing on page transitions
let cachedUser: any = undefined

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileListOpen, setMobileListOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Initialize from cache if already loaded
  const [user, setUser] = useState<any>(cachedUser || null)
  const [loading, setLoading] = useState<boolean>(cachedUser === undefined)

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      try {
        // 1. Fast synchronous check from local storage
        const { data: sessionData } = await supabase.auth.getSession()
        const sessionUser = sessionData?.session?.user || null

        if (isMounted) {
          cachedUser = sessionUser
          setUser(sessionUser)
          setLoading(false)
        }

        // 2. Profile completion check (ignore for super admin)
        if (sessionUser && !isSuperAdmin(sessionUser.email) && !sessionUser.user_metadata?.role) {
          if (typeof window !== "undefined" && window.location.pathname !== "/complete-profile") {
            const urlParams = new URLSearchParams(window.location.search)
            const source = urlParams.get("source")

            if (source === "login") {
              await supabase.auth.signOut()
              cachedUser = null
              window.location.href = "/signup?error=AccountNotFound"
            } else {
              window.location.href = "/complete-profile"
            }
          }
        }
      } catch (err) {
        console.error("Auth session sync error:", err)
        if (isMounted) setLoading(false)
      }
    }

    syncSession()

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user || null
      cachedUser = activeUser
      setUser(activeUser)
      setLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // Logout handler
  const handleLogout = async () => {
    cachedUser = null
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
  }

  // Close mobile menu on navigation
  const closeMobile = () => {
    setMobileMenuOpen(false)
    setMobileListOpen(false)
  }

  const userRole = getUserRole(user)
  const dashboardUrl = getDashboardUrl(user)
  const roleName = getRoleDisplayName(userRole)
  const isSuper = isSuperAdmin(user?.email)

  // Role Badge Styling helper
  const getBadgeStyle = () => {
    if (isSuper) return "bg-purple-50 text-purple-700 border-purple-200"
    if (userRole === "owner") return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (userRole === "maushi") return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-blue-50 text-blue-700 border-blue-200"
  }

  return (
    <header className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Home className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">RoomFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Search Rooms
            </Link>

            {/* Dropdown for List Property */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium focus:outline-none transition-colors"
              >
                List Property
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {open && (
                <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  <Link href="/list-property" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm" onClick={() => setOpen(false)}>
                    Owner (List Room)
                  </Link>
                  <Link href="/list-helper" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm" onClick={() => setOpen(false)}>
                    Domestic Helper (Maushi)
                  </Link>
                </div>
              )}
            </div>

            <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Domestic Helper
            </Link>

            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
          </nav>

          {/* Right side — Desktop Auth + Mobile Profile/Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3 relative">
              {loading ? (
                /* Subtle placeholder while checking cache on cold start (prevents FOUC) */
                <div className="w-28 h-9" />
              ) : user ? (
                /* Profile Avatar & Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold uppercase ring-2 ring-blue-100 hover:ring-blue-300 transition-all shadow-sm"
                    title={user.email}
                  >
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100">
                        {/* User Header */}
                        <div className="px-4 py-3 bg-slate-50/70">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mb-2">{user.email}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
                            {roleName}
                          </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2">
                          <Link 
                            href={dashboardUrl} 
                            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-blue-700 font-medium text-sm transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" />
                            <span>My Dashboard</span>
                          </Link>

                          {/* Extra link for Super Admin panel */}
                          {isSuper && (
                            <Link 
                              href="/dashboard/admin" 
                              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-purple-50 text-purple-700 font-medium text-sm transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <ShieldCheck className="w-4 h-4 text-purple-600" />
                              <span>Super Admin Panel</span>
                            </Link>
                          )}

                          <Link 
                            href="/about" 
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <HelpCircle className="w-4 h-4 text-gray-500" />
                            <span>Help & FAQs</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="py-1 bg-gray-50/50">
                          <button 
                            onClick={handleLogout} 
                            className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-medium transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" className="h-9">Login</Button></Link>
                  <Link href="/signup"><Button className="h-9">Sign Up</Button></Link>
                </>
              )}
            </div>

            {loading ? (
              <div className="md:hidden w-8 h-8" />
            ) : user ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="md:hidden w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase text-xs"
              >
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
              </button>
            ) : null}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      {profileOpen && user && (
        <div className="md:hidden absolute right-4 top-16 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
          <div className="px-4 py-3 bg-slate-50">
            <p className="font-semibold text-gray-900 truncate">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate mb-1">{user.email}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
              {roleName}
            </span>
          </div>

          <div className="py-2">
            <Link 
              href={dashboardUrl} 
              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-blue-700 font-medium text-sm" 
              onClick={() => setProfileOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Go to My Dashboard</span>
            </Link>

            {isSuper && (
              <Link 
                href="/dashboard/admin" 
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-purple-50 text-purple-700 font-medium text-sm"
                onClick={() => setProfileOpen(false)}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Super Admin Panel</span>
              </Link>
            )}

            <Link 
              href="/about" 
              className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm" 
              onClick={() => setProfileOpen(false)}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & FAQs</span>
            </Link>
          </div>

          <div className="py-1 bg-gray-50">
            <button 
              onClick={handleLogout} 
              className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-4 space-y-1">
            {user && (
              <Link 
                href={dashboardUrl} 
                className="flex items-center justify-between px-3 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold mb-2" 
                onClick={closeMobile}
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  My Dashboard ({roleName})
                </span>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Open</span>
              </Link>
            )}

            <Link href="/search" className="block px-3 py-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium" onClick={closeMobile}>
              Search Rooms
            </Link>

            {/* List Property Dropdown */}
            <div>
              <button
                onClick={() => setMobileListOpen(!mobileListOpen)}
                className="flex items-center justify-between w-full px-3 py-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                List Property
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileListOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileListOpen && (
                <div className="pl-6 space-y-1">
                  <Link href="/list-property" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100" onClick={closeMobile}>
                    Owner (List Room)
                  </Link>
                  <Link href="/list-helper" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100" onClick={closeMobile}>
                    Domestic Helper (Maushi)
                  </Link>
                </div>
              )}
            </div>

            <Link href="/maushi-services" className="block px-3 py-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium" onClick={closeMobile}>
              Domestic Helper
            </Link>

            <Link href="/about" className="block px-3 py-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium" onClick={closeMobile}>
              About
            </Link>

            {/* Mobile Auth Buttons (if not logged in) */}
            {!loading && !user && (
              <div className="pt-4 border-t mt-4 flex gap-3">
                <Link href="/login" className="flex-1" onClick={closeMobile}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="flex-1" onClick={closeMobile}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
