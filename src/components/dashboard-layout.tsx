'use client'

import { Navigation } from './navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}