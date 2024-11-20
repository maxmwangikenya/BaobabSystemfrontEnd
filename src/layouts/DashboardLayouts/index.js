import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}