import { FaInstagram, FaYoutube, FaTwitch, FaDiscord } from "react-icons/fa";
import { primaryTournament } from "../../pages/data/mockTournaments";

export default function Footer() {
  const year = primaryTournament.year;

  return (
    <footer
      className="
        mt-0
        border-t border-[#2a2c30]/60
        bg-[#111216]
        relative overflow-hidden
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_50%_20%,rgba(84,84,84,0.22),transparent_70%)]
        "
      />

      {/* ⬇ SAME WIDTH AS STANDINGS TABLE */}
      <div className="relative z-10 w-full max-w-[880px] mx-auto px-6 py-4 flex flex-col items-center gap-2 text-center
">
        <div className="flex items-center justify-center gap-7">
          {[
            { to: "https://www.instagram.com/theroshanrumble/", icon: <FaInstagram size={22} /> },
            { to: "https://www.youtube.com/@TheRoshanRumble", icon: <FaYoutube size={22} /> },
            { to: "https://www.twitch.tv/theroshanrumble", icon: <FaTwitch size={22} /> },
            { to: "https://discord.gg/jreebd9Rzc", icon: <FaDiscord size={22} /> },
          ].map((item, index) => (
            <a
              key={index}
              href={item.to}
              target="_blank"
              rel="noreferrer"
              className="
                text-[#cfcfcf]/80
                transition duration-300
                hover:text-white hover:opacity-100
                opacity-70 hover:scale-[1.1]
              "
            >
              {item.icon}
            </a>
          ))}
        </div>

        <p className="text-[0.72rem] text-[#bdbdbd]/80 uppercase tracking-[0.16em]">
          © {year}, The Roshan Rumble — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
