import { CoursesCard } from "./CoursesCard";
import { FeatureCard } from "./FeatureCard";
import { useState } from "react";
import { useEffect } from "react";

export function Courses(){
     const [courses, setCourses] = useState([]);
     const [active,setActive]=useState('Mycourses')
      
          useEffect(() => {
            fetch("http://localhost:3000/courses/")
              .then(res => res.json())
              .then(data => {
               
                setCourses(data);
              
              });
          }, []);
           const recentCourses = courses.slice(-2);
    return <>
      <div className="h-13 w-150 bg-gray-200 mt-10 ml-1  pt-5 pl-4  text-md font-semibold text-gray-400 rounded-sm ">
        <span onClick={()=>setActive('Mycourses')} className={active === "Mycourses"
    ? "text-sky-600 underline mr-4"
    : "text-gray-400 mr-4"}><a >MyCourses</a></span>
        <span  onClick={()=>setActive('newCourse')} className={active === "newCourse"
    ? "text-sky-500 underline"
    : "text-gray-400"}><a>Add New Course</a></span>
      </div>
      {recentCourses.map((course)=>(
      <CoursesCard key={course._id} title={course.title} description={course.description}  className="bg-[url('./assets/dsaLogo.png')] bg-cover"/>
     ))}
     <div className=" w-30 ml-130 flex justify-between">
        <span className="hover:text-sky-500"><a>previous</a></span>
        <span className="text-sky-500"><a>1</a></span>
        <span className="hover:text-sky-500" ><a>next</a></span>
     </div>
        
    
    </>
}