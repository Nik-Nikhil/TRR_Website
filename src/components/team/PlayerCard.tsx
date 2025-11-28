// src/components/team/PlayerCard.tsx
import { FaSteam, FaFlag } from "react-icons/fa";

export type PlayerRole = "Carry" | "Mid" | "Offlane" | "Soft Support" | "Hard Support";

export interface PlayerCardProps {
  nickname: string;
  realName?: string;
  role: PlayerRole;
  country?: string;
  countryCode?: string; 
  teamName?: string;
  mmr?: number;
  steamName?: string;
  steamProfileUrl?: string;
  avatarUrl?: string;
}

export default function PlayerCard(props: PlayerCardProps) {
  const {
    nickname,
    realName,
    role,
    country,
    countryCode,
    teamName,
    mmr,
    steamName,
    steamProfileUrl,
    avatarUrl,
  } = props;

  return (
    <div className="player-card glass-panel">
      {/* Left: avatar */}
      <div className="player-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt={nickname} />
        ) : (
          <div className="player-avatar-fallback">
            {nickname.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Right: details */}
      <div className="player-body">
        <div className="player-header-row">
          <div>
            <div className="player-nickname">{nickname}</div>
            {realName && <div className="player-realname">{realName}</div>}
          </div>

          <div className="player-role-pill">
            <span>{role}</span>
          </div>
        </div>

        <div className="player-meta-row">
          {teamName && (
            <div className="player-meta">
              <span className="label">Team</span>
              <span className="value">{teamName}</span>
            </div>
          )}

          {mmr && (
            <div className="player-meta">
              <span className="label">MMR</span>
              <span className="value">{mmr.toLocaleString()}</span>
            </div>
          )}

          {(country || countryCode) && (
            <div className="player-meta">
              <span className="label">Region</span>
              <span className="value">
                <FaFlag className="player-flag-icon" />
                {countryCode && <span>{countryCode}</span>}
                {country && <span style={{ marginLeft: "0.3rem" }}>{country}</span>}
              </span>
            </div>
          )}
        </div>

        {/* Steam block */}
        {(steamName || steamProfileUrl) && (
          <div className="player-steam">
            <div className="player-steam-left">
              <FaSteam className="steam-icon" />
              <div>
                <span className="label">Steam</span>
                <span className="value">
                  {steamName || "Steam Profile"}
                </span>
              </div>
            </div>
            {steamProfileUrl && (
              <a
                href={steamProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="player-steam-link"
              >
                View
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
