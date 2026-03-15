// "use client"

// import Link from "next/link"
// import { useState } from "react"
// import { Home, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function Navbar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <header className="bg-white shadow-sm border-b relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">

//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <Home className="h-8 w-8 text-blue-600" />
//             <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
//           </Link>

//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-8 items-center">

//             <Link href="/search" className="text-gray-700 hover:text-blue-600">
//               Search Rooms
//             </Link>

//             {/* Dropdown for List Property */}
//             <div className="relative">
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
//               >
//                 List Property
//                 <ChevronDown className="ml-1 h-4 w-4" />
//               </button>

//               {open && (
//                 <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
//                   <Link
//                     href="/list-property"
//                     className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                     onClick={() => setOpen(false)}
//                   >
//                     Owner
//                   </Link>
//                   <Link
//                     href="/list-helper"
//                     className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                     onClick={() => setOpen(false)}
//                   >
//                     Domestic Helper
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
//               Domestic helper
//             </Link>

//             <Link href="/about" className="text-gray-700 hover:text-blue-600">
//               About
//             </Link>
//           </nav>

//           {/* Auth */}
//           <div className="flex items-center space-x-4">
//             <Link href="/login">
//               <Button variant="outline">Login</Button>
//             </Link>
//             <Link href="/signup">
//               <Button>Sign Up</Button>
//             </Link>
//           </div>

//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Home, ChevronDown, LogOut, HelpCircle, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileListOpen, setMobileListOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // ✅ Detect login session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
  }

  // Close mobile menu on navigation
  const closeMobile = () => {
    setMobileMenuOpen(false)
    setMobileListOpen(false)
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
            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search Rooms
            </Link>

            {/* Dropdown for List Property */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                List Property
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {open && (
                <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                  <Link href="/list-property" className="block px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setOpen(false)}>
                    Owner
                  </Link>
                  <Link href="/list-helper" className="block px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setOpen(false)}>
                    Domestic Helper
                  </Link>
                </div>
              )}
            </div>

            <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
              Domestic helper
            </Link>

            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </nav>

          {/* Right side — Desktop Auth + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4 relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase"
                  >
                    {user.user_metadata?.full_name?.charAt(0) || "U"}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-800">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/help" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setProfileOpen(false)}>
                          <HelpCircle className="w-4 h-4" /> Help
                        </Link>
                        <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline">Login</Button></Link>
                  <Link href="/signup"><Button>Sign Up</Button></Link>
                </>
              )}
            </div>

            {/* Mobile: Profile icon (if logged in) */}
            {user && (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="md:hidden w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase text-sm"
              >
                {user.user_metadata?.full_name?.charAt(0) || "U"}
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      {profileOpen && user && (
        <div className="md:hidden absolute right-4 top-16 w-64 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-gray-800">{user.user_metadata?.full_name || "User"}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="py-2">
            <Link href="/help" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => setProfileOpen(false)}>
              <HelpCircle className="w-4 h-4" /> Help
            </Link>
            <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-4 space-y-1">
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
                    Owner
                  </Link>
                  <Link href="/list-helper" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100" onClick={closeMobile}>
                    Domestic Helper
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
            {!user && (
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
