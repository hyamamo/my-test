import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page
        if (req.nextUrl.pathname === '/login') {
          return true
        }
        
        // Require authentication for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except public ones
    '/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)',
  ]
}