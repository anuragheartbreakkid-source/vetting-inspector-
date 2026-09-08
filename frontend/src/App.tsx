import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionPage } from './pages/InspectionPage';
import { PreviousObservationsPage } from './pages/PreviousObservationsPage';
import { FleetObservationsPage } from './pages/FleetObservationsPage';
import { CrewPage } from './pages/CrewPage';
import { IndividualAssessmentPage } from './pages/IndividualAssessmentPage';
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inspection" element={<InspectionPage />} />
          <Route path="/previous-observations" element={<PreviousObservationsPage />} />
          <Route path="/fleet-observations" element={<FleetObservationsPage />} />
          <Route path="/crew" element={<CrewPage />} />
          <Route path="/individual-assessment" element={<IndividualAssessmentPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
