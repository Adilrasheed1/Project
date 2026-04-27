import { useState, useEffect } from "react";
import { FeatureCard } from "./FeatureCard";

export function ProfileSection({ className }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/courses/")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
      })
      .catch(err => {
        console.error("Failed to fetch courses", err);
      });
  }, []);

  const recentCourses = courses.slice(-3);

  return (
    <div className={`${className} h-full flex items-center justify-center mr-5`}>
      
      <div className="bg-[#eeeff1] h-[90%] w-full rounded-xl shadow-2xl p-4 flex flex-col gap-4 overflow-hidden">

        {/* Profile */}
        <div className="flex justify-center items-center h-40 bg-gray-200 rounded-lg border border-gray-300">
          <div className="h-20 w-20 rounded-full border-2 border-blue-500 bg-gray-400"></div>
        </div>

        {/* Courses */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <span className="text-lg font-semibold text-gray-700">
            My Courses
          </span>

          {recentCourses.map((course) => (
            <FeatureCard
              key={course._id}
              title={course.title}
              description={course.description}
              className="bg-sky-600 text-gray-200 p-3 rounded-lg"
            />
          ))}
        </div>

      </div>

    </div>
  );
}