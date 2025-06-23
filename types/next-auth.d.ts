import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    avatar?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      avatar?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    avatar?: string
  }
}