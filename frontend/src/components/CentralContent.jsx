
import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import Exam  from "../pages/exam";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import TestDashboard from "../components/TestDashboard";


export function CentralContent({ section, className, setSelectedExam }){
      const [doubts, setDoubts] = useState([]);

 useEffect(() => {
  fetch("http://localhost:3000/doubts/DoubtSection")
    .then(res => res.json())
    .then(data => setDoubts(data))
    .catch(() => setDoubts([]));
}, []);

  const recentDoubts = doubts.slice(0, 4);


    return (
  <div className={`h-full  overflow-y-auto overflow-x-hidden ${className}`}>
  <div className="max-w-6xl mb-30 mx-auto w-full">

    {/* HOME */}
    {section === "home" && (
      <>
        <h1 className="text-7xl font-extrabold font-serif mt-2  sm:mt-20 ml-10">
          COURSES THAT TEACH. MENTORS THAT GUIDE.
        </h1>

        <SearchBar />

        <div className="ml-10">
          <h3 className="pt-10 text-lg font-bold text-gray-600">
            Recent doubts
          </h3>

          <div className="flex justify-between">
            {recentDoubts.map((doubt) => (
              <FeatureCard
                key={doubt._id}
                title={doubt.title}
                description={doubt.description}
                className="mt-5 bg-gray-200 ml-5 mr-2 h-40 w-50 flex flex-col pl-5 pt-5 rounded-lg border border-gray-300 text-gray-700"
              />
            ))}
          </div>

          <a href="#" className="pl-150 pt-10 hover:text-blue-500">
            See all
          </a>
          
        </div>
        
      </>
    )}

    {/* DOUBTS */}
    {section === "doubts" && <DoubtSection />}

    {/* TEST */}
   {section === "Test" && (
  <TestDashboard setSelectedExam={setSelectedExam} />
)}

  </div>
  </div>
);
      
 
}