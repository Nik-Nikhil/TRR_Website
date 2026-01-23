import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import registrationService from "../services/registrationService";

export default function Home() {
  const [currentBg, setCurrentBg] = useState(1);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  
  const backgrounds = [
    { id: 1, url: '/Bg1.png', name: 'BG1' },
    { id: 2, url: '/bg2.jpg', name: 'BG2' },
    { id: 3, url: '/bg3.jpg', name: 'BG3' }
  ];

  // Roshan Rumble channel videos - you can add more video IDs here
  const roshanRumbleVideos = [
    { id: 'dAtqNgL9uEI', title: 'Season 5 Grand Final' },
    { id: '8M5u3HSr3wI', title: 'Season 5 Auction' },
  ];

  const announcements = [
    {
      title: "Season 6 Comming Soon",
      description: "Registration will start soon",
      icon: "🎮",
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30"
    },
    {
      title: "Prize Pool ₹40,000",
      description: "Last Season Prizepool",
      icon: "💰",
      color: "from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/30"
    },
    {
      title: "New Season Starting Soon",
      description: "Registerion will start soon",
      icon: "🚀",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30"
    },
    {
      title: "Join Discord Community",
      description: "Connect with 300+ active Dota 2 players",
      icon: "🤝",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30"
    }
  ];

  // Auto-cycle backgrounds every 15 seconds
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

  // Auto-cycle announcements every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement(prev => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  // Auto-cycle videos every 30 seconds to show different Roshan Rumble content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % roshanRumbleVideos.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [roshanRumbleVideos.length]);

  // Initialize with a random video on component mount
  useEffect(() => {
    setCurrentVideo(Math.floor(Math.random() * roshanRumbleVideos.length));
  }, [roshanRumbleVideos.length]);

  // Load registration settings
  useEffect(() => {
    const updateRegistrationState = () => {
      setRegistrationEnabled(registrationService.isRegistrationEnabled());
      setRegistrationMessage(registrationService.getRegistrationMessage());
    };

    // Initial load
    updateRegistrationState();

    // Listen for changes
    const handleSettingsChange = () => {
      updateRegistrationState();
    };

    window.addEventListener('registrationSettingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('registrationSettingsChanged', handleSettingsChange);
    };
  }, []);

  // Navigation functions for video slider
  const nextVideo = () => {
    setCurrentVideo(prev => (prev + 1) % roshanRumbleVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo(prev => prev === 0 ? roshanRumbleVideos.length - 1 : prev - 1);
  };

  return (
    <>
      {/* Fixed Background - Same pattern as AdminLogin and HallOfFame */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${backgrounds.find(bg => bg.id === currentBg)?.url})`,
          }}
        />
        {/* Much lighter overlay to make background visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.05), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.03), transparent 60%), rgba(5,7,10,0.3)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-slate-900/15 to-gray-900/20" />
        {/* Subtle animated orbs with reduced opacity */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-400/5 to-slate-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-500/5 to-gray-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content - Same pattern as AdminLogin and HallOfFame */}
      <main className="home-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            
            {/* Header - Same pattern as HallOfFame */}
            <div className="text-center mb-6 relative pt-4">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-400">India's premier amateur league for all ranks.</p>
            </div>

            {/* Main Content Grid - Same pattern as AdminLogin */}
            <div className="w-full flex justify-center pb-4">
              <div className="w-full max-w-[1100px] px-3 sm:px-4 md:px-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 items-center w-full">
                  
                  {/* Left Column - Announcements & Watch */}
                  <div className="space-y-2 md:col-span-1 lg:col-span-2">
                    
                    {/* Announcements Card with Slider */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 backdrop-blur-xl border border-blue-500/40 rounded-xl p-2.5 hover:border-blue-400/60 hover:from-blue-800/40 hover:to-cyan-800/30 transition-all duration-300 group text-center relative h-48">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center space-x-2 mb-2 justify-center">
                          <div className="w-4 h-4 bg-blue-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-blue-300 text-xs">📢</span>
                          </div>
                          <h3 className="text-xs font-bold text-blue-100">ANNOUNCEMENTS</h3>
                        </div>
                        
                        {/* Announcement Slider */}
                        <div className="mb-2 flex-1 flex flex-col justify-center">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentAnnouncement}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.5 }}
                              className={`p-1.5 rounded-lg bg-gradient-to-br ${announcements[currentAnnouncement].color} border ${announcements[currentAnnouncement].border} mb-1`}
                            >
                              <div className="flex items-center space-x-1 mb-1">
                                <span className="text-xs">{announcements[currentAnnouncement].icon}</span>
                                <h4 className="font-bold text-white text-xs">{announcements[currentAnnouncement].title}</h4>
                              </div>
                              <p className="text-gray-300 text-xs">{announcements[currentAnnouncement].description}</p>
                            </motion.div>
                          </AnimatePresence>

                          {/* Slider Dots */}
                          <div className="flex justify-center space-x-1 mb-1">
                            {announcements.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentAnnouncement(index)}
                                className={`w-1 h-1 rounded-full transition-colors ${
                                  index === currentAnnouncement ? 'bg-blue-300' : 'bg-blue-300/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <Link 
                          to="/announcements"
                          className="inline-block px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/40 rounded-full text-blue-200 text-xs font-medium transition-all duration-300 border border-blue-400/30"
                        >
                          LATEST UPDATES
                        </Link>
                      </div>
                    </div>

                    {/* Watch Tab with Mini Player */}
                    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/20 backdrop-blur-xl border border-red-500/40 rounded-xl p-2.5 hover:border-red-400/60 hover:from-red-800/40 hover:to-orange-800/30 transition-all duration-300 group text-center relative h-48">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center space-x-2 mb-2 justify-center">
                          <div className="w-4 h-4 bg-red-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-red-300 text-xs">📺</span>
                          </div>
                          <h3 className="text-xs font-bold text-red-100">WATCH</h3>
                        </div>
                        
                        {/* Mini Player - Reduced size */}
                        <div className="mb-2 flex-1 flex flex-col justify-center relative">
                          {/* Left Navigation Button */}
                          <button
                            onClick={prevVideo}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-6 h-6 bg-red-600/40 hover:bg-red-600/60 border border-red-500/50 hover:border-red-400/70 rounded-full text-red-200 text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-lg"
                          >
                            ‹
                          </button>
                          
                          {/* Right Navigation Button */}
                          <button
                            onClick={nextVideo}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-6 h-6 bg-red-600/40 hover:bg-red-600/60 border border-red-500/50 hover:border-red-400/70 rounded-full text-red-200 text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-lg"
                          >
                            ›
                          </button>
                          
                          <div className="bg-black/40 rounded-lg p-1 border border-red-500/30 mx-8">
                            <div className="relative aspect-video rounded overflow-hidden group" style={{ maxHeight: '120px' }}>
                              <iframe
                                key={currentVideo} // Force re-render when video changes
                                src={`https://www.youtube.com/embed/${roshanRumbleVideos[currentVideo].id}?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0`}
                                title={`Roshan Rumble - ${roshanRumbleVideos[currentVideo].title}`}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            
                            {/* Video indicator - Compact */}
                            <div className="mt-1 text-center">
                              <p className="text-red-100 text-xs font-medium truncate">{roshanRumbleVideos[currentVideo].title}</p>
                              <div className="flex justify-center space-x-1 mt-0.5">
                                {roshanRumbleVideos.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentVideo(index)}
                                    className={`w-1 h-1 rounded-full transition-colors ${
                                      index === currentVideo ? 'bg-red-300' : 'bg-red-300/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Center Column - Aegis */}
                  <div className="flex justify-center md:col-span-2 lg:col-span-2">
                    <div className="text-center">
                      <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto">
                        <TrophyCanvas />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Registration, Champions & Admin Panel */}
                  <div className="space-y-2 md:col-span-1 lg:col-span-2">
                    
                    {/* Registration Card */}
                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-xl border border-purple-500/40 rounded-xl p-2.5 hover:border-purple-400/60 hover:from-purple-800/40 hover:to-pink-800/30 transition-all duration-300 group text-center relative h-32">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-1 justify-center">
                          <div className="w-4 h-4 bg-purple-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-purple-300 text-xs">📝</span>
                          </div>
                          <h3 className="text-xs font-bold text-purple-100">REGISTRATION</h3>
                        </div>
                        
                        <p className="text-purple-200 text-xs mb-2 flex-1 flex items-center justify-center">
                          {registrationMessage}
                        </p>
                        
                        {registrationEnabled ? (
                          <Link 
                            to="/new-player-registration"
                            className="inline-block px-2.5 py-1 bg-green-600/30 hover:bg-green-600/40 rounded-full text-green-200 text-xs font-medium transition-all duration-300 border border-green-400/30"
                          >
                            REGISTER NOW
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="inline-block px-2.5 py-1 bg-purple-600/30 rounded-full text-purple-300 text-xs font-medium border border-purple-400/30 cursor-not-allowed opacity-80"
                          >
                            STARTING SOON
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Champions Card */}
                    <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 backdrop-blur-xl border border-amber-500/40 rounded-xl p-2.5 hover:border-amber-400/60 hover:from-amber-800/40 hover:to-yellow-800/30 transition-all duration-300 group text-center relative h-32">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-1 justify-center">
                          <div className="w-4 h-4 bg-amber-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-amber-300 text-xs">🏆</span>
                          </div>
                          <h3 className="text-xs font-bold text-amber-100">CHAMPION</h3>
                        </div>
                        
                        <p className="text-amber-200 text-xs mb-2 flex-1 flex items-center justify-center">
                          Champions across all seasons.
                        </p>
                        
                        <Link 
                          to="/hall-of-fame"
                          className="inline-block px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/40 rounded-full text-amber-200 text-xs font-medium transition-all duration-300 border border-amber-400/30"
                        >
                          VIEW HALL OF FAME
                        </Link>
                      </div>
                    </div>
                    
                    {/* Admin Panel Card */}
                    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 backdrop-blur-xl border border-green-500/40 rounded-xl p-2.5 hover:border-green-400/60 hover:from-green-800/40 hover:to-emerald-800/30 transition-all duration-300 group text-center relative h-32">
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-1 justify-center">
                          <div className="w-4 h-4 bg-green-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-green-300 text-xs">⚙️</span>
                          </div>
                          <h3 className="text-xs font-bold text-green-100">ADMIN PANEL</h3>
                        </div>
                        
                        <p className="text-green-200 text-xs mb-2 flex-1 flex items-center justify-center">
                          Connect or Contact with admins for support.
                        </p>
                        
                        <Link 
                          to="/admins"
                          className="inline-block px-2.5 py-1 bg-green-600/30 hover:bg-green-600/40 rounded-full text-green-200 text-xs font-medium transition-all duration-300 border border-green-400/30"
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
        </div>
      </main>
    </>
  );
}