import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { PlantSeedPage } from "./pages/PlantSeedPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plant" element={<PlantSeedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
