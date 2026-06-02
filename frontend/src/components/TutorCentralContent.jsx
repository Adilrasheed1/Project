
import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { ButtonComp } from "./ButtonComp";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import { Courses } from "./Courses";
import { TutorTestCompo } from "./TutorTestCompo";

export function TutorCentralContent({section}){
      const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    fetch("https://project-3-7kx1.onrender.com/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => {
        setDoubts(data);
      });
  }, []);
  const recentDoubts = doubts.slice(-4);


    return  <div className="  col-span-3 mt-5  ml-8 mr-8  ">
        <div><SearchBar/></div>
    {section==='home' &&
     <div >
    <div className="bg-gray-300 h-40 mt-10  rounded-lg pl-5  flex flex-row justify-between">
      <div className="mt-5">
        <h3 className="text-2xl font-semibold text-gray-600 ">Welcome Back, Adil!</h3>
        <p>you have 5 pending sessions today.</p>

        <div className="flex items-center mt-2 bg-gray-200 w-32 h-10 rounded-lg justify-center">
          <span className="text-sm text-orange-500">5 sessions today</span>
        </div>
      </div>
      <div className="flex items-center mr-5">
          <ButtonComp className="text-white bg-orange-500 " title='Session history'/>
  </div>
    </div>
   <div className="mt-4 flex flex-row gap-4">
  <div className="bg-gray-200 h-40 rounded-lg flex flex-col w-full items-center justify-center">
    
    <h2>Total students</h2>
    <span className="text-4xl  text-gray-600 font-semibold">104</span>
  <span className="text-md mt-2 text-green-700">13 new this month</span>
  </div>
  <div className="bg-gray-200 h-40 rounded-lg flex  flex-col w-full items-center justify-center">
   
      <h2>Open doubts</h2>
    
   <span className="text-4xl text-gray-600 font-semibold">3</span>
   <span className="text-md mt-2 text-orange-700">oldest: 4 hrs ago</span>
  </div>
  <div className="bg-gray-200 h-40 rounded-lg flex flex-col w-full items-center justify-center">
    <h2>Average Rating</h2>
    <span className="text-4xl text-gray-600 font-semibold">4.8</span>
    <span className="text-md mt-2 text-green-700">based on 120 reviews</span>
  </div>
</div>
    
   </div>

    
   
   
    
    
    }
    {section==='courses' &&
    
    <Courses/>
    }
    {section==='Test' &&
    <TutorTestCompo/>
    }
     
    </div> 
      
 
}