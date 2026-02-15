// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";

import Teams from "./pages/Team";
import TeamDetail from "./pages/TeamDeatail";
import TeamDetailAuction from "./pages/TeamDetail";
import AdminsPage from "./pages/Admins";
import NewPlayerRegistration from "./pages/NewPlayerRegistration";
import SetDefaultPasswords from "./pages/SetDefaultPasswords";
import UpdatePlayerData from "./pages/UpdatePlayerData";
import FixCaptainIds from "./pages/FixCaptainIds";

import SchedulePage from "./pages/Schedule";

import AllPlayersPage from "./pages/Players/AllPlayersPage";
import PlayerDetailPage from "./pages/Players/PlayerDetailPage";
import PlayerProfile from "./pages/PlayerProfile";
import AdminProfile from "./pages/AdminProfile";

import RulesPage from "./pages/Rules";
import Announcements from "./pages/Announcements";
import HallOfFame from "./pages/HallOfFame";
import SeasonShowCase from "./pages/SeasonShowCase";
import Registration from "./pages/Registration";
import Auction from "./pages/Auction";
import AdminLogin from "./pages/AdminLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import PlayerLogin from "./pages/PlayerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import GroupStage from "./pages/GroupStage";
import Playoff from "./pages/Playoff";

function App() {
  return (
    <div className="min-h-screen flex flex-col text-gray-100 relative border-0" style={{ gap: '0' }}>
      <Navbar />

      <div className="flex-1 flex flex-col border-0" style={{ gap: '0', marginBottom: '0', paddingBottom: '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/admins" element={<AdminsPage />} />

          <Route path="/rules" element={<RulesPage />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />

          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/team/:teamName" element={<TeamDetailAuction />} />

          <Route path="/seasons" element={<SeasonShowCase />} />
          <Route path="/auction" element={<Auction />} />

          <Route path="/players" element={<AllPlayersPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPage />} />
          <Route path="/profile/:playerId" element={<PlayerProfile />} />
          <Route path="/admin/:adminId" element={<AdminProfile />} />

          <Route path="/group-stage/:season" element={<GroupStage />} />
          <Route path="/playoff/:season" element={<Playoff />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/new-player-registration" element={<NewPlayerRegistration />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/player-login" element={<PlayerLogin />} />
          <Route path="/set-default-passwords" element={<SetDefaultPasswords />} />
          <Route path="/update-player-data" element={<UpdatePlayerData />} />
          <Route path="/fix-captain-ids" element={<FixCaptainIds />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;