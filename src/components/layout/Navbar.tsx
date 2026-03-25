// src/components/layout/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import * as React from "react";
import { Menu, ScrollText, House, LogIn, User, Shield, ChevronDown, UserCircle, Medal } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import AuthService from "../../services/auth";
import SteamAuthService from "../../services/steamAuth";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const closeTimeout = useRef<number | null>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement[]>([]);
  const lastPlayedIndexRef = useRef<number>(-1);

  // Get current user - will be checked in useEffect
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Check auth status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      const adminSession = AuthService.getCurrentAdminSession();
      
      // Check for super admin session
      const superAdminSessionStr = localStorage.getItem('superAdminSession');
      let superAdminSession = null;
      if (superAdminSessionStr) {
        try { superAdminSession = JSON.parse(superAdminSessionStr); } catch (e) {}
      }
      
      const superAdmin = (adminSession && (adminSession.username === 'reyuk' || adminSession.username === 'nikhil')) ||
                        (superAdminSession && superAdminSession.authenticated);
      
      if (superAdminSession && superAdminSession.authenticated) {
        setCurrentUser({
          type: 'admin',
          username: superAdminSession.username,
          displayName: superAdminSession.username === 'reyuk' ? 'Reyuk' : 
                      superAdminSession.username === 'nikhil' ? 'N1KHIL' : 
                      superAdminSession.username,
          role: superAdminSession.role
        });
        setIsLoggedIn(true);
      } else {
        // Check Steam session first, then fall back to password session
        const steamSession = SteamAuthService.getSession();
        if (steamSession) {
          setCurrentUser({
            type: 'player',
            playerId: steamSession.playerId,
            nickname: steamSession.nickname,
            steamId: steamSession.steamId,
            avatarUrl: steamSession.avatarUrl,
            loginMethod: 'steam',
          });
          setIsLoggedIn(true);
        } else {
          const user = AuthService.getCurrentUser();
          const loggedIn = AuthService.isSessionValid();
          setCurrentUser(user);
          setIsLoggedIn(loggedIn);
        }
      }
      
      setIsSuperAdmin(superAdmin || false);
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [pathname]);
  
  // Get user role display
  const getUserRole = () => {
    if (currentUser?.type === 'admin') {
      const adminSession = AuthService.getCurrentAdminSession();
      
      // Also check super admin session
      const superAdminSessionStr = localStorage.getItem('superAdminSession');
      let superAdminSession = null;
      if (superAdminSessionStr) {
        try {
          superAdminSession = JSON.parse(superAdminSessionStr);
        } catch (e) {
          // Invalid JSON
        }
      }
      
      if (superAdminSession && superAdminSession.authenticated) {
        return superAdminSession.role;
      }
      
      if (adminSession?.username === 'reyuk') return 'Founder';
      if (adminSession?.username === 'nikhil') return 'Super Admin';
      return 'Admin';
    }
    return currentUser?.type;
  };

  // Initialize audio
  useEffect(() => {
    const audioPaths = [
      '/audio/roar1.mp3',
      '/audio/roar2.mp3'
    ];
    
    // Load all audio files with error handling
    audioPaths.forEach((path) => {
      const audio = new Audio(path);
      audio.volume = 0.5;
      audio.preload = 'none'; // Changed from 'auto' to 'none' to avoid cache issues
      audio.onerror = () => {}; // Silently handle errors
      audioRef.current.push(audio);
    });
    
    return () => {
      audioRef.current.forEach(audio => {
        audio.pause();
      });
      audioRef.current = [];
    };
  }, []);

  const handleRoshanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Play random sound
    if (audioRef.current.length > 0) {
      // Get random index different from last played
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * audioRef.current.length);
      } while (randomIndex === lastPlayedIndexRef.current && audioRef.current.length > 1);
      
      lastPlayedIndexRef.current = randomIndex;
      
      const audio = audioRef.current[randomIndex];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    
    // Navigate to home
    navigate('/');
  };

  const handleLeave = () => {
    if (closeTimeout.current !== null) {
      window.clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      setMobileNavOpen(false);
      closeTimeout.current = null;
    }, 200);
  };

  // Close login dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeout.current !== null) {
        window.clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 w-full backdrop-blur-[18px] border-b border-[rgba(192,192,192,0.25)] shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.12), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.10), transparent 60%), rgba(5,7,10,0.92)",
      }}
    >
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-10 max-w-[1920px]">
        <div className="h-16 sm:h-[68px] md:h-[76px] lg:h-20 flex items-center justify-between gap-4">
          {/* Brand / Left side */}
          <button
            onClick={handleRoshanClick}
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 no-underline group relative border-none bg-transparent cursor-pointer p-0"
          >
            {/* Logo + glow wrapper */}
            <span className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center shrink-0">
              <span
                className="absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, #D16500 0%, #AF1D5D 80%)",
                  filter: "blur(8px)",
                }}
              />
              <img
                src="/assets/roshanIcon.png"
                className="w-full h-full relative z-10 transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                alt="Roshan Icon"
              />
            </span>

            {/* Text with SEASONS glow + moving light effect */}
            <div className="flex flex-col min-w-0">
              <h1 className="relative inline-block leading-none">
                <span
                  className="
                    text-[0.9rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.35rem] 
                    font-extrabold tracking-tight text-transparent bg-clip-text
                    bg-linear-to-r from-zinc-200 via-slate-100 to-white
                    transition-all duration-400
                    group-hover:bg-linear-to-r group-hover:from-[#D16500] group-hover:via-[#E4472F] group-hover:to-[#AF1D5D]
                    whitespace-nowrap
                  "
                >
                  The Roshan Rumble
                </span>

                {/* soft duplicate glow under text */}
                <span
                  className="pointer-events-none absolute inset-0 
                    text-[0.9rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.35rem]
                    font-extrabold tracking-tight blur-lg opacity-30
                    transition-all duration-400
                    text-zinc-300 group-hover:text-[#E4472F]
                    whitespace-nowrap"
                  style={{ transform: "translate(-1px, -1px)" }}
                >
                  The Roshan Rumble
                </span>

                {/* moving light sweep */}
                <motion.div
                  animate={{ x: [-40, 260], opacity: [0, 0.45, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="pointer-events-none absolute -top-3 -left-12 w-20 sm:w-24 md:w-28 h-16 sm:h-18 md:h-20 bg-linear-to-r from-transparent via-zinc-300 to-transparent blur-2xl"
                />
              </h1>
            </div>
          </button>

          {/* Desktop Navigation */}
          <LayoutGroup id="navbar">
            <div className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-5 xl:gap-8">
              <NavItem
                to="/"
                icon={<House className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />}
                label="Home"
                active={pathname === "/"}
              />
              <NavItem
                to="/rules"
                icon={<ScrollText className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />}
                label="Rules"
                active={pathname.startsWith("/rules")}
              />
              {/* Standings */}
              <NavItem
                to="/seasons"
                icon={<Medal className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />}
                label="Standings"
                active={pathname.startsWith("/seasons")}
              />
              <NavItem
                to="/players"
                icon={<User className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />}
                label="Players"
                active={pathname.startsWith("/players")}
              />
              <NavItem
                to="/auction"
                icon={<svg className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                label="Auction"
                active={pathname.startsWith("/auction")}
              />
              <NavItem
                to="/wall-of-shame"
                icon={<svg className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                label="Banned"
                active={pathname.startsWith("/wall-of-shame")}
              />
              
              {/* Profile Link - Only show for logged-in players */}
              {authChecked && isLoggedIn && currentUser?.type === 'player' && (
                <NavItem
                  to={`/players/${currentUser.playerId}`}
                  icon={<UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />}
                  label="Profile"
                  active={pathname.startsWith("/players") && pathname.includes(currentUser.playerId)}
                />
              )}
              
              {/* Login Dropdown - Show for everyone except on super-admin-dashboard page */}
              {authChecked && pathname !== '/super-admin-dashboard' && (
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className={`relative inline-flex items-center gap-[0.3rem] md:gap-[0.35rem] px-1.5 md:px-2 lg:px-3 py-1 md:py-1.5 
                      text-[0.65rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.8rem] uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.18em] 
                      transition-all duration-300 group rounded-lg text-zinc-200 hover:text-white ${
                      loginDropdownOpen ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {loginDropdownOpen && <ActiveHighlight color="white" />}

                    {isLoggedIn ? (
                      <UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] transition-colors duration-300 text-zinc-200 group-hover:text-white" />
                    ) : (
                      <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] transition-colors duration-300 text-zinc-200 group-hover:text-white" />
                    )}
                    
                    <span className="relative whitespace-nowrap">
                      {isLoggedIn 
                        ? (currentUser?.type === 'player' ? currentUser.nickname : currentUser?.username)
                        : 'Login'
                      }
                      <span className={`pointer-events-none absolute left-0 right-0 -bottom-1 lg:-bottom-1.5 block h-0.5 rounded-full origin-left transition-all duration-300 bg-gradient-to-r from-zinc-300 to-zinc-400 ${
                        loginDropdownOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                    </span>
                    
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                <AnimatePresence>
                  {loginDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-48 
                        bg-[rgba(5,7,10,0.98)] border border-[rgba(192,192,192,0.18)] 
                        shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl
                        rounded-xl py-2 z-50"
                    >
                      {isLoggedIn ? (
                        // Logged in - show user info and logout
                        <>
                          <div className="px-4 py-2 border-b border-gray-700">
                            <p className="text-xs text-gray-400">Logged in as</p>
                            <p className="text-sm text-white font-medium">
                              {currentUser?.type === 'player' ? currentUser.nickname : currentUser?.username}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{getUserRole()}</p>
                          </div>
                          {currentUser?.type === 'player' && (
                            <Link
                              to={`/players/${currentUser.playerId}`}
                              onClick={() => setLoginDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors"
                            >
                              <UserCircle className="w-4 h-4 text-white" />
                              <span>My Profile</span>
                            </Link>
                          )}
                          {currentUser?.type === 'admin' && (
                            <Link
                              to={isSuperAdmin ? "/super-admin-dashboard" : "/admin-dashboard"}
                              onClick={() => setLoginDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-white" />
                              <span>Dashboard</span>
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              AuthService.logout();
                              SteamAuthService.clearSession();
                              // Also clear super admin session
                              localStorage.removeItem('superAdminSession');
                              setLoginDropdownOpen(false);
                              setIsLoggedIn(false);
                              setCurrentUser(null);
                              setIsSuperAdmin(false);
                              navigate('/');
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                          >
                            <LogIn className="w-4 h-4 text-red-400 rotate-180" />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        // Not logged in - show login options
                        <>
                          <Link
                            to="/player-login"
                            onClick={() => setLoginDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4 text-white" />
                            <span>Player Login</span>
                          </Link>
                          <Link
                            to="/admin-login"
                            onClick={() => setLoginDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-white" />
                            <span>Admins</span>
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              )}
            </div>

            {/* Hamburger for mobile */}
            <div className="flex md:hidden">
              <button
                className="p-1.5 sm:p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D16500] hover:bg-white/5 transition-colors"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" />
              </button>
            </div>

            {/* Mobile nav menu */}
            <AnimatePresence>
              {mobileNavOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-16 sm:top-[68px] right-3 sm:right-4 w-[200px] sm:w-[220px] 
                    bg-[rgba(5,7,10,0.98)] border border-[rgba(192,192,192,0.18)] 
                    shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl
                    z-999 flex flex-col md:hidden rounded-xl px-2 py-2"
                  onMouseLeave={handleLeave}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <NavItem
                    to="/"
                    icon={<House className="w-[18px] h-[18px]" />}
                    label="Home"
                    active={pathname === "/"}
                    mobile
                  />
                  <NavItem
                    to="/rules"
                    icon={<ScrollText className="w-[18px] h-[18px]" />}
                    label="Rules"
                    active={pathname.startsWith("/rules")}
                    mobile
                  />
                  {/* Standings */}
                  <NavItem
                    to="/seasons"
                    icon={<Medal className="w-[18px] h-[18px]" />}
                    label="Standings"
                    active={pathname.startsWith("/seasons")}
                    mobile
                  />
                  <NavItem
                    to="/players"
                    icon={<User className="w-[18px] h-[18px]" />}
                    label="Players"
                    active={pathname.startsWith("/players")}
                    mobile
                  />
                  <NavItem
                    to="/auction"
                    icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="Auction"
                    active={pathname.startsWith("/auction")}
                    mobile
                  />
                  <NavItem
                    to="/wall-of-shame"
                    icon={<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                    label="Banned"
                    active={pathname.startsWith("/wall-of-shame")}
                    mobile
                  />
                  
                  {/* Profile Link - Only show for logged-in players */}
                  {isLoggedIn && currentUser?.type === 'player' && (
                    <NavItem
                      to={`/players/${currentUser.playerId}`}
                      icon={<UserCircle className="w-[18px] h-[18px]" />}
                      label="Profile"
                      active={pathname.startsWith("/players") && pathname.includes(currentUser.playerId)}
                      mobile
                    />
                  )}
                  
                  {/* Mobile Login Section - Show for everyone */}
                  <div className="border-t border-gray-600/30 mt-2 pt-2">
                    {isLoggedIn ? (
                      // Logged in - show user info and logout
                      <>
                        <div className="px-3 py-2">
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</div>
                          <div className="text-sm text-white font-medium">
                            {currentUser?.type === 'player' ? currentUser.nickname : currentUser?.username}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{getUserRole()}</div>
                        </div>
                        {currentUser?.type === 'admin' && (
                          <Link
                            to={isSuperAdmin ? "/super-admin-dashboard" : "/admin-dashboard"}
                            onClick={() => setMobileNavOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Shield className="w-[18px] h-[18px] text-white" />
                            <span>Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            AuthService.logout();
                            SteamAuthService.clearSession();
                            // Also clear super admin session
                            localStorage.removeItem('superAdminSession');
                            setMobileNavOpen(false);
                            setIsLoggedIn(false);
                            setCurrentUser(null);
                            setIsSuperAdmin(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                        >
                          <LogIn className="w-[18px] h-[18px] text-red-400 rotate-180" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      // Not logged in - show login options
                      <>
                        <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wider">Login</div>
                        <Link
                          to="/player-login"
                          onClick={() => setMobileNavOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <User className="w-[18px] h-[18px] text-white" />
                          <span>Player Login</span>
                        </Link>
                        <Link
                          to="/admin-login"
                          onClick={() => setMobileNavOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Shield className="w-[18px] h-[18px] text-white" />
                          <span>Admins</span>
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
}

/* ================= Subcomponents ================= */

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  mobile?: boolean;
};

function NavItem({ to, icon, label, active, mobile = false }: NavItemProps) {
  // Mobile rendering
  if (mobile) {
    return (
      <Link
        to={to}
        className="relative flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 
          hover:bg-white/5 rounded-lg transition-all duration-200 group"
      >
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-r-full" />
        )}
        
        <span className={`transition-colors ${active ? 'text-white' : 'text-zinc-200'}`}>
          {icon}
        </span>
        
        <span className={`font-medium tracking-wide ${active ? 'text-white' : ''}`}>
          {label}
        </span>
      </Link>
    );
  }

  // Desktop rendering - same for all buttons
  return (
    <Link
      to={to}
      className={`relative inline-flex items-center gap-[0.3rem] md:gap-[0.35rem] px-1.5 md:px-2 lg:px-3 py-1 md:py-1.5 
        text-[0.65rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.8rem] uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.18em] 
        transition-all duration-300 group rounded-lg text-zinc-200 hover:text-white ${
        active ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
    >
      {active && <ActiveHighlight color="white" />}

      <span className="transition-colors duration-300 text-zinc-200 group-hover:text-white">
        {icon}
      </span>

      <span className="relative whitespace-nowrap">
        {label}
        <span className={`pointer-events-none absolute left-0 right-0 -bottom-1 lg:-bottom-1.5 block h-0.5 rounded-full origin-left transition-all duration-300 bg-gradient-to-r from-zinc-300 to-zinc-400 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`} />
      </span>
    </Link>
  );
}

function ActiveHighlight({ color }: { color: string }) {
  const colorClass = color === 'white' 
    ? 'border-white/30 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.2)]'
    : 'border-white/30 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.2)]';
    
  return (
    <motion.div
      layoutId="activeNav"
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`absolute inset-0 -z-10 rounded-lg border ${colorClass}`}
    />
  );
}
