import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { SearchBar } from "./SearchBar";
import { useState, useEffect, use } from "react";
import TestDashboard from "./TestDashboard";
import { Courses } from "./Courses";
import { CoursesCard } from "./CoursesCard";
import { StudentSideCourses } from "./StudentSideCourses";

export function CentralContent({ section, className, setSelectedExam ,setInCall}) {

  const [doubts, setDoubts] = useState([]);
  const [user, setUsername] = useState("");
    const [courses,setCourses]=useState([])
    const [filter,setFilter]=useState("")
  

  useEffect(() => {
    const username = localStorage.getItem("username");
    const user = username?.split(" ")[0];
    setUsername(user || ""); // ✅ safe

    fetch("http://localhost:3000/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => setDoubts(data))
      .catch(() => setDoubts([]));
  }, []);
  useEffect(()=>{
    fetch("http://localhost:3000/courses/bulk?filter=" +filter )
    .then(res=>res.json())
    .then(data=>{
      setCourses(data.course)
    })
  },[filter])
  

  const recentDoubts = doubts.slice(0, 4); 

  return (
    <div className={`h-full overflow-y-auto overflow-x-hidden no-scrollbar ${className}`}>
      <div className="max-w-6xl mb-30 mx-auto w-full">
            <SearchBar onChange={(e) => {
                setFilter(e.target.value)
            }} />

        {/* HOME */}
        {section === "home" && (
          <>
           
            <h1 className="text-7xl font-extrabold font-serif mt-2 sm:mt-20 ml-10">
              COURSES THAT TEACH. MENTORS THAT GUIDE.
            </h1>

            {/* welcome line */}
            <p className="ml-10 mt-2 text-gray-500">
              Welcome back, {user}
            </p>

        

            <div className="ml-10">
              <h3 className="pt-10 text-lg font-bold text-gray-600">
                Recent doubts
              </h3>

              
              <div className="flex gap-4 flex-wrap">
                {recentDoubts.map((doubt) => (
                  <FeatureCard
                    key={doubt._id}
                    title={doubt.title}
                    description={doubt.description}
                    className="mt-5 bg-gray-200 h-40 w-52 p-4 rounded-lg border border-gray-300 text-gray-700"
                  />
                ))}
              </div>

              
              <a href="#" className="block mt-4 hover:text-blue-500">
                See all
              </a>
            </div>
          </>
        )}

        {/* DOUBTS */}
        {section === "doubts" && <DoubtSection setInCall={setInCall} />}

        {/* TEST */}
        {section === "Test" && (
          <TestDashboard setSelectedExam={setSelectedExam} />
        )}
{section ==="courses" && (
  
  <div className=" h-50 flex gap-4 flex-wrap">
    
   
 {courses.map(course=> <StudentSideCourses course={course}/>)}
 </div>
)}
    
        

      </div>
    </div>
  );
}