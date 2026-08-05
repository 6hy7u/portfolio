import { motion } from "framer-motion";
import { Music, Gamepad2 } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Top Bar */}
      <nav className="fixed top-0 left-0 w-full h-12 bg-black/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 z-20">
        <div className="font-semibold">
          R-HASSAN
        </div>

        <div className="text-sm text-gray-400">
          Home
        </div>
      </nav>


      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/60" />

        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src="/background.mp4" />
        </video>
      </div>


      {/* Main */}
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">


        {/* Discord Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-80 text-center"
        >

          <div className="relative inline-block">

            <img
              src="/profile.png"
              className="w-32 h-32 rounded-full border-4 border-green-500 shadow-[0_0_30px_#22c55e]"
            />

          </div>


          <h1 className="text-2xl font-bold mt-5">
            R.H
          </h1>


          <div className="flex justify-center items-center gap-2 mt-3 text-green-400">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Online
          </div>

        </motion.div>



        {/* Social Buttons */}
        <div className="flex flex-col gap-3 w-80">


          <a
            href="https://steamcommunity.com/profiles/76561199491396349/"
            target="_blank"
            className="bg-white/10 hover:bg-white/20 transition rounded-xl p-4 flex items-center gap-3"
          >
            <Gamepad2 />
            Steam
          </a>


          <a
            href="https://open.spotify.com/user/9oibagutl5idtfsp6d7igt4gz"
            target="_blank"
            className="bg-white/10 hover:bg-white/20 transition rounded-xl p-4 flex items-center gap-3"
          >
            <Music />
            Spotify
          </a>


        </div>


      </main>

    </div>
  )
}

export default App;