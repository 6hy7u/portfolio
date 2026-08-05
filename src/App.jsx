import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  MessageCircle,
  ThumbsUp,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

/**
 * Fonts: add these to your index.html <head>
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
 */

// ---- Edit these to your own info -----------------------------------------
const PROFILE = {
  displayName: "R.H",
  handle: "@r-hassan",
  bio: "Just some dev who likes to play games.",
  avatar: "/profile.png",
  status: "online", // "online" | "offline"
  views: 61,
};

const SOCIALS = [
  {
    label: "Steam",
    href: "https://steamcommunity.com/profiles/76561199491396349/",
    icon: Gamepad2,
  },
  {
    label: "Discord",
    href: "https://discord.com/users/YOUR_DISCORD_ID",
    icon: MessageCircle,
  },
];

const TRACK = {
  title: "track title",
  artist: "artist name",
  src: "/music.mp3", // matches your public/music.mp3
  art: "/cover.png", // matches your public/cover.png
};
// ---------------------------------------------------------------------------

const ACCENT = "#8B7CFF";
const ACCENT_2 = "#FF6F9C";

// Small reusable tooltip that drops below whatever it's attached to,
// matching the reference's hover-tip pattern on badges/status/likes.
function Tip({ children }) {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 translate-y-[-4px]
                 whitespace-nowrap rounded-md border border-white/10 bg-[#181818] px-2.5 py-1.5
                 text-[11px] tracking-wide text-white opacity-0 transition
                 group-hover:translate-y-0 group-hover:opacity-100"
    >
      {children}
    </span>
  );
}

function StatusDot({ status }) {
  const online = status === "online";
  return (
    <span className="group relative inline-flex">
      <span
        className={`h-3 w-3 rounded-full border-2 border-[#0e0e0e] ${
          online ? "bg-[#3ecf6a]" : "bg-[#444]"
        }`}
      />
      <Tip>{online ? "online" : "offline"}</Tip>
    </span>
  );
}

function ViewCount({ count }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] tracking-wide text-gray-500">
      <Eye size={12} />
      {count}
    </div>
  );
}

function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <button
      onClick={() => {
        setLiked((v) => !v);
        setCount((c) => (liked ? c - 1 : c + 1));
      }}
      className="group relative flex items-center gap-1.5 rounded px-1.5 py-1 text-sm text-gray-500 transition hover:text-gray-300"
    >
      <ThumbsUp
        size={14}
        style={liked ? { fill: ACCENT, color: ACCENT } : undefined}
      />
      <Tip>
        {count} like{count === 1 ? "" : "s"}
      </Tip>
    </button>
  );
}

// Signature element: a slowly rotating conic-gradient ring behind the avatar.
function AvatarRing({ src, alt, status }) {
  return (
    <div className="relative mx-auto h-[84px] w-[84px]">
      <motion.div
        className="absolute inset-[-4px] rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${ACCENT}, ${ACCENT_2}, #3ecf6a, ${ACCENT})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
      <div className="absolute inset-[2px] rounded-full bg-[#0a0a10]" />
      <img
        src={src}
        alt={alt}
        className="absolute inset-[4px] h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-full object-cover"
      />
      <div className="absolute bottom-0 right-0">
        <StatusDot status={status} />
      </div>
    </div>
  );
}

function Equalizer({ active }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <div className="flex h-3.5 items-end gap-[2px]">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ background: `linear-gradient(180deg, ${ACCENT_2}, ${ACCENT})` }}
          animate={
            active
              ? { height: ["15%", "100%", "35%", "80%", "15%"] }
              : { height: "20%" }
          }
          transition={
            active
              ? { repeat: Infinity, duration: 0.7 + i * 0.12, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(62);
  const [progress, setProgress] = useState(0);
  const [curTime, setCurTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");

  const fmt = (secs) => {
    if (!Number.isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
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
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const silent = muted || volume === 0;

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <audio ref={audioRef} src={TRACK.src} loop />

      <div className="flex items-center gap-2.5 px-3 pb-2 pt-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/5">
          <img src={TRACK.art} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1 font-[Inter]">
          <div className="truncate text-[13px] font-semibold">{TRACK.title}</div>
          <div className="truncate text-[11px] text-gray-500">{TRACK.artist}</div>
        </div>

        <Equalizer active={playing} />

        <button
          onClick={togglePlay}
          className="group relative shrink-0 p-1 opacity-80 transition hover:opacity-100"
          style={{ color: ACCENT }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Pause size={16} fill={ACCENT} />
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Play size={16} fill={ACCENT} />
              </motion.span>
            )}
          </AnimatePresence>
          <Tip>{playing ? "pause" : "play"}</Tip>
        </button>
      </div>

      <div className="flex items-center gap-2 px-3 pb-2.5">
        <span className="min-w-[26px] text-[10px] text-gray-500">{curTime}</span>
        <div
          onClick={seek}
          className="h-[3px] flex-1 cursor-pointer rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_2})` }}
          />
        </div>
        <span className="min-w-[26px] text-right text-[10px] text-gray-500">{totalTime}</span>
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5">
        <button
          onClick={toggleMute}
          className="group relative shrink-0 p-1 opacity-80 transition hover:opacity-100"
          style={{ color: silent ? "#555" : ACCENT }}
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
          className="h-[3px] flex-1 cursor-pointer appearance-none rounded-full accent-current"
          style={{
            background: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_2} ${volume}%, rgba(255,255,255,0.1) ${volume}%)`,
            color: ACCENT,
          }}
        />
        <span className="min-w-[28px] text-right text-[10px] text-gray-600">{volume}%</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a10] font-[Inter] text-white">
      {/* Top Bar */}
      <nav className="fixed left-0 top-0 z-20 flex h-12 w-full items-center justify-between border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
        <div className="font-[Space_Grotesk] font-semibold tracking-wide">R-HASSAN</div>
        <a href="/" className="text-sm text-gray-400 transition hover:text-white">
          Home
        </a>
      </nav>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(139,124,255,0.12), transparent 60%), #0a0a10",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-70">
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main */}
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pb-10 pt-16">
        {/* Profile Card */}
        <div className="w-full max-w-[340px] rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span />
            <ViewCount count={PROFILE.views} />
          </div>

          <AvatarRing src={PROFILE.avatar} alt={`${PROFILE.displayName} avatar`} status={PROFILE.status} />

          <h1 className="mt-3 font-[Space_Grotesk] text-lg font-semibold">{PROFILE.displayName}</h1>
          <p className="text-[13px]" style={{ color: ACCENT }}>
            {PROFILE.handle}
          </p>
          <p className="mx-auto mt-2 max-w-[260px] text-[12px] leading-relaxed text-gray-400">
            {PROFILE.bio}
          </p>

          <div className="my-4 h-px w-full bg-white/10" />

          <div className="flex flex-col gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>

          <div className="mt-2 flex justify-end">
            <LikeButton />
          </div>
        </div>

        {/* Music Player */}
        <div className="w-full max-w-[340px]">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}

export default App;