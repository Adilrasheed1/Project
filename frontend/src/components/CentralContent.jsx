
import { promise } from "zod";
import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import Exam  from "../pages/exam";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import TestDashboard from "../components/TestDashboard";


export function CentralContent({ section, className, setSelectedExam }){
      const [doubts, setDoubts] = useState([]);
      const [user,setUsername]=useState([]);

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
    useEffect(() => {
        const username = localStorage.getItem("username");
        const user = username?.split(" ")[0];
    setUsername(user);
    fetch("http://localhost:3000/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => {
        setDoubts(data);

      });
  }, []);
  const recentDoubts = doubts.slice(-4);


    return  <div className=" col-span-3 mt-5  ml-8 mr-8  ">
        <div><SearchBar/></div>
    {section==='home' &&
     <div >
    <div className="bg-pink-400 h-50 mt-20  rounded-lg pl-5 pt-10  bg-[url('https://thumbs.dreamstime.com/z/symbols-doubt-representing-something-to-ponder-problem-solve-326315803.jpg')] bg-cover bg-center  bg-blend-overlay ">
    <h3 className="text-4xl font-semibold text-gray-800">Welcome Back , {user}!</h3> 
    <p className="pl-4 pt-2 text-lg text-gray-500 ">Where every doubt finds an answer</p></div>
    <span className="pt-10 pl-4 text-lg font-bold text-gray-600:"><h3>Recent doubts</h3></span>
     
    <div className="flex  justify-between"  >
        {recentDoubts.map((doubt) => (
   <FeatureCard  key={doubt._id} title={doubt.title} description={doubt.description}  className="mt-5  bg-gray-200 ml-5 mr-2 h-40  w-50 flex flex-col pl-5 pt-5 rounded-lg border-1 border-gray-300 text-gray-700"/>
  
     ))}
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