import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { SearchBar } from "./SearchBar";
import { useState, useEffect, use } from "react";
import TestDashboard from "./TestDashboard";
import { Courses } from "./Courses";
import { CoursesCard } from "./CoursesCard";
import { StudentSideCourses } from "./StudentSideCourses";
import logo from "../assets/Dsalogo.png"
import { ButtonComp } from "./ButtonComp";

export function CentralContent({ section, className, setSelectedExam ,setInCall}) {

  const [doubts, setDoubts] = useState([]);
  const [user, setUsername] = useState("");
    const [courses,setCourses]=useState([])
    const [filter,setFilter]=useState("")
  

  useEffect(() => {
    const username = localStorage.getItem("username");
    const user = username?.split(" ")[0];
    setUsername(user || ""); // ✅ safe

    fetch("https://project-3-7kx1.onrender.com/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => setDoubts(data))
      .catch(() => setDoubts([]));
  }, []);
  useEffect(()=>{
    fetch("https://project-3-7kx1.onrender.com/courses/bulk?filter=" +filter )
    .then(res=>res.json())
    .then(data=>{
      setCourses(data.course)
    })
  },[filter])
  

  const recentDoubts = doubts.slice(0, 3); 

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

        

            <div className="ml-5 pl-5 pb-10 mt-5 h-full bg-gray-200 bg-opacity-10 rounded-lg">
              <h3 className="pt-10 text-lg font-bold text-gray-600">
                Recent doubts
              </h3>

              
              <div className="flex gap-4 flex-wrap">
                {recentDoubts.map((doubt) => (
                  <FeatureCard
                    key={doubt._id}
                    image={logo}
                    title={doubt.title}
                    description={doubt.description}
                    className="mt-5 bg-gray-200 h-50 w-52 p-4 rounded-lg border border-gray-300 text-gray-700  hover:shadow-lg hover:scale-105 transition duration-200"
                  />
                ))}
              </div>

              
              <ButtonComp title="View All Doubts" className="mt-6 ml-8  sm:w-150 bg-gray-300 hover:bg-blue-400 hover:text-white"  />
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