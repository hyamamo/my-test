import { Navigation } from '@/components/navigation'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navigation />
      
      <div className="lg:pl-72">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}