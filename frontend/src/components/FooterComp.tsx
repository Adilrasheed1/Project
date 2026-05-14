export function FooterComp() {
  return (
    <div className="w-full flex justify-center items-center py-16 px-6 bg-gray-200">

      <div className="bg-blue-500 w-full max-w-4xl flex flex-col justify-center items-center text-center rounded-xl px-8 py-12">

        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Start Learning?
        </h2>

        <p className="text-lg text-white/80 mt-4 max-w-xl">
          Join thousands of students who are already excelling with DoubtSolver
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="bg-cyan-300 text-gray-700 font-semibold h-10 px-8 rounded-lg hover:bg-cyan-200 transition w-full sm:w-auto">
            Get Started Free
          </button>
          <button className="bg-slate-400 text-white font-semibold h-10 px-8 rounded-lg hover:bg-slate-300 transition w-full sm:w-auto">
            Browse Tutors
          </button>
        </div>

      </div>
    </div>
  )
}