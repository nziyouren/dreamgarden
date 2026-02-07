import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { PlantSeedPage } from "./pages/PlantSeedPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { GardenHistoryPage } from "./pages/GardenHistoryPage.tsx";
import { SeedStationPage } from "./pages/SeedStationPage.tsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plant" element={<PlantSeedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<GardenHistoryPage />} />
          <Route path="/seed-station" element={<SeedStationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
