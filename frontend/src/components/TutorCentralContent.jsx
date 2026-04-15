
import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { ButtonComp } from "./ButtonComp";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { useEffect } from "react";

export function TutorCentralContent({section}){
      const [doubts, setDoubts] = useState([]);

  useEffect(() => {
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
    <div className="bg-gray-400 h-50 mt-20  rounded-lg pl-5  flex flex-row justify-between">
        <div>
    <h3 className="text-4xl font-semibold  pt-10 text-gray-800">Welcome Back , Adil!</h3> 
    <p className="pl-4 pt-2 text-lg text-gray-600 font-sans italic ! ">Be the mentor students rely on</p></div>
     <div className="h-50 w-50  bg-[url('./assets/profile.jpg')] bg-cover bg-blend-multiply border-1 border-gray-400 rounded-md"></div>
    </div>
   
   <div className="h-50 mt-5 bg-white rounded-sm flex flex-row">
    <div className=" h-50 w-40 pt-10 pl-3 bg-gray-200 rounded-sm text-lg font-semibold flex flex-col">
        <p>Sessions Today:</p>
        <a className="pl-9 pt-3 text-4xl">5</a>
    </div>
    <div className="pt-10 pl-4  text-gray-400 font-semibold">
    <a >Click here To check Session history: </a>
    <ButtonComp className="text-white bg-sky-500 mt-4 ml-3" title='Session history'/>
 </div>
   </div>
     
   
   
    
    </div>
    }
     
    </div> 
      
 
}