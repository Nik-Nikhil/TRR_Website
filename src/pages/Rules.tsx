import { motion } from "framer-motion";

export default function RulesPage() {
  const sections = [
    {
      title: "Participation",
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
      items: [
        "Only 1 stand-in is allowed. More than 1 requires admin approval.",
        "All stand-ins will be provided by TRR admins.",
        "Teams must notify admins at least 2 days in advance if a stand-in is needed.",
        "Last-minute stand-ins are not guaranteed to match the original player's MMR.",
        "Teams may suggest stand-ins from the official stand-in list and eliminated players, but final approval lies with admins.",
        "Stand-ins must be within 300 MMR (higher or lower) of the replaced player’s registered auction MMR.",
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
      items: [
        "The default server is SEA (Singapore).",
        "Switching to another server (EU, India, Dubai, etc.) is only allowed with mutual agreement between both teams.",
        "Each player is responsible for confirming the selected server before the game starts.",
        "By participating in the match, players are considered to have accepted the server choice. No server-related disputes will be entertained after the game starts.",
      ],
    },
    {
      title: "Match Rules & Format",
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
      items: [
        "10 minutes late → Level 1 Penalty: 30-second draft penalty.",
        "15 minutes late → Level 2 Penalty: 70-second draft penalty.",
        "20 minutes late → Level 3 Penalty: 110-second draft penalty.",
        "30 minutes late → Forfeit: Opposing team is awarded a default win.",
        "“GG” should only be typed when the game is about to end and your team intends to forfeit or conclude the match. Misuse may result in penalties or the game being awarded to opponents.",
      ],
      extras: [
        "Teams will get a 15-minute rest between matches unless otherwise informed.",
        "Lobbies must include the official TRR tournament ticket.",
        "In-game pauses are limited to 15 minutes total per team and only for genuine issues.",
      ],
    },
    {
      title: "Disputes, Conduct & Discipline",
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
        "For genuine players only, and after verification, TRR may adjust a player’s listed MMR for balancing using previous TRR seasons, consistency, and verified performance.",
        "During registration, every player must submit their correct highest MMR. Providing false or manipulated information is misconduct.",
      ],
    },
    {
      title: "Streaming Rule",
      items: [
        "Players or streamers who broadcast matches must add a 5-minute delay to their stream.",
        "Admins must be informed before the season starts if you plan to stream.",
        "Any stream must clearly display the TRR logo, identifying the match as part of The Roshan Rumble.",
        "TRR reserves the right to feature or restream gameplay on official channels.",
      ],
    },
    {
      title: "Forfeit Rule",
      items: [
        "If a team stops playing further matches, their past results (wins/draws) will remain.",
        "All upcoming matches for that team will be considered forfeited.",
        "Teams must inform admins before withdrawing.",
        "Forfeiting to give advantage to another team may lead to bans from future TRR seasons.",
      ],
    },
  ];

  // different colors for every numbered badge
  const numberColors = [
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    "radial-gradient(circle at 30% 20%, #ffefad, #facc15)", // 1 - gold
    
  ];

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "3rem 1.25rem 4rem",
        color: "#e5e5e5",
      }}
    >
      {/* Scroll-like container */}
      <div
        style={{
          position: "relative",
          borderRadius: "28px",
          border: "1px solid rgba(209,213,219,0.2)",
          background:
            "radial-gradient(circle at top, rgba(250,250,250,0.06), rgba(5,5,7,0.98))",
          boxShadow: "0 30px 90px rgba(0,0,0,0.85)",
          padding: "2.5rem 1.6rem 3.2rem",
          overflow: "hidden",
        }}
      >
        {/* subtle glow */}
        <div
          style={{
            position: "absolute",
            inset: "-40%",
            background:
              "radial-gradient(circle at 20% 0%, rgba(250,250,210,0.14), transparent 60%)",
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "clamp(2rem, 4vw, 2.6rem)",
            fontWeight: 800,
            marginBottom: "0.4rem",
            backgroundImage:
              "linear-gradient(90deg, #fafafa, #e5d39f, #d0b46a)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
          }}
        >
          The Roshan Rumble
        </motion.h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "2.2rem",
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#CD7F32",
          }}
        >
          Rules
        </p>

        {sections.map((sec, index) => (
          <motion.section
            key={sec.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            style={{
              marginBottom: index === sections.length - 1 ? 0 : "2.4rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Header with numbered badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                marginBottom: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "999px",
                  background:
                    numberColors[index % numberColors.length],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#111827",
                  boxShadow:
                    "0 0 18px rgba(250, 204, 21, 0.25), 0 10px 26px rgba(0,0,0,0.8)",
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <h2
                style={{
                  fontSize: "clamp(1.1rem, 2.1vw, 1.45rem)",
                  fontWeight: 700,
                  color: "#CD7F32",
                }}
              >
                {sec.title}
              </h2>
            </div>

            {/* Rules list */}
            <ol
              style={{
                marginLeft: "1.4rem",
                paddingLeft: "0.4rem",
                marginTop: "0.25rem",
              }}
            >
              {sec.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: "0.45rem",
                    color: "#e5e7eb",
                    fontSize: "0.95rem",
                  }}
                >
                  {item}
                </li>
              ))}
            </ol>

            {sec.extras && (
              <ol
                style={{
                  marginLeft: "1.4rem",
                  paddingLeft: "0.4rem",
                  marginTop: "0.7rem",
                  fontSize: "0.9rem",
                  color: "#d1d5db",
                  opacity: 0.9,
                  fontStyle: "italic",
                }}
              >
                {sec.extras.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ol>
            )}
          </motion.section>
        ))}
      </div>
    </main>
  );
}
