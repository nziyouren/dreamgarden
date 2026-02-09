import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { LandingPage } from "./pages/LandingPage.tsx";
import { PlantSeedPage } from "./pages/PlantSeedPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { GardenHistoryPage } from "./pages/GardenHistoryPage.tsx";
import { MagicDropPage } from "./pages/MagicDropPage.tsx";
import { SeedsGalleryPage } from "./pages/SeedsGalleryPage.tsx";
import { LessonPage } from "./pages/LessonPage.tsx";
import { HelpPage } from "./pages/HelpPage.tsx";

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
          <Route path="/magic-drops" element={<MagicDropPage />} />
          <Route path="/gallery" element={<SeedsGalleryPage />} />
          <Route path="/lesson/1" element={<LessonPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
