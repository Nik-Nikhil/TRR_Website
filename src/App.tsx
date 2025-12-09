import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Tournament from "./pages/Tournament";
import Teams from "./pages/Team";
import TeamDetail from "./pages/TeamDeatail";
import SchedulePage from "./pages/Schedule";

import AllPlayersPage from "./pages/Players/AllPlayersPage";
import PlayerDetailPage from "./pages/Players/PlayerDetailPage";

import RulesPage from "./pages/Rules";
import SeasonShowCase from "./pages/SeasonShowCase";

function App() {
  return (
    <div className="min-h-screen flex flex-col roshan-bg text-gray-100">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/schedule" element={<SchedulePage />} />

          <Route path="/rules" element={<RulesPage />} />

          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />

          {/* standings page */}
          <Route path="/seasons" element={<SeasonShowCase />} />

          <Route path="/players" element={<AllPlayersPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
