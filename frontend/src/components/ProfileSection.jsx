import { useState, useEffect } from "react";
import { FeatureCard } from "./FeatureCard";
import logo from "../assets/Dsalogo.png"

export function ProfileSection({ className }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/courses/")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => {
        console.error("Failed to fetch courses", err);
        setCourses([]); // fallback safety
      });
  }, []);

  const recentCourses = courses.slice(-2);

  return (
    <div className={`${className} h-full flex items-center justify-center mr-5`}>

      <div className="bg-[#eeeff1] h-[90%] w-full rounded-xl shadow-2xl p-4 flex flex-col gap-4 overflow-hidden">

        {/* PROFILE PICTURE */}
        <div className="flex justify-center items-center h-40 bg-gray-200 rounded-lg border border-gray-300">
          <div className="h-20 w-20 rounded-full border-2 border-blue-500 bg-gray-400"></div>
        </div>

        {/* COURSES */}
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">

          <span className="text-lg font-semibold text-gray-700">
            My Courses
          </span>

          {/* If backend works */}
          {recentCourses.length > 0 ? (
            recentCourses.map((course) => (
              <FeatureCard
                key={course._id}
                image={logo}
                title={course.title}
                description={course.description}
                className="bg-linear-to-bl from-orange-500 to-blue-200 text-gray-200 h-50 ml-3 mr-3 mt-3 pt-5 pl-5 pr-5 rounded-lg"
              />
            ))
          ) : (
            <>
              {/* fallback (your original UI) */}
              <FeatureCard
                title="course1"
                description="complete DSA Playlist"
                className="bg-orange-600 text-gray-300 h-24 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"
              />
              <FeatureCard
                title="course2"
                description="complete java Playlist"
                className="bg-slate-900 text-gray-300 h-24 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"
              />
              <FeatureCard
                title="course3"
                description="complete Machine Learning Playlist"
                className="bg-blue-600 text-gray-300 h-24 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg "
              />
            </>
          )}

        </div>

      </div>

    </div>
  );
}