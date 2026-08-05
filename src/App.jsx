import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Gamepad2,
  MessageCircle,
  ThumbsUp,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";

/**
 * Fonts: add this to your index.html <head>
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 * <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
 */

// ---- Edit these to your own info -----------------------------------------
const PROFILE = {
  displayName: "R.H",
  handle: "@r-hassan",
  bio: "Made this for fun",
  avatar: "/profile.png",
  status: "online", // "online" | "offline"
};

const SOCIALS = [
  {
    label: "Steam",
    href: "https://steamcommunity.com/profiles/76561199491396349/",
    icon: Gamepad2,
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/YOUR_SPOTIFY_ID",
    icon: Music,
  },
];

const TRACK = {
  title: "track title",
  artist: "artist name",
  src: "/music.mp3",
  art: "/cover.png",
};
// ---------------------------------------------------------------------------

// Design tokens, matched to the reference palette
const PURPLE = "#8b5cf6";
const PURPLE_DIM = "#6d3fd9";
const PURPLE_DARK = "#221233";
const BG = "#080808";
const BORDER = "#141414";
const CARD_BG = "rgba(14,14,14,0.85)";
const TEXT_MUTED = "#888";
const TEXT_DIM = "#444";

function Tip({ children }) {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] z-20 -translate-x-1/2 translate-y-[-4px]
                 whitespace-nowrap rounded-md border border-[#222] bg-[#181818] px-2.5 py-1.5
                 text-[10.5px] tracking-wide text-[#f0f0f0] opacity-0 transition
                 group-hover:translate-y-0 group-hover:opacity-100"
    >
      {children}
    </span>
  );
}

function StatusDot({ status }) {
  const online = status === "online";
  return (
    <span className="group absolute bottom-[3px] right-[3px] inline-flex">
      <span
        className="h-[11px] w-[11px] rounded-full border-2"
        style={{ borderColor: "#0e0e0e", background: online ? "#3ecf6a" : "#444" }}
      />
      <Tip>{online ? "online" : "offline"}</Tip>
    </span>
  );
}

function Equalizer({ active }) {
  const durations = [0.65, 0.9, 0.55, 0.75, 0.85];
  return (
    <div className="flex h-[14px] items-end gap-[2px]">
      {durations.map((d, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-[1px]"
          style={{ background: `linear-gradient(180deg, ${PURPLE}, ${PURPLE})`, opacity: 0.85 }}
          animate={active ? { height: ["3px", "14px", "3px"] } : { height: "4px" }}
          transition={active ? { repeat: Infinity, duration: d, ease: "easeInOut" } : { duration: 0.15 }}
        />
      ))}
    </div>
  );
}

function MusicPlayer({ audioRef, playing, setPlaying }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(62);
  const [progress, setProgress] = useState(0);
  const [curTime, setCurTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;

    const onTime = () => {
      setCurTime(fmt(audio.currentTime));
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onDuration = () => setTotalTime(fmt(audio.duration));
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audioRef, setPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const onVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
      audioRef.current.muted = false;
    }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * audio.duration;
  };

  const silent = muted || volume === 0;

  return (
    <div
      className="w-full overflow-visible rounded-xl border"
      style={{ background: CARD_BG, borderColor: BORDER }}
    >
      {/* Top row: art, title/artist, play button */}
      <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-3">
        <div
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-[5px]"
          style={{ background: "#131313", color: TEXT_DIM }}
        >
          {TRACK.art ? (
            <img src={TRACK.art} alt="" className="h-full w-full object-cover" />
          ) : (
            <Music size={18} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-[#f0f0f0]">{TRACK.title}</div>
          <div className="mt-[2px] truncate text-[11px]" style={{ color: "#555" }}>
            {TRACK.artist}
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="group relative shrink-0 p-[3px] opacity-75 transition hover:opacity-100"
          style={{ color: PURPLE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Pause size={17} fill={PURPLE} />
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Play size={17} fill={PURPLE} />
              </motion.span>
            )}
          </AnimatePresence>
          <Tip>{playing ? "pause" : "play"}</Tip>
        </button>
      </div>

      {/* Progress row */}
      <div className="flex items-center gap-[7px] px-3 pb-2.5">
        <span className="min-w-[26px] text-[10px]" style={{ color: "#555" }}>
          {curTime}
        </span>
        <div
          onClick={seek}
          className="h-[3px] flex-1 cursor-pointer rounded-[2px]"
          style={{ background: "#1e1e1e" }}
        >
          <div
            className="h-full rounded-[2px]"
            style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${PURPLE}, ${PURPLE})` }}
          />
        </div>
        <span className="min-w-[26px] text-right text-[10px]" style={{ color: "#555" }}>
          {totalTime}
        </span>
      </div>

      {/* Now playing row */}
      <div className="flex items-center gap-2 px-3 pb-2.5">
        <span className="text-[9.5px] tracking-wider opacity-80" style={{ color: PURPLE }}>
          now playing
        </span>
        <Equalizer active={playing} />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2.5 border-t px-3 py-2.5" style={{ borderColor: BORDER }}>
        <button
          onClick={toggleMute}
          className="group relative shrink-0 p-[3px] opacity-75 transition hover:opacity-100"
          style={{ color: silent ? "#555" : PURPLE }}
        >
          {silent ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <Tip>{silent ? "unmute" : "mute"}</Tip>
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={onVolumeChange}
          className="h-[3px] flex-1 cursor-pointer appearance-none rounded-[2px]"
          style={{
            background: `linear-gradient(90deg, ${PURPLE} 0%, ${PURPLE} ${volume}%, #1e1e1e ${volume}%)`,
          }}
        />
        <span className="min-w-[28px] text-right text-[9.5px]" style={{ color: "#444" }}>
          {volume}%
        </span>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSplashClick = () => {
    setShowSplash(false);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "#000000", color: "#f0f0f0" }}
          onClick={handleSplashClick}
        >
          <motion.h1
            className="text-6xl font-bold tracking-tight"
            style={{ color: "#f0f0f0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            R.HASSAN
          </motion.h1>
          <motion.p
            className="mt-4 text-sm tracking-wide"
            style={{ color: "#888" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Click anywhere to continue
          </motion.p>
        </div>
      )}

      <div
        className="min-h-screen overflow-hidden font-[JetBrains_Mono]"
        style={{ background: BG, color: "#f0f0f0" }}
      >
        {/* Nav - made slightly taller */}
        <nav
          className="fixed left-0 top-0 z-20 flex h-[72px] w-full items-center justify-between border-b px-6"
          style={{ background: "#080808", borderColor: BORDER }}
        >
          <div className="text-[0.95rem] font-semibold tracking-tight">R-HASSAN</div>
          <a
            href="/"
            className="text-[0.8rem] tracking-wide transition"
            style={{ color: TEXT_MUTED }}
          >
            home
          </a>
        </nav>

        {/* Background video - visible behind page */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: BG }} />
          <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-[0.65] blur-[4px]">
            <source src="/background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Main */}
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 pb-10 pt-16">
          <div className="flex w-full max-w-[340px] flex-col items-center gap-3">
            {/* Card */}
            <div
              className="flex w-full flex-col items-center gap-3 rounded-xl border p-5"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              {/* Badge row: (empty badge slot) - removed view count */}
              <div className="flex w-full items-center justify-between">
                <div />
                <div />
              </div>

              {/* Avatar */}
              <div
                className="relative shrink-0 rounded-full p-[2px]"
                style={{
                  width: "clamp(72px, 18vw, 88px)",
                  height: "clamp(72px, 18vw, 88px)",
                  background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE})`,
                }}
              >
                <img
                  src={PROFILE.avatar}
                  alt={PROFILE.displayName}
                  className="h-full w-full rounded-full object-cover"
                />
                <StatusDot status={PROFILE.status} />
              </div>

              {/* Identity */}
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="text-[clamp(0.95rem,3vw,1.1rem)] font-semibold tracking-tight">
                  {PROFILE.displayName}
                </div>
                <div className="text-[0.78rem] tracking-wide" style={{ color: PURPLE }}>
                  {PROFILE.handle}
                </div>
              </div>

              <p className="max-w-[260px] text-center text-[0.74rem] leading-[1.75]" style={{ color: TEXT_MUTED }}>
                {PROFILE.bio}
              </p>

              <div className="h-px w-full" style={{ background: BORDER }} />

              {/* Links */}
              <div className="flex w-full flex-col gap-2">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[0.65rem] rounded-[7px] border px-[0.9rem] py-[0.6rem] text-[0.75rem] tracking-wide transition"
                    style={{ background: "#131313", borderColor: BORDER, color: "#c0c0c0" }}
                  >
                    <Icon size={14} style={{ color: PURPLE, opacity: 0.75 }} />
                    {label}
                  </a>
                ))}
              </div>

              {/* Removed LikeButton */}
              <div />
            </div>

            {/* Music player */}
            <MusicPlayer audioRef={audioRef} playing={playing} setPlaying={setPlaying} />
          </div>
        </main>
      </div>

      {/* Single audio element for everything */}
      <audio ref={audioRef} src={TRACK.src} loop />
    </>
  );
}

export default App;