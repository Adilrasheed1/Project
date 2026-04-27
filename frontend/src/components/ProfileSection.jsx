import { useState, useEffect } from "react";
import { FeatureCard } from "./FeatureCard";

export function ProfileSection({ className }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/courses/")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  const recentCourses = courses.slice(-3);

  return (
    <div className={`${className} h-full flex mr-5 items-center justify-center`}>

      <div className="bg-[#eeeff1] h-[90%] w-full rounded-xl shadow-2xl p-4 flex flex-col gap-4 overflow-hidden">

        <span className="font-semibold text-gray-700">My Courses</span>

        {/* If backend available */}
        {recentCourses.length > 0 ? (
          recentCourses.map((course) => (
            <FeatureCard
              key={course._id}
              title={course.title}
              description={course.description}
              className="bg-blue-600 text-gray-200 h-24 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"
            />
          ))
        ) : (
          <>
            {/* fallback (your original look) */}
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
              className="bg-blue-600 text-gray-300 h-24 ml-3 mr-3 mt-3 pt-5 pl-5 rounded-lg"
            />
          </>
        )}

      </div>

    </div>
  );
}