import { FeatureCard } from "./FeatureCard";

export function ProfileSection(){
    return <div className="  mr-4 h-130 mt-4 rounded-sm">
        <div className="flex justify-center items-center  h-40 bg-gray-200 rounded-lg border-1 border-orange-300 ">
     <div className="h-20 w-20  rounded-full border-2 border-blue-500 bg-[url('./assets/profile.jpg')] bg-cover "></div>
     
     </div>
     <div className=" h-100 rounded-lg border-1 border-blue-500 mt-8 bg-gray-300">
        <span className="text-lg font-semibold pl-5 text-gray-700">My Courses</span>
        <FeatureCard title="course1" description="complete DSA Playlist" className="bg-orange-600  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
         <FeatureCard title="course2" description="complete java Playlist" className="bg-slate-900  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
          <FeatureCard title="course3" description="complete Machine Learning Playlist" className="bg-blue-600  text-gray-300 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
     </div>
 
    </div>
}