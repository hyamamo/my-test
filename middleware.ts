import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is trying to access admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }
        
        // For all other protected routes, just check if user is authenticated
        if (req.nextUrl.pathname.startsWith("/dashboard") ||
            req.nextUrl.pathname.startsWith("/announcements") ||
            req.nextUrl.pathname.startsWith("/contents") ||
            req.nextUrl.pathname.startsWith("/members") ||
            req.nextUrl.pathname.startsWith("/board")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/announcements/:path*", 
    "/contents/:path*",
    "/members/:path*",
    "/board/:path*",
    "/admin/:path*"
  ]
}