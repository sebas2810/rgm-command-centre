import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

export function AppShell() {
  const location = useLocation()
  const isWelcome = location.pathname === '/'
  const isWorkflow = location.pathname.startsWith('/workflow')

  // Welcome page has no shell
  if (isWelcome) return <Outlet />

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {!isWorkflow && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
