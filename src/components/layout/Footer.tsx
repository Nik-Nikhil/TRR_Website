import { FaInstagram, FaYoutube, FaTwitch, FaDiscord } from "react-icons/fa";
import { primaryTournament } from "../../data/mockTournaments";

export default function Footer() {
  const year = primaryTournament.year;

  return (
    <footer>
      <div>
        <div className="footer-social">
          <a href="https://www.instagram.com/theroshanrumble/" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>

          <a href="https://www.youtube.com/@TheRoshanRumble" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>

          <a href="https://www.twitch.tv/theroshanrumble" target="_blank" rel="noreferrer">
            <FaTwitch />
          </a>

          <a
            href="https://discord.gg/jreebd9Rzc"
            target="_blank"
            rel="noreferrer"
          >
            <FaDiscord />
          </a>
        </div>

        
        <p className="footer-copy-center">
          © {year}, The Roshan Rumble. <br/> All rights reserved.
        </p>
      </div>
    </footer>
  );
}
