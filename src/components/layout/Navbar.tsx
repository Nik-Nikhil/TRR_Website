import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, LogIn, User, Shield, ChevronDown, UserCircle } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { checkAuthStatus, logoutUser, getDisplayName, getUserRole, type PlayerUser, type CurrentUser } from "../../store/authSlice";
import { useOutsideClick } from "../../store/useOutsideClick";
import { primaryNavItems, exploreNavItems, type NavItemConfig } from "./navItems";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentUser, isLoggedIn, isSuperAdmin, authChecked } = useAppSelector((s) => s.auth);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const closeTimeout = useRef<number | null>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement[]>([]);
  const lastPlayedIndexRef = useRef<number>(-1);

  // Auth is now derived once in the store; the Navbar just asks it to refresh on route change.
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [pathname, dispatch]);

  useOutsideClick(loginDropdownRef, () => setLoginDropdownOpen(false));

  // Init roshan-click sounds
  useEffect(() => {
    const audioPaths = ["/audio/roar1.mp3", "/audio/roar2.mp3"];
    audioPaths.forEach((path) => {
      const audio = new Audio(path);
      audio.volume = 0.5;
      audio.preload = "none";
      audio.onerror = () => {};
      audioRef.current.push(audio);
    });
    return () => {
      audioRef.current.forEach((audio) => audio.pause());
      audioRef.current = [];
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeout.current !== null) window.clearTimeout(closeTimeout.current);
    };
  }, []);

  const handleRoshanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (audioRef.current.length > 0) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * audioRef.current.length);
      } while (randomIndex === lastPlayedIndexRef.current && audioRef.current.length > 1);
      lastPlayedIndexRef.current = randomIndex;
      const audio = audioRef.current[randomIndex];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    navigate("/");
  };

  const handleLeave = () => {
    if (closeTimeout.current !== null) window.clearTimeout(closeTimeout.current);
    closeTimeout.current = window.setTimeout(() => {
      setMobileNavOpen(false);
      closeTimeout.current = null;
    }, 200);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setLoginDropdownOpen(false);
    setMobileNavOpen(false);
    navigate("/");
  };

  const profileItem: NavItemConfig | null =
    isLoggedIn && currentUser?.type === "player"
      ? {
          to: `/players/${(currentUser as PlayerUser).playerId}`,
          label: "Profile",
          icon: <UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />,
          isActive: (p) => p.startsWith("/players") && p.includes(String((currentUser as PlayerUser).playerId)),
        }
      : null;

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
          <Brand onClick={handleRoshanClick} />

          <LayoutGroup id="navbar">
            <div className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-5 xl:gap-8">
              {primaryNavItems.map((item) => (
                <NavItem key={item.to} {...item} active={item.isActive(pathname)} />
              ))}

              <MoreDropdown pathname={pathname} />

              {profileItem && <NavItem {...profileItem} active={profileItem.isActive(pathname)} />}

              {authChecked && pathname !== "/super-admin-dashboard" && (
                <div className="relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                    className={`relative inline-flex items-center gap-[0.3rem] md:gap-[0.35rem] px-1.5 md:px-2 lg:px-3 py-1 md:py-1.5
                      text-[0.65rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.8rem] uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.18em]
                      transition-all duration-300 group rounded-lg text-zinc-200 hover:text-white ${
                        loginDropdownOpen ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                  >
                    {loginDropdownOpen && <ActiveHighlight />}
                    {isLoggedIn ? (
                      <UserCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] text-zinc-200 group-hover:text-white" />
                    ) : (
                      <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px] text-zinc-200 group-hover:text-white" />
                    )}
                    <span className="relative whitespace-nowrap">
                      {isLoggedIn ? getDisplayName(currentUser) ?? "User" : "Login"}
                      <span
                        className={`pointer-events-none absolute left-0 right-0 -bottom-1 lg:-bottom-1.5 block h-0.5 rounded-full origin-left transition-all duration-300 bg-linear-to-r from-zinc-300 to-zinc-400 ${
                          loginDropdownOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${loginDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {loginDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[rgba(5,7,10,0.98)] border border-[rgba(192,192,192,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-xl py-2 z-50"
                      >
                        {isLoggedIn ? (
                          <LoggedInMenu
                            currentUser={currentUser}
                            isSuperAdmin={isSuperAdmin}
                            onNavigate={() => setLoginDropdownOpen(false)}
                            onLogout={handleLogout}
                          />
                        ) : (
                          <LoggedOutMenu onNavigate={() => setLoginDropdownOpen(false)} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="flex md:hidden">
              <button
                className="p-1.5 sm:p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D16500] hover:bg-white/5 transition-colors"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200" />
              </button>
            </div>

            <AnimatePresence>
              {mobileNavOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-16 sm:top-[68px] right-3 sm:right-4 w-[200px] sm:w-[220px] bg-[rgba(5,7,10,0.98)] border border-[rgba(192,192,192,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl z-999 flex flex-col md:hidden rounded-xl px-2 py-2"
                  onMouseLeave={handleLeave}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {[...primaryNavItems, ...exploreNavItems].map((item) => (
                    <NavItem key={item.to} {...item} active={item.isActive(pathname)} mobile />
                  ))}

                  {profileItem && <NavItem {...profileItem} active={profileItem.isActive(pathname)} mobile />}

                  <div className="border-t border-gray-600/30 mt-2 pt-2">
                    {isLoggedIn ? (
                      <>
                        <div className="px-3 py-2">
                          <div className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</div>
                          <div className="text-sm text-white font-medium">{getDisplayName(currentUser)}</div>
                          <div className="text-xs text-gray-500 capitalize">{getUserRole(currentUser)}</div>
                        </div>
                        {currentUser?.type === "admin" && (
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
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                        >
                          <LogIn className="w-[18px] h-[18px] text-red-400 rotate-180" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
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

function Brand({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 no-underline group relative border-none bg-transparent cursor-pointer p-0">
      <span className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center shrink-0">
        <span
          className="absolute inset-0 -z-10 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "radial-gradient(circle, #D16500 0%, #AF1D5D 80%)", filter: "blur(8px)" }}
        />
        <img
          src="/assets/roshanIcon.png"
          className="w-full h-full relative z-10 transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
          alt="Roshan Icon"
        />
      </span>
      <div className="flex flex-col min-w-0">
        <h1 className="relative inline-block leading-none">
          <span className="text-[0.9rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.35rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-200 via-slate-100 to-white transition-all duration-400 group-hover:bg-linear-to-r group-hover:from-[#D16500] group-hover:via-[#E4472F] group-hover:to-[#AF1D5D] whitespace-nowrap">
            The Roshan Rumble
          </span>
          <span
            className="pointer-events-none absolute inset-0 text-[0.9rem] sm:text-[1rem] md:text-[1.2rem] lg:text-[1.35rem] font-extrabold tracking-tight blur-lg opacity-30 transition-all duration-400 text-zinc-300 group-hover:text-[#E4472F] whitespace-nowrap"
            style={{ transform: "translate(-1px, -1px)" }}
          >
            The Roshan Rumble
          </span>
          <motion.div
            animate={{ x: [-40, 260], opacity: [0, 0.45, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -top-3 -left-12 w-20 sm:w-24 md:w-28 h-16 sm:h-18 md:h-20 bg-linear-to-r from-transparent via-zinc-300 to-transparent blur-2xl"
          />
        </h1>
      </div>
    </button>
  );
}

function LoggedInMenu({
  currentUser,
  isSuperAdmin,
  onNavigate,
  onLogout,
}: {
  currentUser: CurrentUser;
  isSuperAdmin: boolean;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="px-4 py-2 border-b border-gray-700">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="text-sm text-white font-medium">{getDisplayName(currentUser)}</p>
        <p className="text-xs text-gray-500 capitalize">{getUserRole(currentUser)}</p>
      </div>
      {currentUser?.type === "player" && (
        <Link to={`/players/${currentUser.playerId}`} onClick={onNavigate} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors">
          <UserCircle className="w-4 h-4 text-white" />
          <span>My Profile</span>
        </Link>
      )}
      {currentUser?.type === "admin" && (
        <Link
          to={isSuperAdmin ? "/super-admin-dashboard" : "/admin-dashboard"}
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors"
        >
          <Shield className="w-4 h-4 text-white" />
          <span>Dashboard</span>
        </Link>
      )}
      <button onClick={onLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors w-full text-left">
        <LogIn className="w-4 h-4 text-red-400 rotate-180" />
        <span>Logout</span>
      </button>
    </>
  );
}

function LoggedOutMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <Link to="/player-login" onClick={onNavigate} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors">
        <User className="w-4 h-4 text-white" />
        <span>Player Login</span>
      </Link>
      <Link to="/admin-login" onClick={onNavigate} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors">
        <Shield className="w-4 h-4 text-white" />
        <span>Admins</span>
      </Link>
    </>
  );
}

function MoreDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = exploreNavItems.some((item) => item.isActive(pathname));

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative inline-flex items-center gap-1.5 px-2 lg:px-3 py-1.5 text-[0.7rem] lg:text-[0.75rem] uppercase tracking-[0.15em] transition-all duration-300 rounded-lg ${
          isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        Explore
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl overflow-hidden z-50"
            style={{ background: "rgba(10,12,16,0.97)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            {exploreNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  pathname.startsWith(item.to) ? "text-white bg-white/8" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ to, icon, label, active, mobile = false }: NavItemConfig & { active: boolean; mobile?: boolean }) {
  if (mobile) {
    return (
      <Link to={to} className="relative flex items-center gap-3 px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 rounded-lg transition-all duration-200 group">
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-zinc-300 to-zinc-400 rounded-r-full" />}
        <span className={`transition-colors ${active ? "text-white" : "text-zinc-200"}`}>{icon}</span>
        <span className={`font-medium tracking-wide ${active ? "text-white" : ""}`}>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`relative inline-flex items-center gap-[0.3rem] md:gap-[0.35rem] px-1.5 md:px-2 lg:px-3 py-1 md:py-1.5 text-[0.65rem] md:text-[0.7rem] lg:text-[0.75rem] xl:text-[0.8rem] uppercase tracking-[0.12em] md:tracking-[0.15em] lg:tracking-[0.18em] transition-all duration-300 group rounded-lg text-zinc-200 hover:text-white ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {active && <ActiveHighlight />}
      <span className="transition-colors duration-300 text-zinc-200 group-hover:text-white">{icon}</span>
      <span className="relative whitespace-nowrap">
        {label}
        <span
          className={`pointer-events-none absolute left-0 right-0 -bottom-1 lg:-bottom-1.5 block h-0.5 rounded-full origin-left transition-all duration-300 bg-linear-to-r from-zinc-300 to-zinc-400 ${
            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </span>
    </Link>
  );
}

function ActiveHighlight() {
  return (
    <motion.div
      layoutId="activeNav"
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="absolute inset-0 -z-10 rounded-lg border border-white/30 bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.2)]"
    />
  );
}