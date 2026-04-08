import { FeatureCard } from "./FeatureCard";

export function ProfileSection(){
    return <div className="bg-gray-300 mt-2 pt-20  rounded-sm">
        <div className="flex justify-center ">
     <div className="h-20 w-20 bg-green-400 rounded-full bg-[url('./assets/profile.jpg')] bg-cover "></div>
     
     </div>
     <div className="mt-10">
        <span className="text-lg font-semibold pl-5 text-gray-700">My Courses</span>
        <FeatureCard title="course1" description="complete DSA Playlist" className="bg-orange-600  text-gray-300 h-30 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
         <FeatureCard title="course2" description="complete java Playlist" className="bg-slate-900  text-gray-300 h-30 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
          <FeatureCard title="course3" description="complete Machine Learning Playlist" className="bg-blue-600  text-gray-300 h-30 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
     </div>
 
    </div>
}