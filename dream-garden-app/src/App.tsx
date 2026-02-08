import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { PlantSeedPage } from "./pages/PlantSeedPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { GardenHistoryPage } from "./pages/GardenHistoryPage.tsx";
import { SeedStationPage } from "./pages/SeedStationPage.tsx";
import { SeedsGalleryPage } from "./pages/SeedsGalleryPage.tsx";
import { LessonPage } from "./pages/LessonPage.tsx";

import { ScrollToTop } from "./components/ScrollToTop.tsx";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/plant" element={<PlantSeedPage />} />
          <Route path="/dashboard/:objectId?" element={<DashboardPage />} />
          <Route path="/history" element={<GardenHistoryPage />} />
          <Route path="/seed-station" element={<SeedStationPage />} />
          <Route path="/gallery" element={<SeedsGalleryPage />} />
          <Route path="/lesson/1" element={<LessonPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
