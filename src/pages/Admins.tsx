import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import MessageModal from "../components/ui/MessageModal";

/* ================= THEME ================= */
const VIVID_VIOLET = "#8A2BE2";
const LIGHT_VIOLET = "#DDA0DD";
const VIOLET_GLOW = "rgba(138, 43, 226, 0.28)";
const SILVER = "#C0C0C0";
const SHADOW_SILVER = "rgba(192, 192, 192, 0.16)";

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

/* ================= SIMPLE BACKGROUND ================= */
function SimpleBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/bg6.webp)' }}
      />
      <div className="absolute inset-0 bg-black/70" />
      {/* Simple animated particles using CSS */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <div
            key={`blue-${i}`}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */
function SilverGlassCard({
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
  const nameColor = m.nameColor || SILVER;
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
    <motion.article
      ref={cardRef}
      className="relative flex flex-col rounded-2xl overflow-hidden mx-auto shrink-0 w-full max-w-[160px]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={handleCardClick}
      style={{
        minHeight: isSmall ? "240px" : "280px",
        background: "linear-gradient(145deg, rgba(192,192,192,0.08), rgba(5,7,10,0.98))",
        border: "1px solid rgba(192,192,192,0.2)",
        boxShadow: isFounder 
          ? `0 0 50px ${VIOLET_GLOW}, 0 10px 35px rgba(0,0,0,0.5)` 
          : `0 10px 35px ${SHADOW_SILVER}`,
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? `inset 0 0 20px ${nameColor}44, 0 0 30px ${nameColor}33`
            : "inset 0 0 0px transparent, 0 0 0px transparent"
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Gradient overlay shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.6 }}
        style={{
          background: `linear-gradient(135deg, ${nameColor}11 0%, transparent 50%, ${nameColor}11 100%)`
        }}
      />

      <div className="relative overflow-hidden h-[55%] rounded-t-2xl">
        <motion.img
          src={m.image}
          alt={m.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.15 : 1,
            filter: isHovered ? "brightness(1.3) contrast(1.1)" : "brightness(1) contrast(1)",
          }}
          transition={{ duration: 0.5 }}
          onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.realName || m.name)}&background=${nameColor.slice(1)}&color=fff`)}
        />
        
        {/* Scan line effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${nameColor}22 50%, transparent 100%)`,
              height: "30%",
            }}
          />
        )}
      </div>

      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between text-center relative z-10 rounded-b-2xl">
        <motion.p 
          className="text-xs uppercase tracking-widest mb-1" 
          animate={{ 
            color: isHovered ? nameColor : "#a0a0a0",
            letterSpacing: isHovered ? "0.2em" : "0.1em"
          }}
          transition={{ duration: 0.3 }}
        >
          {m.tag ?? m.role}
        </motion.p>
        <div className="mb-2">
          <motion.h3 
            className="text-sm sm:text-base font-extrabold mb-1" 
            style={{ color: nameColor }}
            animate={{
              textShadow: isHovered 
                ? `0 0 20px ${nameColor}88, 0 0 40px ${nameColor}44`
                : "0 0 0px transparent"
            }}
          >
            {m.name}
          </motion.h3>
          {m.realName && (
            <motion.p 
              className="text-xs italic text-gray-400"
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              {m.realName}
            </motion.p>
          )}
        </div>
        <motion.p 
          className="text-xs text-gray-300 leading-tight"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          {m.bio}
        </motion.p>

        {/* Message Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onMessageClick?.();
          }}
          className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg text-xs transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare className="w-3 h-3" />
          <span>Message</span>
        </motion.button>
      </div>

      {m.isSpecial && (
        <SpecialEyeBadge
          onClick={onEyeClick}
          onMouseEnter={onEyeHover}
          onMouseLeave={onEyeLeave}
          currentPhase={currentPhase}
        />
      )}
    </motion.article>
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
  const [spinSpeed, setSpinSpeed] = useState(6);
  const currentEye = EYE_PHASES[currentPhase];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Super fast spin on click
    setSpinSpeed(0.3);
    
    // After a brief moment, trigger the phase change
    setTimeout(() => {
      onClick?.();
      // Return to hover speed if still hovering, otherwise normal
      setSpinSpeed(isHovered ? 3 : 6);
    }, 300);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (spinSpeed === 6) setSpinSpeed(3); // Only change if at normal speed
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (spinSpeed !== 0.3) setSpinSpeed(6); // Only change if not in click animation
    onMouseLeave?.();
  };

  return (
    <div className="absolute top-1 left-2 z-40">
      <motion.div
        className="cursor-pointer pointer-events-auto"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.img
          src={currentEye.src}
          alt={`Eye Phase ${currentPhase + 1}`}
          className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-lg"
          animate={{
            filter: isHovered
              ? `drop-shadow(0 0 50px ${currentEye.glowColor}) brightness(1.95) contrast(1.45)`
              : `drop-shadow(0 0 22px ${currentEye.glowColor})`,
            rotate: 360,
          }}
          transition={{
            rotate: {
              duration: spinSpeed,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            },
            filter: {
              duration: 0.3,
            }
          }}
        />

        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.95, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentEye.glowColor}aa, transparent 65%)`,
              filter: "blur(14px)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ================= HEADER ================= */
function SilverEpicHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      className="text-center mb-8 sm:mb-12 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text relative px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        backgroundImage: `linear-gradient(45deg, ${VIVID_VIOLET}, ${LIGHT_VIOLET}, ${VIVID_VIOLET})`,
        backgroundSize: "200% auto",
        animation: "shimmer 3s linear infinite",
        filter: `drop-shadow(0 0 20px ${VIOLET_GLOW})`,
      }}
    >
      {children}
    </motion.h2>
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
  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const currentEye = EYE_PHASES[currentEyePhase];

  const playSound = (soundPath: string) => {
    // Stop the previous sound if it's still playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(soundPath);
    audio.currentTime = 0;
    
    // Lower volume for phases 4 and 5 (indices 3 and 4)
    if (currentEyePhase >= 3) {
      audio.volume = 0.5;
    } else {
      audio.volume = 0.8;
    }
    
    audioRef.current = audio;
    audio.play().catch(e => console.log("Audio failed:", e));
  };

  const handleEyeClick = () => {
    playSound(currentEye.sound);

    setCurrentEyePhase(prev => {
      const next = prev + 1;
      
      // If reaching the final phase, navigate to super admin login with Nikhil pre-selected
      if (next >= EYE_PHASES.length) {
        // Add a small delay for dramatic effect, then navigate to login
        setTimeout(() => {
          navigate('/super-admin-login', { state: { preselectedUser: 'nikhil' } });
        }, 1000);
        return prev; // Keep current phase during transition
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

  // Cleanup audio on unmount
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
      <SimpleBackground />

      {/* Full page distortion overlay - dramatic effect when eye is hovered */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isEyeHovered ? 0.35 + currentEyePhase * 0.15 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          background: `
            radial-gradient(circle at 20% 10%, ${currentEye.glowColor}99, transparent 40%),
            radial-gradient(circle at 80% 90%, ${currentEye.glowColor}66, transparent 50%),
            radial-gradient(circle at 50% 50%, ${currentEye.glowColor}44, transparent 60%)
          `,
          mixBlendMode: "screen",
          filter: "blur(80px)",
        }}
      />

      {/* Animated distortion waves */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isEyeHovered ? 0.25 : 0,
          scale: isEyeHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background: `repeating-radial-gradient(
            circle at 20% 10%,
            transparent 0px,
            ${currentEye.glowColor}33 50px,
            transparent 100px
          )`,
          mixBlendMode: "overlay",
          filter: "blur(20px)",
        }}
      />

      {/* Pulsing vignette effect */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        animate={{
          opacity: isEyeHovered ? [0.2, 0.4, 0.2] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isEyeHovered ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, ${currentEye.glowColor}22 80%, ${currentEye.glowColor}44 100%)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Chromatic aberration effect - Red channel */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        animate={{
          opacity: isEyeHovered ? 0.15 : 0,
          x: isEyeHovered ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.6 },
          x: { duration: 0.3, repeat: isEyeHovered ? Infinity : 0 },
        }}
        style={{
          background: `radial-gradient(circle at 20% 10%, #ff000033, transparent 40%)`,
          mixBlendMode: "screen",
          filter: "blur(10px)",
        }}
      />
      
      {/* Chromatic aberration effect - Blue channel */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        animate={{
          opacity: isEyeHovered ? 0.15 : 0,
          x: isEyeHovered ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.6 },
          x: { duration: 0.3, repeat: isEyeHovered ? Infinity : 0 },
        }}
        style={{
          background: `radial-gradient(circle at 20% 10%, #0000ff33, transparent 40%)`,
          mixBlendMode: "screen",
          filter: "blur(10px)",
        }}
      />

      <main className="admins-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
            <section className="text-center mt-8 sm:mt-12">
              <SilverEpicHeader>✦ FOUNDER ✦</SilverEpicHeader>
              <div className="flex justify-center mb-8">
                <div className="w-[200px]">
                  <SilverGlassCard 
                    m={founder} 
                    isSmall={false} 
                    index={0} 
                    onMessageClick={() => handleMessageClick(founder.name, founder.name)}
                  />
                </div>
              </div>
            </section>

            <section>
              <SilverEpicHeader>⚡ ADMINS ⚡</SilverEpicHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center mb-8">
                {admins.map((admin, idx) => (
                  <SilverGlassCard
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

            <section>
              <SilverEpicHeader>✨ MINI ADMINS ✨</SilverEpicHeader>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center mb-8">
                {miniAdmins.map((miniAdmin, idx) => (
                  <SilverGlassCard
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

        {/* Message Modal */}
        <MessageModal
          isOpen={messageModal.isOpen}
          onClose={closeMessageModal}
          adminName={messageModal.adminName}
          adminDisplayName={messageModal.adminDisplayName}
        />
      </main>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @keyframes shimmer { to { background-position: 200% center; } }
        html { scroll-behavior: smooth; }
      `}</style>
    </>
  );
}