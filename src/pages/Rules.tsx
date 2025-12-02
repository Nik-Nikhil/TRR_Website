import { motion } from "framer-motion";

export default function RulesPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        lineHeight: 1.65,
        color: "#dcdcdc",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: "2.7rem",
          fontWeight: 800,
          marginBottom: "1.5rem",
          backgroundImage:
            "linear-gradient(90deg, #fafafa, #d7d7d7, #bfbfbf)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textAlign: "center",
        }}
      >
        TRR – The Roshan Rumble Official Rules
      </motion.h1>

      {/* --- reusable section layout --- */}
      {[
        {
          icon: "🎯",
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
          extras: ["Handicap matches will be permitted. (e.g., 2v5, 3v5, 4v5)"],
        },

        {
          icon: "🧠",
          title: "Teams & Captains",
          items: [
            "Each captain must appoint a vice-captain to manage the team in their absence.",
            "Captains are responsible for managing their roster and informing admins promptly if a stand-in is needed.",
            "Players must maintain at least 75% attendance to be eligible for prizes.",
            "Captains should try to resolve minor issues internally before escalating.",
            "Expected issues must be communicated in advance to the admins.",
            "Concerns should be raised via !ticket TeamName + concern.",
            "All match lobbies will be created by TRR admins. In rare cases where a captain creates the lobby, it must include the official TRR tournament ticket.",
            "If you suspect a teammate is smurfing, report immediately to avoid full-team disqualification.",
          ],
        },

        {
          icon: "🧍‍♂️",
          title: "Stand-ins",
          items: [
            "Only 1 stand-in allowed. More than 1 needs admin approval.",
            "All stand-ins will be provided by TRR admins.",
            "Teams must notify admins at least 2 days in advance if a stand-in is needed.",
            "Last-minute stand-ins are not guaranteed to match original MMR.",
            "Teams may suggest stand-ins from list / eliminated players but final approval lies with admins.",
            "Stand-ins must be within 300 MMR range of replaced player.",
            "If higher MMR stand-in is suggested, opposing captain approval is required in presence of admins.",
            "Unauthorized stand-ins = automatic match forfeit.",
            "Only registered MMR is considered — not updated MMR.",
          ],
          extras: [
            "Eliminated players may be stand-ins.",
            "Active players cannot be stand-ins.",
            "Repeated absence may result in permanent stand-in assignment.",
            "Permanent stand-ins are official members & still eligible for 1 normal stand-in per game.",
            "Eliminated permanent stand-ins are not eligible for prizes.",
            "Permanent stand-ins may need to pay fee to be prize-eligible.",
          ],
        },

        {
          icon: "🌐",
          title: "Server Settings",
          items: [
            "Default server: SEA (Singapore).",
            "Server change permitted only with mutual agreement.",
            "Players must confirm the selected server before game starts.",
            "Participation in match = acceptance of server. No disputes after match begins.",
          ],
        },

        {
          icon: "📜",
          title: "Match Rules & Format",
          items: [
            "Games are Captains Mode.",
            "Matches usually between 12 PM – 9 PM IST on weekends.",
            "Rescheduling only with explicit admin approval.",
            "Tournament format: Double Elimination.",
            "All teams start in Upper Bracket.",
            "Matches are Bo1 or Bo3 based on season; Grand Finals always Bo3.",
            "League format may vary (Round Robin / Groups / others).",
            "Group matches are Bo1 or Bo2 depending on season.",
            "Top teams qualify for Playoffs.",
            "Playoffs and Grand Finals are Bo3.",
          ],
        },

        {
          icon: "⏱️",
          title: "Match Punctuality & Penalties",
          items: [
            "10 min late → Level 1 Penalty: 30-second draft penalty.",
            "15 min late → Level 2 Penalty: 70-second draft penalty.",
            "20 min late → Level 3 Penalty: 110-second draft penalty.",
            "30 min late → Forfeit: Opponent gets default win.",
            "GG Rule: Saying GG early / sarcastically / misleadingly may result in penalties or match decision reversal.",
          ],
          extras: [
            "15-minute rest between matches (unless informed).",
            "Lobbies must include TRR ticket.",
            "Each team has only 15 minutes of total pause time.",
          ],
        },

        {
          icon: "⚠️",
          title: "Disputes, Conduct & Discipline",
          items: [
            "Non-offensive Steam names / bios / team names are mandatory.",
            "No post-match complaints regarding stand-ins or server.",
            "Toxicity, scripting, abuse, cheating, smurfing = permanent disqualification.",
            "Admin decisions are final.",
            "Abusive behaviour results in warnings / penalties / bans.",
            "All players must maintain respectful communication.",
          ],
        },

        {
          icon: "🎙️",
          title: "Discord & Player Verification",
          items: [
            "Players must remain connected to TRR team voice channel during match.",
            "Microphone must remain unmuted unless permitted by admins.",
            "Admins may perform random mic checks.",
            "Players must screen-share instantly if asked.",
            "Verification refusal / delay / suspicious behaviour may lead to penalties.",
            "Players must use their official registered Discord ID.",
            "No voice changers or disruptive audio.",
            "Disconnecting from Discord must be fixed immediately.",
            "Pausing for opponent check is not allowed.",
          ],
        },

        {
          icon: "🕵️‍♂️",
          title: "Cheating, Misconduct & Investigation",
          items: [
            "Investigations will be handled only by TRR admins.",
            "No pausing for smurf suspicion / verification.",
            "Game continues unless admin directly instructs pause.",
            "False accusations / spam reporting is penalised.",
            "Smurfing = lifetime TRR ban.",
          ],
          extras: [
            "Admins may adjust MMR for balancing based on historical skill.",
            "Submitting false MMR is treated as misconduct.",
          ],
        },

        {
          icon: "📺",
          title: "Streaming Rule",
          items: [
            "Streamers MUST add 5-minute delay.",
            "Admins must be informed before season begins if streaming.",
            "Stream must visibly include TRR logo.",
            "TRR may restream or feature gameplay.",
          ],
        },

        {
          icon: "🏳️",
          title: "Forfeit Rule",
          items: [
            "Past results stay, future matches = forfeited.",
            "Admins must be informed if withdrawing.",
            "Forfeiting intentionally to benefit others may lead to bans.",
          ],
        },
      ].map((sec, index) => (
        <motion.section
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
          style={{ marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontSize: "1.7rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span style={{ fontSize: "1.9rem" }}>{sec.icon}</span>
            {sec.title}
          </h2>

          <ul style={{ marginLeft: "1.2rem" }}>
            {sec.items.map((item, i) => (
              <li key={i} style={{ marginBottom: "0.45rem" }}>
                {item}
              </li>
            ))}
          </ul>

          {sec.extras && (
            <ul
              style={{
                opacity: 0.9,
                marginTop: "0.9rem",
                marginLeft: "1.2rem",
                fontStyle: "italic",
              }}
            >
              {sec.extras.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </motion.section>
      ))}
    </main>
  );
}
