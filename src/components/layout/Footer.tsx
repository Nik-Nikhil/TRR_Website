function InstagramIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 448 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ig-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9ce34" />
          <stop offset="50%" stopColor="#ee2a7b" />
          <stop offset="100%" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <path
        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5s32-71.5 71.5-71.5 71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.9S388.6 1.7 353.3 0C317.6-1.7 130.4-1.7 94.7 0 59.4 1.7 28 9.9 1.7 36.2S1.7 123.4 0 158.7C-1.7 194.4-1.7 381.6 0 417.3c1.7 35.3 9.9 66.7 36.2 92.9s57.6 34.5 92.9 36.2c35.7 1.7 222.9 1.7 258.6 0 35.3-1.7 66.7-9.9 92.9-36.2s34.5-57.6 36.2-92.9c1.7-35.7 1.7-222.9 0-258.6zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5C121.1 24.6 190.9 27.2 224 27.2s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.3s2.7 102.9-9 132.3z"
        fill="url(#ig-gradient)"
      />
    </svg>
  );
}

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
      <div className="relative z-10 w-full max-w-[880px] mx-auto px-6 py-4 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center gap-7">
          {[
            {
              to: "https://www.instagram.com/theroshanrumble/",
              icon: <InstagramIcon size={22} />,
            },
            {
              to: "https://www.youtube.com/@TheRoshanRumble",
              icon: (
                <img
                  src="../src/assets/youtubeIcon.png"
                  width={27}
                  height={27}
                />
              ),
            },
            {
              to: "https://www.twitch.tv/theroshanrumble",
              icon: (
                <img
                  src="../src/assets/twitchIcon.png"
                  width={22}
                  height={22}
                />
              ),
            },
            {
              to: "https://discord.gg/jreebd9Rzc",
              icon: (
                <img
                  src="../src/assets/discordIcon.png"
                  width={27}
                  height={27}
                />
              ),
            },
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
