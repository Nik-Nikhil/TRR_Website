// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Tournament from "./pages/Tournament";
import Teams from "./pages/Team";
import TeamDetail from "./pages/TeamDeatail";
import SchedulePage from "./pages/Schedule";

import Season1Standings from "./pages/Seasons/Season1Standing";
import Season2Standings from "./pages/Seasons/Season2Standing";
import Season3Standings from "./pages/Seasons/Season3Standing";
import Season4Standings from "./pages/Seasons/Season4Standing";
import Season5Standings from "./pages/Seasons/Season5Standing";
import Season6Standings from "./pages/Seasons/Season6Standing";

import AllPlayersPage from "./pages/Players/AllPlayersPage";
import PlayerDetailPage from "./pages/Players/PlayerDetailPage";

// ⬇️ NEW: import RulesPage
import RulesPage from "./pages/Rules";

function App() {
  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/schedule" element={<SchedulePage />} />

          {/* ⬇️ NEW: Rules route */}
          <Route path="/rules" element={<RulesPage />} />

          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />

          <Route path="/seasons/1" element={<Season1Standings />} />
          <Route path="/seasons/2" element={<Season2Standings />} />
          <Route path="/seasons/3" element={<Season3Standings />} />
          <Route path="/seasons/4" element={<Season4Standings />} />
          <Route path="/seasons/5" element={<Season5Standings />} />
          <Route path="/seasons/6" element={<Season6Standings />} />

          {/* Players list + individual player profile */}
          <Route path="/players" element={<AllPlayersPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
