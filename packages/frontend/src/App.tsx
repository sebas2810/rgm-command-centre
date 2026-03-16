import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PlanOverviewPage } from './pages/PlanOverviewPage'
import DeviationMonitorPage from './pages/DeviationMonitorPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ScenarioEnginePage from './pages/ScenarioEnginePage'
import { RetailerPlansPage } from './pages/RetailerPlansPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/plan" replace />} />
        <Route path="/plan" element={<PlanOverviewPage />} />
        <Route path="/monitor" element={<DeviationMonitorPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/scenarios" element={<ScenarioEnginePage />} />
        <Route path="/retailer-plans" element={<RetailerPlansPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/plan" replace />} />
    </Routes>
  )
}
