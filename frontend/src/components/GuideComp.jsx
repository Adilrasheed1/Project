export function GuideComp() {
  return (
    <div className="bg-slate-200 py-20 px-6">

   
      <div className="text-center mb-16">
        <h3 className="text-4xl sm:text-5xl font-bold text-gray-400">How It Works</h3>
        <p className="text-lg text-gray-500 mt-3">Get started in three simple steps</p>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">

   
        <div className="flex flex-col items-center text-center px-4">
          <div className="bg-sky-600 h-20 w-20 flex items-center justify-center text-xl font-bold rounded-full text-white">
            1
          </div>
          <h3 className="pt-5 pb-2 text-xl font-bold text-gray-400">Post Your Doubt</h3>
          <p className="text-sm text-gray-500">
            Describe your problem with text, images, or audio. Add relevant subject tags.
          </p>
        </div>

        <div className="flex flex-col items-center text-center px-4">
          <div className="bg-red-600 h-20 w-20 flex items-center justify-center text-xl font-bold rounded-full text-white">
            2
          </div>
          <h3 className="pt-5 pb-2 text-xl font-bold text-gray-400">Get AI Hints or Connect</h3>
          <p className="text-sm text-gray-500">
            Receive instant AI suggestions or connect with expert tutors for personalized help.
          </p>
        </div>

     
        <div className="flex flex-col items-center text-center px-4">
          <div className="bg-green-600 h-20 w-20 flex items-center justify-center text-xl font-bold rounded-full text-white">
            3
          </div>
          <h3 className="pt-5 pb-2 text-xl font-bold text-gray-400">Resolve & Learn</h3>
          <p className="text-sm text-gray-500">
            Solve your doubts through chat or video sessions and strengthen your understanding.
          </p>
        </div>

      </div>
    </div>
  )
}