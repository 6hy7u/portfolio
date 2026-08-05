import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  MessageCircle,
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

/**
 * Fonts: add these to your index.html <head> (or import in your global CSS)
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
  src: "/song.mp3",
  durationLabel: "0:00",
};
// ---------------------------------------------------------------------------

const ACCENT = "#8B7CFF"; // signal violet — the page's one bold color
const ACCENT_2 = "#FF6F9C"; // warm secondary, used sparingly (likes)

function StatusDot({ status }) {
  const online = status === "online";
  return (
    <span className="flex items-center gap-2 text-sm font-[Inter]">
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          online ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-500"
        }`}
      />
      <span className={online ? "text-green-400" : "text-gray-400"}>
        {online ? "online" : "offline"}
      </span>
    </span>
  );
}

function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        setLiked((v) => !v);
        setCount((c) => (liked ? c - 1 : c + 1));
      }}
      className="flex items-center gap-1.5 text-sm font-[Inter] text-gray-400 transition"
      style={{ color: liked ? ACCENT_2 : undefined }}
    >
      <Heart
        size={16}
        style={liked ? { fill: ACCENT_2, color: ACCENT_2 } : undefined}
      />
      {count} like{count === 1 ? "" : "s"}
    </motion.button>
  );
}

// Signature element: a slowly rotating conic-gradient ring behind the
// avatar, standing in for the "orbit" of everything this page links out to.
function AvatarRing({ src, alt }) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <motion.div
        className="absolute inset-[-6px] rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${ACCENT}, ${ACCENT_2}, #4ADE80, ${ACCENT})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
      <div className="absolute inset-[3px] rounded-full bg-[#0a0a10]" />
      <img
        src={src}
        alt={alt}
        className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full object-cover"
      />
    </div>
  );
}

// Small audio-reactive-looking equalizer, live while a track is playing.
function Equalizer({ active }) {
  const bars = [0, 1, 2, 3];
  return (
    <div className="flex items-end gap-[3px] h-4 w-5">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: ACCENT }}
          animate={
            active
              ? { height: ["30%", "100%", "50%", "80%", "30%"] }
              : { height: "20%" }
          }
          transition={
            active
              ? {
                  repeat: Infinity,
                  duration: 0.9 + i * 0.15,
                  ease: "easeInOut",
                }
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
  const [progress, setProgress] = useState(0); // 0-1
  const [currentLabel, setCurrentLabel] = useState("0:00");

  const formatTime = (secs) => {
    if (!Number.isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentLabel(formatTime(audio.currentTime));
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

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

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-80"
    >
      <audio ref={audioRef} src={TRACK.src} loop />

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-black"
          style={{ background: ACCENT }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Pause size={18} fill="black" />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Play size={18} fill="black" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="min-w-0 flex-1 font-[Inter]">
          <div className="truncate text-sm font-medium">{TRACK.title}</div>
          <div className="truncate text-xs text-gray-400">{TRACK.artist}</div>
        </div>

        <Equalizer active={playing} />

        <button
          onClick={toggleMute}
          className="shrink-0 text-gray-400 hover:text-white transition"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Progress bar */}
      <div
        onClick={seek}
        className="mt-3 h-1.5 w-full rounded-full bg-white/10 cursor-pointer overflow-hidden"
      >
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${progress * 100}%`, background: ACCENT }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] text-gray-500 font-[Inter]">
        <span>{currentLabel}</span>
        <span>{TRACK.durationLabel}</span>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a10] text-white overflow-hidden font-[Inter]">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 w-full h-12 bg-black/50 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 z-20">
        <div className="font-[Space_Grotesk] font-semibold tracking-wide">
          R-HASSAN
        </div>
        <div className="text-sm text-gray-400">Home</div>
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main */}
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 pt-16 pb-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-80 text-center"
        >
          <AvatarRing src={PROFILE.avatar} alt={`${PROFILE.displayName} avatar`} />

          <h1 className="text-2xl font-[Space_Grotesk] font-semibold mt-5">
            {PROFILE.displayName}
          </h1>
          <p className="text-sm text-gray-400">{PROFILE.handle}</p>
          <p className="text-sm text-gray-300 mt-2">{PROFILE.bio}</p>

          <div className="flex justify-center items-center gap-4 mt-4">
            <StatusDot status={PROFILE.status} />
            <span className="text-gray-600">•</span>
            <LikeButton />
          </div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 w-80"
        >
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, borderColor: ACCENT }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition rounded-xl p-4 flex items-center gap-3"
            >
              <Icon size={20} />
              {label}
            </motion.a>
          ))}
        </motion.div>

        {/* Music Player */}
        <MusicPlayer />
      </main>
    </div>
  );
}

export default App;
