import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import registrationService from "../services/registrationService";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [currentBg, setCurrentBg] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  
  const backgrounds = [
    { id: 1, url: '/Bg1.png', name: 'BG1' },
    { id: 2, url: '/bg2.jpg', name: 'BG2' },
    { id: 3, url: '/bg3.jpg', name: 'BG3' }
  ];

  const roshanRumbleVideos = [
    { id: 'dAtqNgL9uEI', title: 'Season 5 Grand Final' },
    { id: '8M5u3HSr3wI', title: 'Season 5 Auction' },
  ];

  const announcements = [
    {
      title: "Season 6 Coming Soon",
      description: "Registration will start soon",
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    },
    {
      title: "Prize Pool ₹40,000",
      description: "Last Season Prizepool",
      color: "from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/30"
    },
    {
      title: "New Season Starting Soon",
      description: "Registration will start soon",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30"
    },
    {
      title: "Join Discord Community",
      description: "Connect with 300+ active Dota 2 players",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30"
    }
  ];

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % roshanRumbleVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + roshanRumbleVideos.length) % roshanRumbleVideos.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => {
        if (prev === 1) return 2;
        if (prev === 2) return 3;
        return 1;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % roshanRumbleVideos.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [roshanRumbleVideos.length]);

  useEffect(() => {
    setCurrentVideo(Math.floor(Math.random() * roshanRumbleVideos.length));
  }, [roshanRumbleVideos.length]);

  useEffect(() => {
    const loadRegistrationState = async () => {
      const enabled = await registrationService.isRegistrationEnabled();
      const message = await registrationService.getRegistrationMessage();
      setRegistrationEnabled(enabled);
      setRegistrationMessage(message);
    };

    loadRegistrationState();

    // Subscribe to real-time changes
    const channel = registrationService.subscribeToChanges((settings) => {
      setRegistrationEnabled(settings.isEnabled);
      setRegistrationMessage(settings.message || 'Registration starting soon. Stay tuned for updates.');
    });

    // Also listen for local custom events (for immediate UI updates)
    const handleSettingsChange = () => {
      loadRegistrationState();
    };

    window.addEventListener('registrationSettingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('registrationSettingsChanged', handleSettingsChange);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${backgrounds.find(bg => bg.id === currentBg)?.url})`,
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.05), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.03), transparent 60%), rgba(5,7,10,0.3)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-slate-900/15 to-gray-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-400/5 to-slate-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-500/5 to-gray-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <main className="home-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            {/* Header */}
            <div className="text-center mb-3 pt-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                India's premier amateur league for all ranks.
              </h1>
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="flex flex-col items-center space-y-2 pb-4">
              
              {/* Top Row - Announcements, Empty Space, Registration */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-2 w-full">
                
                {/* Announcements Card - Left */}
                <Link 
                  to="/announcements"
                  className="block bg-gradient-to-br from-blue-900/40 to-cyan-900/30 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 hover:border-blue-400/70 transition-all duration-300 group h-52 cursor-pointer"
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-blue-100">ANNOUNCEMENTS</h3>
                    </div>
                    
                    <div className="flex-1 relative overflow-hidden mb-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentAnnouncement}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                          className={`absolute inset-0 bg-gradient-to-br ${announcements[currentAnnouncement].color} border ${announcements[currentAnnouncement].border} rounded-xl p-4 flex flex-col justify-center`}
                        >
                          <h4 className="text-white font-bold text-base mb-1">
                            {announcements[currentAnnouncement].title}
                          </h4>
                          <p className="text-gray-200 text-xs">
                            {announcements[currentAnnouncement].description}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    <div className="w-full flex justify-center">
                      <div className="inline-flex items-center justify-center rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-gray-900 shadow-lg group-hover:brightness-95 transition cursor-pointer">
                        VIEW ALL
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Empty Middle Space for Aegis */}
                <div className="w-80 mx-auto"></div>

                {/* Registration Card - Right */}
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 backdrop-blur-xl border border-purple-500/50 rounded-2xl p-4 hover:border-purple-400/70 transition-all duration-300 group h-52">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-purple-100">REGISTRATION</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center mb-2">
                      <p className="text-purple-200 text-xs mb-2">
                        {registrationMessage}
                      </p>
                    </div>
                    
                    {registrationEnabled ? (
                      <div className="w-full flex justify-center">
                        <Link 
                          to="/new-player-registration"
                          className="inline-flex items-center justify-center rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-gray-900 shadow-lg hover:brightness-95 transition cursor-pointer"
                        >
                          REGISTER NOW
                        </Link>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <button 
                          disabled
                          className="inline-flex items-center justify-center rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-gray-400 text-gray-700 shadow-lg cursor-not-allowed opacity-60"
                        >
                          STARTING SOON
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Middle Row - Aegis */}
              <div className="flex justify-center -mt-32">
                <div className="w-64 h-64">
                  <TrophyCanvas />
                </div>
              </div>

              {/* Bottom Row - Champions, YouTube, Admin Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-2 w-full -mt-32">
                
                {/* Champions Card - First */}
                <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/30 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-3 hover:border-amber-400/70 transition-all duration-300 group h-44">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-amber-100">CHAMPION</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center mb-2">
                      <p className="text-amber-200 text-xs">
                        Champions across all seasons.
                      </p>
                    </div>
                    
                    <div className="w-full flex justify-center">
                      <Link 
                        to="/hall-of-fame"
                        className="inline-flex items-center justify-center rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-gray-900 shadow-lg hover:brightness-95 transition cursor-pointer"
                      >
                        VIEW HALL OF FAME
                      </Link>
                    </div>
                  </div>
                </div>

                {/* YouTube - Second (with max-width for square appearance) */}
                <div className="bg-gradient-to-br from-red-900/40 to-orange-900/30 backdrop-blur-xl border border-red-500/50 rounded-2xl p-3 hover:border-red-400/70 transition-all duration-300 h-44 flex flex-col w-full max-w-xs mx-auto">
                  {/* Video Player with Navigation */}
                  <div className="flex-1 flex items-center gap-2 mb-1 min-h-0">
                    {/* Previous Button */}
                    <button
                      onClick={prevVideo}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
                      aria-label="Previous video"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Video */}
                    <div className="flex-1 bg-black/50 rounded-lg overflow-hidden min-h-0 h-full">
                      <div className="relative w-full h-full">
                        <iframe
                          key={currentVideo}
                          src={`https://www.youtube.com/embed/${roshanRumbleVideos[currentVideo].id}?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0`}
                          title={`Roshan Rumble - ${roshanRumbleVideos[currentVideo].title}`}
                          className="w-full h-full border-0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={nextVideo}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
                      aria-label="Next video"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Video Description */}
                  <div className="text-center flex-shrink-0">
                    <p className="text-red-200 text-xs font-medium truncate">
                      {roshanRumbleVideos[currentVideo].title}
                    </p>
                  </div>
                </div>

                {/* Admin Panel Card - Third */}
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 backdrop-blur-xl border border-green-500/50 rounded-2xl p-3 hover:border-green-400/70 transition-all duration-300 group h-44">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-green-100">ADMIN PANEL</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center mb-2">
                      <p className="text-green-200 text-xs">
                        Connect or Contact with admins for support.
                      </p>
                    </div>
                    
                    <div className="w-full flex justify-center">
                      <Link 
                        to="/admins"
                        className="inline-flex items-center justify-center rounded-full px-6 py-1.5 text-xs font-bold uppercase tracking-wider bg-white text-gray-900 shadow-lg hover:brightness-95 transition cursor-pointer"
                      >
                        ADMINS ↗
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
}
