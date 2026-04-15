import { FeatureCard } from "./FeatureCard";
import { useState } from "react";
import { useEffect } from "react";
export function ProfileSection(){
    const [courses, setCourses] = useState([]);
  
      useEffect(() => {
        fetch("http://localhost:3000/courses/")
          .then(res => res.json())
          .then(data => {
           
            setCourses(data);
          
          });
      }, []);
     const recentCourses = courses.slice(-3);
    return <div className="  mr-4 h-130 mt-4 rounded-sm">
        <div className="flex justify-center items-center  h-40 bg-gray-200 rounded-lg border-1 border-gray-300 ">
     <div className="h-20 w-20  rounded-full border-2 border-blue-500 bg-[url('./assets/profile.jpg')] bg-cover "></div>
     
     </div>
     <div className=" h-100 rounded-lg border-1 border-gray-300 mt-8 bg-gray-300">
        <span className="text-lg font-semibold pl-5 text-gray-700">My Courses</span>
{recentCourses.map((course)=>(
   <FeatureCard  key={course._id} title={course.title} description={course.description} className="bg-sky-600  text-gray-200 h-25 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"/>
    ))}
        
        
  
    
    </div>
    </div>
    
}