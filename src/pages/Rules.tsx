import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Users, Clock, Server, Trophy, AlertTriangle, 
  Eye, MessageSquare, Ban, Video, Flag, UserCheck
} from "lucide-react";

export default function RulesPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentBg, setCurrentBg] = useState(0);

  // Change background every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev === 0 ? 1 : 0));
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const backgrounds = ['/Roshan1.jpg', '/Roshan2.webp'];

  const sections = [
    {
      title: "Participation",
      icon: Users,
      color: "blue",
      items: [
        "Players must register using their highest MMR account and must play all matches using the same account throughout the tournament.",
        "Captains will be selected by TRR admins and will participate in a live auction to build their teams.",
        "Each team will be assigned a dedicated voice channel on the TRR Discord server for in-game/internal communication.",
        "Only the 5 active players from each team are allowed in the voice channel at any point of time.",
        "Voice channels will be monitored by TRR admins to ensure fair play and proper communication.",
        "Players must communicate their match availability in advance to their captain.",
        "75% attendance is required to be eligible for tournament prizes.",
        "Each match in any Bo3 Series will count as an individual game towards player attendance.",
      ],
      extras: ["Handicap matches will be permitted (e.g., 2v5, 3v5, 4v5)."],
    },
    {
      title: "Teams & Captains",
      icon: Shield,
      color: "purple",
      items: [
        "Each captain must appoint a vice-captain to manage the team in their absence.",
        "Captains are responsible for managing their roster and informing admins promptly if a stand-in is needed.",
        "Players must maintain at least 75% attendance to be eligible for prizes.",
        "Captains should try to resolve minor issues internally before escalating.",
        "Expected issues must be communicated in advance to the admins.",
        "Concerns should be raised via !ticket <TeamName> <concern> in the text channels.",
        "All match lobbies will be created by TRR admins. In rare cases where a captain creates the lobby, it must include the official TRR tournament ticket.",
        "If you suspect a teammate is smurfing, report immediately to avoid full-team disqualification.",
      ],
    },
    {
      title: "Stand-ins",
      icon: UserCheck,
      color: "green",
      items: [
        "Only 1 stand-in is allowed. More than 1 requires admin approval.",
        "All stand-ins will be provided by TRR admins.",
        "Teams must notify admins at least 2 days in advance if a stand-in is needed.",
        "Last-minute stand-ins are not guaranteed to match the original player's MMR.",
        "Teams may suggest stand-ins from the official stand-in list and eliminated players, but final approval lies with admins.",
        "Stand-ins must be within 300 MMR (higher or lower) of the replaced player's registered auction MMR.",
        "If a higher MMR stand-in (beyond 300) is suggested, opposing captain approval is required in presence of both captains and an admin.",
        "Unauthorized stand-ins will result in an automatic forfeit.",
        "Only the MMR submitted during registration will be considered — not the player's updated MMR.",
      ],
      extras: [
        "Eliminated players may act as stand-ins.",
        "Active players still in the tournament cannot be used as stand-ins.",
        "Repeated absence may result in a permanent stand-in with similar MMR.",
        "A permanent stand-in becomes an official team member for the rest of the tournament and the team still has the right to 1 regular stand-in per game if needed.",
        "A player from an eliminated team who becomes a permanent stand-in after elimination will not be prize-eligible.",
        "Permanent stand-ins (excluding eliminated players) may be asked to pay the tournament fee to qualify for prizes.",
      ],
    },
    {
      title: "Server Settings",
      icon: Server,
      color: "orange",
      items: [
        "The default server is SEA (Singapore).",
        "Switching to another server (EU, India, Dubai, etc.) is only allowed with mutual agreement between both teams.",
        "Each player is responsible for confirming the selected server before the game starts.",
        "By participating in the match, players are considered to have accepted the server choice. No server-related disputes will be entertained after the game starts.",
      ],
    },
    {
      title: "Match Rules & Format",
      icon: Trophy,
      color: "yellow",
      items: [
        "All games are played in Captains Mode.",
        "Matches usually take place between 12 PM and 9 PM IST on weekends, but timings may change as per activity checks for that season.",
        "Rescheduling is not permitted unless explicitly approved by admins and it does not affect the overall tournament schedule.",
        "The tournament will follow a Double Elimination format.",
        "All teams start in the Upper Bracket.",
        "All matches will be Bo1 or Bo3 (as decided by admins for the season), except the Grand Finals, which will be Bo3.",
        "The league may follow Round Robin, Group Stage, or another format as decided by admins for that season.",
        "Group matches will be played Bo1 or Bo2 (as decided for that season).",
        "Top teams based on points will qualify for the Playoffs.",
        "Playoff matches and Grand Finals will be Bo3.",
      ],
    },
    {
      title: "Match Punctuality & Penalties",
      icon: Clock,
      color: "red",
      items: [
        "10 minutes late → Level 1 Penalty: 30-second draft penalty.",
        "15 minutes late → Level 2 Penalty: 70-second draft penalty.",
        "20 minutes late → Level 3 Penalty: 110-second draft penalty.",
        "30 minutes late → Forfeit: Opposing team is awarded a default win.",
        '"GG" should only be typed when the game is about to end and your team intends to forfeit or conclude the match. Misuse may result in penalties or the game being awarded to opponents.',
      ],
      extras: [
        "Teams will get a 15-minute rest between matches unless otherwise informed.",
        "Lobbies must include the official TRR tournament ticket.",
        "In-game pauses are limited to 15 minutes total per team and only for genuine issues.",
      ],
    },
    {
      title: "Disputes, Conduct & Discipline",
      icon: AlertTriangle,
      color: "red",
      items: [
        "All players must use non-offensive Steam names, bios, team names, and images.",
        "Post-match complaints regarding stand-ins or server issues will not be accepted.",
        "Toxic behaviour, abuse, scripting, cheating, griefing, or smurfing will result in immediate and permanent disqualification.",
        "Admin decisions are final and non-negotiable.",
        "Abusive behaviour toward teammates or admins will result in warnings, penalties, or bans.",
        "All participants are expected to uphold the no-toxicity standard and contribute to a respectful community.",
      ],
    },
    {
      title: "Discord & Player Verification",
      icon: MessageSquare,
      color: "indigo",
      items: [
        "All players must remain connected to their TRR team voice channel during matches.",
        "Players are required to keep their microphones unmuted at all times while playing, unless permitted by admins.",
        "TRR admins may conduct random mic checks at any point; failure to respond may result in penalties.",
        "Any player may be asked to screen-share during the match for verification and must be ready to do so instantly.",
        "Refusal, delays, or suspicious behaviour during verification may lead to match loss, player suspension, or full team disqualification.",
        "Players must use their official registered Discord ID during the match.",
        "Use of voice changers, artificial noise masking, or intentionally disruptive audio will result in warnings or penalties.",
        "If a player disconnects from Discord, they must re-join as soon as possible or risk penalties or forfeit.",
        "Opponents are not responsible for checking if the other team has all 5 players; pausing for this reason counts as an illegitimate pause and will be penalised.",
      ],
    },
    {
      title: "Cheating, Misconduct & Investigation",
      icon: Eye,
      color: "pink",
      items: [
        "All investigations related to smurfing, cheating, or suspicious behaviour will be conducted only by TRR admins.",
        "Players must not pause the game for smurf or cheat suspicions or for verification reasons.",
        "The game must continue normally unless an admin personally instructs a pause.",
        "All checks, reviews, or account verifications will be carried out after the match unless the admin chooses to perform an in-game check.",
        "Any attempts to request, force, or pressure for a pause or mid-game investigation will be considered misconduct and may result in penalties.",
        "False accusations, spam reporting, or misuse of investigation claims will also be penalised.",
        "If a player is found guilty of smurfing, they will be banned from all current and future TRR events with no exceptions.",
      ],
      extras: [
        "For genuine players only, and after verification, TRR may adjust a player's listed MMR for balancing using previous TRR seasons, consistency, and verified performance.",
        "During registration, every player must submit their correct highest MMR. Providing false or manipulated information is misconduct.",
      ],
    },
    {
      title: "Streaming Rule",
      icon: Video,
      color: "cyan",
      items: [
        "Players or streamers who broadcast matches must add a 5-minute delay to their stream.",
        "Admins must be informed before the season starts if you plan to stream.",
        "Any stream must clearly display the TRR logo, identifying the match as part of The Roshan Rumble.",
        "TRR reserves the right to feature or restream gameplay on official channels.",
      ],
    },
    {
      title: "Forfeit Rule",
      icon: Flag,
      color: "gray",
      items: [
        "If a team stops playing further matches, their past results (wins/draws) will remain.",
        "All upcoming matches for that team will be considered forfeited.",
        "Teams must inform admins before withdrawing.",
        "Forfeiting to give advantage to another team may lead to bans from future TRR seasons.",
      ],
    },
    {
      title: "Profile Standards",
      icon: Ban,
      color: "red",
      items: [
        "NSFW, obscene, sexual, or inappropriate usernames are strictly not allowed.",
        "Profile pictures must not contain nudity, sexual content, offensive symbols, or explicit imagery.",
        "Any profile found violating this rule may be asked to change immediately.",
        "Failure to update an inappropriate name or profile picture can result in warnings, match disqualification, or removal from the tournament.",
        "Repeated or intentional violations may lead to bans from current and future TRR seasons.",
      ],
    },
  ];

  return (
    <>
      {/* Animated Background Images - Fixed to cover entire page */}
      <div className="fixed inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <div
            key={bg}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500 ease-in-out"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: index === currentBg ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Dark overlay for readability - Fixed to cover entire page */}
      <div className="fixed inset-0 bg-black/70 z-[1]" />

      <main 
        className="relative min-h-screen pt-24 pb-12 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden z-10"
      >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 bg-gradient-to-r from-zinc-200 via-yellow-200 to-zinc-300 bg-clip-text text-transparent px-2">
            Tournament Rules
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-zinc-300 mb-4 px-2 leading-relaxed">
            Playing in the event means you agree to all rules listed below.
          </p>
        </motion.div>

        {/* Rules List - Single Column */}
        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setExpandedIndex(index)}
              onMouseLeave={() => setExpandedIndex(null)}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className={`relative rounded-xl sm:rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer backdrop-blur-sm ${
                expandedIndex === index
                  ? 'border-yellow-400/50 bg-black/60 shadow-[0_0_30px_rgba(250,204,21,0.25)] sm:shadow-[0_0_40px_rgba(250,204,21,0.3)] scale-[1.01] sm:scale-[1.02]'
                  : 'border-zinc-700/50 bg-black/40 hover:border-zinc-600/50 hover:bg-black/50'
              }`}
            >
              {/* Header - Always Visible with Golden Numbers and Silver Text */}
              <div className="p-3 sm:p-4 md:p-5 flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base flex-shrink-0 transition-all duration-500 bg-gradient-to-br from-yellow-400 to-yellow-600 text-zinc-900 ${
                    expandedIndex === index
                      ? 'shadow-[0_0_15px_rgba(250,204,21,0.4)] sm:shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105 sm:scale-110'
                      : 'shadow-[0_0_10px_rgba(250,204,21,0.25)] sm:shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h2
                  className={`text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide transition-all duration-500 text-zinc-200 ${
                    expandedIndex === index ? 'scale-[1.02] sm:scale-105 text-zinc-100' : ''
                  }`}
                >
                  {section.title}
                </h2>
              </div>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5 pt-1 sm:pt-2">
                    <ul className="space-y-1.5 sm:space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-300">
                          <span className="mt-1.5 sm:mt-2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {section.extras && (
                      <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 pl-2 sm:pl-3 border-l-2 border-zinc-600">
                        {section.extras.map((extra, i) => (
                          <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[0.65rem] sm:text-xs text-zinc-400 italic">
                            <span className="mt-1 sm:mt-1.5 w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-sm border border-zinc-500 flex-shrink-0" />
                            <span className="leading-relaxed">{extra}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
