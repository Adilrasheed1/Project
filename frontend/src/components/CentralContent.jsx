
import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { SearchBar } from "./SearchBar";

export function CentralContent({section}){

    return  <div className=" col-span-3 mt-5  ml-8 mr-8  ">
        <div><SearchBar/></div>
    {section==='home' &&
     <div >
    <div className="bg-pink-400 h-50 mt-20  rounded-lg pl-5 pt-10  bg-[url('https://thumbs.dreamstime.com/z/symbols-doubt-representing-something-to-ponder-problem-solve-326315803.jpg')] bg-cover bg-center  bg-blend-overlay ">
    <h3 className="text-4xl font-semibold text-gray-800">Welcome Back , Adil!</h3> 
    <p className="pl-4 pt-2 text-lg text-gray-500 ">Where every doubt finds an answer</p></div>
    <span className="pt-10 pl-4 text-lg font-bold text-gray-600:"><h3>Recent doubts</h3></span>
    <div className="flex justify-between">
   <FeatureCard title="doubt1" description="how to check a number is even in python"   className="mt-5  bg-gray-200 ml-5 mr-2 h-40  w-50 flex flex-col pl-5 pt-5 rounded-lg border-1 border-gray-300 text-gray-700"/>
   <FeatureCard title="doubt2" description="ho to merge two arrays" className="mt-5  bg-gray-200 ml-5 mr-2 h-40  w-50 flex flex-col pl-5 pt-5 rounded-lg border-1 border-gray-300 text-gray-700"/>
   <FeatureCard title="doubt3" description="ho to add two arrays" className="mt-5  bg-gray-200 ml-5 mr-2 h-40  w-50 flex flex-col pl-5 pt-5 rounded-lg border-1 border-gray-300 text-gray-700"/>
   
    </div>
    <a href="#" className="pl-150 pt-10 hover:text-blue-500">See all</a>
    </div>
    }
     {section === "doubts" && (
        <>
          <DoubtSection />
        </>
      )}
    </div> 
      
 
}