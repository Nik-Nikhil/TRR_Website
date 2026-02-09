import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/ToastContainer";
import MessageModal from "../components/ui/MessageModal";
import PasswordChangeModal from "../components/ui/PasswordChangeModal";
import { Lock } from "lucide-react";

/* ================= THEME ================= */
const NEON_RED = "#FF0040";
const NEON_PINK = "#FF0080";
const NEON_VIOLET = "#8A2BE2";
const NEON_CYAN = "#00FFFF";
const ELECTRIC_BLUE = "#4169E1";

/* ================= EYE PHASES ================= */
const EYE_PHASES = [
  { id: 0, src: "/avatars/eye1.png", sound: "/avatars/eye1.mp3",    glowColor: "#FF0000" },
  { id: 1, src: "/avatars/eye2.png", sound: "/avatars/eye2.mp3",    glowColor: "#FF2222" },
  { id: 2, src: "/avatars/eye3.png", sound: "/avatars/eye3.mp3",    glowColor: "#FF4444" },
  { id: 3, src: "/avatars/eye4.png", sound: "/avatars/eye4.mp3",    glowColor: "#FF6666" },
  { id: 4, src: "/avatars/eye5.png", sound: "/avatars/eye5.mp3",    glowColor: "#FFBCD6" },
] as const;

/* ================= TYPES ================= */
type Member = {
  name: string;
  realName?: string;
  role: string;
  bio: string;
  image: string;
  tag?: string;
  isSpecial?: boolean;
  nameColor?: string;
  githubUrl?: string;
  twitch?: string;
};

/* ================= DATA ================= */
const founder: Member = {
  name: "Reyuk",
  realName: "Keyur Sankhe",
  role: "Founder",
  tag: "Vision & Direction",
  bio: "Founder of TRR. Oversees tournaments, systems, and structure.",
  image: "/avatars/admins/reyuk.png",
  nameColor: "#FF4500",
};

const admins: Member[] = [
  { name: "r3ciprocal", realName: "Darshil Patel", role: "Admin", tag: "Lead Organizer", bio: "Handles competitive integrity, rules, and match operations.", image: "/avatars/admins/r3ciprocal.jpg", nameColor: "#4169E1" },
  { name: "Frost", realName: "Clint Mendes", role: "Admin", tag: "Tournament Coordinator", bio: "Oversees tournament flow, manages formats, and ensures smooth competition.", image: "/avatars/admins/Frost.png", nameColor: "#06B6D4" },
  { name: "Machine", realName: "Nisarg Parikh", role: "Admin", tag: "Lead Operator", bio: "Tournament logistics, coordination, and enforcement.", image: "/avatars/admins/Machine.png", nameColor: "#07E4BE" },
  { name: "N1KHIL", realName: "Nikhil Kumar Singh", role: "Admin", tag: "Tech Ops Lead", bio: "Handles Discord server management and website maintenance.", image: "/avatars/admins/Nikhil.jpg", isSpecial: true, nameColor: "#A855F7" },
  { name: "Godspeed", realName: "Aby Alexander", role: "Admin", tag: "Funds Administrator", bio: "Manages tournament funds, prize distribution, and financial accuracy.", image: "/avatars/admins/Godspeed.jpg", nameColor: "#F59E0B" },
  { name: "Banner", realName: "Nav Sharma", role: "Admin", tag: "Lobby Manager & Caster", bio: "The backbone of match flow, ensuring smooth lobbies and assists with live match casting.", image: "/avatars/admins/banner.png", nameColor: "#F6F556" },
];

const miniAdmins: Member[] = [
  { name: "InsaneKid", realName: "Siddhesh Naringrikar", role: "Match Coordinator & Caster", bio: "Keeps matches organized and supports the broadcast behind the scenes.", image: "/avatars/admins/insane.jpg", nameColor: "#A855F7" },
  { name: "Fatty", realName: "Shreejan Mishra", role: "UI/UX Developer", bio: "Provided consultation and helped in designing the UX and implementing the UI features.", image: "/avatars/admins/fatty.jpg", nameColor: "#d6cbea", githubUrl: "https://github.com/shreejanmishra" },
  { name: "Scripter", realName: "Anubhav Kumar", role: "Database-Coordinator", bio: "Manages, organizes, and maintains all data systems.", image: "/avatars/admins/scripter.jpg", nameColor: "#EC4899", githubUrl: "https://github.com/anubhav5079" },
  { name: "HaVoK4EvR", realName: "Gaurav", role: "Streamer & Caster", bio: "Handles live commentary, streams, and audience engagement.", image: "/avatars/admins/havok.jpg", nameColor: "#EAB308", twitch: "https://www.twitch.tv/havok4evr" },
];

/* ================= CYBERPUNK BACKGROUND ================= */
function CyberpunkBackground() {
  return (
    <>
      {/* Animated Grid Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(138, 43, 226, 0.02) 49px, rgba(138, 43, 226, 0.02) 50px),
            repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(138, 43, 226, 0.02) 49px, rgba(138, 43, 226, 0.02) 50px),
            radial-gradient(ellipse at 20% 30%, rgba(255, 0, 64, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(0, 255, 255, 0.04) 0%, transparent 50%),
            linear-gradient(180deg, #0A0118 0%, #1A0B2E 100%)
          `
        }}
      />
      
      {/* Floating Particles */}
      <div id="particles" className="fixed inset-0 z-[1] pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const colors = [NEON_RED, NEON_PINK, NEON_VIOLET, NEON_CYAN, ELECTRIC_BLUE];
          return (
            <div
              key={i}
              className="absolute rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: colors[Math.floor(Math.random() * colors.length)],
                filter: 'blur(1px)',
                animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          );
        })}
      </div>
    </>
  );
}

/* ================= CARD COMPONENT ================= */
function CyberpunkCard({
  m,
  isSmall = false,
  index = 0,
  onEyeClick,
  onEyeHover,
  onEyeLeave,
  currentPhase = 0,
  onMessageClick,
}: {
  m: Member;
  isSmall?: boolean;
  index?: number;
  onEyeClick?: () => void;
  onEyeHover?: () => void;
  onEyeLeave?: () => void;
  currentPhase?: number;
  onMessageClick?: () => void;
}) {
  const isFounder = m.role === "Founder";
  const nameColor = m.nameColor || "#C0C0C0";
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (m.githubUrl) {
      window.open(m.githubUrl, "_blank", "noopener,noreferrer");
    } else if (m.twitch) {
      window.open(m.twitch, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      ref={cardRef}
      className="relative flex flex-col rounded-[16px] overflow-hidden mx-auto w-full transition-all duration-[400ms] cursor-pointer backdrop-blur-[10px]"
      style={{
        maxWidth: "240px",
        background: "rgba(15, 10, 30, 0.7)",
        border: `1px solid ${isHovered ? nameColor : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isHovered 
          ? `0 15px 40px -15px ${nameColor}66, inset 0 0 20px rgba(255, 255, 255, 0.03)`
          : "0 5px 15px rgba(0, 0, 0, 0.3)",
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        animation: `cardFadeIn 0.8s ease-out backwards ${index * 0.1}s`,
        color: nameColor
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Subtle border glow */}
      <div 
        className="absolute inset-0 rounded-[16px] pointer-events-none transition-opacity duration-[400ms]"
        style={{
          background: `linear-gradient(135deg, ${nameColor}22, transparent)`,
          opacity: isHovered ? 0.3 : 0
        }}
      />

      {/* Card Image */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          paddingTop: "100%",
          background: "linear-gradient(135deg, rgba(138, 43, 226, 0.05), rgba(0, 0, 0, 0.4))"
        }}
      >
        <img
          src={m.image}
          alt={m.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-[600ms]"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            filter: isHovered 
              ? "grayscale(0) contrast(1.2) brightness(1.05)" 
              : "grayscale(0.2) contrast(1.1)"
          }}
          onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.realName || m.name)}&background=${nameColor.slice(1)}&color=fff&size=400`)}
        />
        
        {/* Subtle Overlay on Hover */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${nameColor}11 50%, transparent 100%)`,
            opacity: isHovered ? 0.5 : 0
          }}
        />
      </div>

      {/* Card Content */}
      <div className="p-[16px] relative flex flex-col" style={{ minHeight: "200px" }}>
        <div className="text-[0.65rem] tracking-[0.15em] uppercase text-white/60 mb-[6px] font-medium text-center">
          {m.tag ?? m.role}
        </div>
        
        <h3 
          className="text-[1.2rem] font-bold mb-[4px] transition-all duration-300 text-center"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: nameColor,
            textShadow: isHovered 
              ? `0 0 20px ${nameColor}88`
              : "none"
          }}
        >
          {m.name}
        </h3>
        
        {m.realName && (
          <p className="text-[0.7rem] italic text-white/70 mb-[8px] text-center">
            {m.realName}
          </p>
        )}
        
        <p className="text-[0.7rem] leading-[1.4] text-white/80 mb-[12px] flex-grow text-center">
          {m.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-[5px] mt-auto">
          {(m.githubUrl || m.twitch) && (
            <a
              href={m.githubUrl || m.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 p-[9px] text-center rounded-[6px] font-semibold text-[0.65rem] tracking-[0.05em] uppercase transition-all duration-300 relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${nameColor}`,
                color: nameColor,
                minWidth: "80px"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="relative z-10">{m.githubUrl ? "GitHub" : "Twitch"}</span>
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessageClick?.();
            }}
            className="flex-1 p-[9px] text-center rounded-[6px] font-semibold text-[0.65rem] tracking-[0.05em] uppercase transition-all duration-300 relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${nameColor}`,
              color: nameColor,
              minWidth: "80px"
            }}
          >
            <span className="relative z-10">Message</span>
          </button>
        </div>
      </div>

      {m.isSpecial && (
        <SpecialEyeBadge
          onClick={onEyeClick}
          onMouseEnter={onEyeHover}
          onMouseLeave={onEyeLeave}
          currentPhase={currentPhase}
        />
      )}
    </article>
  );
}

/* ================= EVOLVING EYE ================= */
function SpecialEyeBadge({
  onClick,
  onMouseEnter,
  onMouseLeave,
  currentPhase = 0,
}: {
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentPhase?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const currentEye = EYE_PHASES[currentPhase];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <div className="absolute top-[10px] left-[10px] z-10">
      <div
        className="cursor-pointer pointer-events-auto w-[60px] h-[60px] transition-all duration-300"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          filter: `drop-shadow(0 0 25px ${currentEye.glowColor})`,
          animation: `badgeSpin 8s linear infinite, badgePulse 2s ease-in-out infinite`,
          transform: isHovered ? "scale(1.25)" : "scale(1)"
        }}
      >
        <img
          src={currentEye.src}
          alt={`Eye Phase ${currentPhase + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

/* ================= HEADER ================= */
function CyberpunkHeader({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <h2
      className="text-center mb-[40px] text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-[0.1em] relative inline-block left-1/2"
      style={{
        fontFamily: "'Orbitron', sans-serif",
        color: color,
        textShadow: `0 0 15px ${color}66`,
        transform: "translateX(-50%)"
      }}
    >
      {children}
    </h2>
  );
}

/* ================= MAIN PAGE ================= */
export default function AdminsPage() {
  const [currentEyePhase, setCurrentEyePhase] = useState(0);
  const [isEyeHovered, setIsEyeHovered] = useState(false);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; adminName: string; adminDisplayName: string }>({
    isOpen: false,
    adminName: '',
    adminDisplayName: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { toasts, info, success, error, removeToast } = useToast();
  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const currentEye = EYE_PHASES[currentEyePhase];

  const playSound = (soundPath: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(soundPath);
    audio.currentTime = 0;
    
    if (currentEyePhase >= 3) {
      audio.volume = 0.5;
    } else {
      audio.volume = 0.8;
    }
    
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  const handleEyeClick = () => {
    playSound(currentEye.sound);

    setCurrentEyePhase(prev => {
      const next = prev + 1;
      
      if (next >= EYE_PHASES.length) {
        setTimeout(() => {
          navigate('/super-admin-login', { state: { preselectedUser: 'nikhil' } });
        }, 1000);
        return prev;
      }
      
      return next;
    });
  };

  useEffect(() => {
    if (currentEyePhase === EYE_PHASES.length - 1) {
      timeoutRef.current = window.setTimeout(() => {
        setCurrentEyePhase(0);
      }, 30000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentEyePhase]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEyeHover = () => setIsEyeHovered(true);
  const handleEyeLeave = () => setIsEyeHovered(false);

  const handleMessageClick = (adminName: string, adminDisplayName: string) => {
    setMessageModal({
      isOpen: true,
      adminName: adminName.toLowerCase(),
      adminDisplayName
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      isOpen: false,
      adminName: '',
      adminDisplayName: ''
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={closeMessageModal}
        adminName={messageModal.adminName}
        adminDisplayName={messageModal.adminDisplayName}
      />
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={(message) => {
          success('Password Changed', message);
          setShowPasswordModal(false);
        }}
        onError={(message) => error('Error', message)}
      />
      
      <CyberpunkBackground />

      {/* Eye hover effects */}
      {isEyeHovered && (
        <>
          <div
            className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-[800ms]"
            style={{
              background: `
                radial-gradient(circle at 20% 10%, ${currentEye.glowColor}99, transparent 40%),
                radial-gradient(circle at 80% 90%, ${currentEye.glowColor}66, transparent 50%),
                radial-gradient(circle at 50% 50%, ${currentEye.glowColor}44, transparent 60%)
              `,
              mixBlendMode: "screen",
              filter: "blur(80px)",
              opacity: 0.35 + currentEyePhase * 0.15
            }}
          />
          
          <div
            className="fixed inset-0 z-40 pointer-events-none transition-all duration-[1200ms]"
            style={{
              background: `repeating-radial-gradient(
                circle at 20% 10%,
                transparent 0px,
                ${currentEye.glowColor}33 50px,
                transparent 100px
              )`,
              mixBlendMode: "overlay",
              filter: "blur(20px)",
              opacity: 0.25,
              transform: "scale(1.2)"
            }}
          />
        </>
      )}

      <main className="relative py-1 pt-24">
        <div className="relative z-10">
          {/* Password Change Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>

          <div className="max-w-[1400px] mx-auto px-5">
            {/* Founder Section */}
            <section className="mb-[50px]">
              <CyberpunkHeader color={NEON_RED}>◢ FOUNDER ◣</CyberpunkHeader>
              <div className="flex justify-center">
                <CyberpunkCard 
                  m={founder} 
                  isSmall={false} 
                  index={0} 
                  onMessageClick={() => handleMessageClick(founder.name, founder.name)}
                />
              </div>
            </section>

            {/* Admins Section */}
            <section className="mb-[50px]">
              <CyberpunkHeader color={ELECTRIC_BLUE}>◢ ADMINS ◣</CyberpunkHeader>
              <div className="grid grid-cols-3 gap-8 max-w-[800px] mx-auto justify-items-center">
                {admins.map((admin, idx) => (
                  <CyberpunkCard
                    key={admin.name}
                    m={admin}
                    isSmall={true}
                    index={1 + idx}
                    onEyeClick={handleEyeClick}
                    onEyeHover={handleEyeHover}
                    onEyeLeave={handleEyeLeave}
                    currentPhase={currentEyePhase}
                    onMessageClick={() => handleMessageClick(admin.name, admin.name)}
                  />
                ))}
              </div>
            </section>

            {/* Mini Admins Section */}
            <section className="mb-[50px]">
              <CyberpunkHeader color={NEON_VIOLET}>◢ MINI ADMINS ◣</CyberpunkHeader>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-[1050px] mx-auto justify-items-center">
                {miniAdmins.map((miniAdmin, idx) => (
                  <CyberpunkCard
                    key={miniAdmin.name}
                    m={miniAdmin}
                    isSmall={true}
                    index={admins.length + 1 + idx}
                    onEyeClick={handleEyeClick}
                    onEyeHover={handleEyeHover}
                    onEyeLeave={handleEyeLeave}
                    currentPhase={currentEyePhase}
                    onMessageClick={() => handleMessageClick(miniAdmin.name, miniAdmin.name)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -20px) scale(1.05); opacity: 0.5; }
          50% { transform: translate(-10px, -40px) scale(0.95); opacity: 0.2; }
          75% { transform: translate(-20px, -30px) scale(1.02); opacity: 0.4; }
        }
        
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes badgeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes badgePulse {
          0%, 100% { filter: drop-shadow(0 0 20px currentColor); }
          50% { filter: drop-shadow(0 0 35px currentColor) brightness(1.4); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { 
            animation-duration: 0.01ms !important; 
            transition-duration: 0.01ms !important; 
          }
        }
        
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}