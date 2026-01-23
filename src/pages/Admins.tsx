import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
];

const miniAdmins: Member[] = [
  { name: "Banner", realName: "Nav Sharma", role: "Lobby Manager & Caster", bio: "The backbone of match flow, ensuring smooth lobbies and assists with live match casting.", image: "/avatars/admins/banner.png", nameColor: "#F6F556" },
  { name: "InsaneKid", realName: "Siddhesh Naringrikar", role: "Match Coordinator & Caster", bio: "Keeps matches organized and supports the broadcast behind the scenes.", image: "/avatars/admins/insane.jpg", nameColor: "#A855F7" },
  { name: "Fatty", realName: "Shreejan Mishra", role: "UI/UX Developer", bio: "Provided consultation and helped in designing the UX and implementing the UI features.", image: "/avatars/admins/fatty.jpg", nameColor: "#d6cbea", githubUrl: "https://github.com/shreejanmishra" },
  { name: "Scripter", realName: "Anubhav Kumar", role: "Database-Coordinator", bio: "Manages, organizes, and maintains all data systems.", image: "/avatars/admins/scripter.jpg", nameColor: "#EC4899", githubUrl: "https://github.com/anubhav5079" },
  { name: "HaVoK4EvR", realName: "Gaurav", role: "Streamer & Caster", bio: "Handles live commentary, streams, and audience engagement.", image: "/avatars/admins/havok.jpg", nameColor: "#EAB308", twitch: "https://www.twitch.tv/havok4evr" },
];

/* ================= BACKGROUND SCENE ================= */
function BackgroundScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <color attach="background" args={["#05070a"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles count={50} scale={15} size={2} speed={0.4} color={VIVID_VIOLET} />
    </Canvas>
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
}: {
  m: Member;
  isSmall?: boolean;
  index?: number;
  onEyeClick?: () => void;
  onEyeHover?: () => void;
  onEyeLeave?: () => void;
  currentPhase?: number;
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
      className="relative flex flex-col rounded-2xl overflow-hidden mx-auto shrink-0 w-full max-w-[90vw] sm:max-w-[340px] md:max-w-[300px] lg:max-w-[280px] xl:max-w-[300px]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={handleCardClick}
      style={{
        minHeight: isSmall ? "380px" : "420px",
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

      <div className="relative overflow-hidden h-[60%] rounded-t-2xl">
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

      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-center relative z-10 rounded-b-2xl">
        <motion.p 
          className="text-xs uppercase tracking-widest mb-2" 
          animate={{ 
            color: isHovered ? nameColor : "#a0a0a0",
            letterSpacing: isHovered ? "0.2em" : "0.1em"
          }}
          transition={{ duration: 0.3 }}
        >
          {m.tag ?? m.role}
        </motion.p>
        <div className="mb-3">
          <motion.h3 
            className="text-xl sm:text-2xl font-extrabold mb-1" 
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
          className="text-xs sm:text-sm text-gray-300"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          {m.bio}
        </motion.p>
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
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain drop-shadow-lg"
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

/* ================= ZIGZAG LAYOUT ================= */
function ZigzagLayout({
  items,
  isSmall = false,
  startIndex = 0,
  onEyeClick,
  onEyeHover,
  onEyeLeave,
  currentPhase = 0,
}: {
  items: Member[];
  isSmall?: boolean;
  startIndex: number;
  onEyeClick?: () => void;
  onEyeHover?: () => void;
  onEyeLeave?: () => void;
  currentPhase?: number;
}) {
  // Always show 3 cards in first row for items.length === 5
  const firstRowCount = items.length === 5 ? 3 : Math.min(items.length, 3);
  
  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 w-full">
      {/* First row - wraps on mobile, no-wrap on larger screens */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 sm:gap-8 md:gap-10 w-full max-w-7xl">
        {items.slice(0, firstRowCount).map((item, idx) => (
          <SilverGlassCard
            key={item.name}
            m={item}
            isSmall={isSmall}
            index={startIndex + idx}
            onEyeClick={onEyeClick}
            onEyeHover={onEyeHover}
            onEyeLeave={onEyeLeave}
            currentPhase={currentPhase}
          />
        ))}
      </div>

      {/* Second row - wraps on mobile, no-wrap on larger screens */}
      {items.length > firstRowCount && (
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6 sm:gap-8 md:gap-10 w-full max-w-7xl">
          {items.slice(firstRowCount).map((item, idx) => (
            <SilverGlassCard
              key={item.name}
              m={item}
              isSmall={isSmall}
              index={startIndex + firstRowCount + idx}
              onEyeClick={onEyeClick}
              onEyeHover={onEyeHover}
              onEyeLeave={onEyeLeave}
              currentPhase={currentPhase}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function AdminsPage() {
  const [currentEyePhase, setCurrentEyePhase] = useState(0);
  const [isEyeHovered, setIsEyeHovered] = useState(false);
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
      
      // If reaching the final phase, navigate to Super Admin Dashboard
      if (next >= EYE_PHASES.length) {
        // Add a small delay for dramatic effect
        setTimeout(() => {
          navigate('/super-admin');
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

  return (
    <>
      <BackgroundScene />

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

      <main className="min-h-screen pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 md:space-y-24">
          <section className="text-center mt-8 sm:mt-12 md:mt-16">
            <SilverEpicHeader>✦ FOUNDER ✦</SilverEpicHeader>
            <div className="flex justify-center">
              <SilverGlassCard m={founder} isSmall={false} index={0} />
            </div>
          </section>

          <section>
            <SilverEpicHeader>⚡ ADMINS ⚡</SilverEpicHeader>
            <ZigzagLayout
              items={admins}
              isSmall={true}
              startIndex={1}
              onEyeClick={handleEyeClick}
              onEyeHover={handleEyeHover}
              onEyeLeave={handleEyeLeave}
              currentPhase={currentEyePhase}
            />
          </section>

          <section>
            <SilverEpicHeader>✨ MINI ADMINS ✨</SilverEpicHeader>
            <ZigzagLayout
              items={miniAdmins}
              isSmall={true}
              startIndex={admins.length + 1}
              onEyeClick={handleEyeClick}
              onEyeHover={handleEyeHover}
              onEyeLeave={handleEyeLeave}
              currentPhase={currentEyePhase}
            />
          </section>
        </div>
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