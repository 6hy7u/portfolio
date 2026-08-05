import { motion } from "framer-motion";

function App() {
  return (
    <main className="bg-black text-white min-h-screen">

      <section className="h-screen flex items-center justify-center px-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-bold"
          >
            Ram Hassan
          </motion.h1>

          <p className="text-gray-400 text-xl mt-5">
            Developer building modern web experiences.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-full">
              Projects
            </button>

            <button className="border border-gray-600 px-6 py-3 rounded-full">
              Contact
            </button>
          </div>

        </div>
      </section>


      <section className="px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold">
          About
        </h2>

        <p className="text-gray-400 mt-5">
          I build websites, applications and digital experiences.
        </p>
      </section>


      <section className="px-6 py-24 max-w-5xl mx-auto">

        <h2 className="text-4xl font-bold">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-zinc-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold">
              Project One
            </h3>

            <p className="text-gray-400 mt-3">
              Description of your project.
            </p>
          </div>


          <div className="bg-zinc-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold">
              Project Two
            </h3>

            <p className="text-gray-400 mt-3">
              Description of your project.
            </p>
          </div>

        </div>

      </section>

    </main>
  )
}

export default App