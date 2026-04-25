import { FeatureCard } from "./FeatureCard";

export function ProfileSection({ className }) {
  return (
    <div className={`${className} h-full flex mr-5 items-center justify-center`}>
        <div className="bg-[#eeeff1] h-[90%] w-full rounded-xl shadow-2xl p-4 flex flex-col gap-4 overflow-hidden">
        <span>My Courses</span>
        <FeatureCard title="course1" description="complete DSA Playlist" className="bg-orange-600  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
         <FeatureCard title="course2" description="complete java Playlist" className="bg-slate-900  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
          <FeatureCard title="course3" description="complete Machine Learning Playlist" className="bg-blue-600  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
  
    
    </div>
    </div>
    )
}
