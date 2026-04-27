import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { SearchBar } from "./SearchBar";
import { useState, useEffect } from "react";
import TestDashboard from "../components/TestDashboard";

export function CentralContent({ section, className, setSelectedExam }) {

  const [doubts, setDoubts] = useState([]);
  const [user, setUsername] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const user = username?.split(" ")[0];
    setUsername(user || ""); // ✅ safe

    fetch("http://localhost:3000/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => setDoubts(data))
      .catch(() => setDoubts([]));
  }, []);

  const recentDoubts = doubts.slice(0, 4); // keep consistent

  return (
    <div className={`h-full overflow-y-auto overflow-x-hidden no-scrollbar ${className}`}>
      <div className="max-w-6xl mb-30 mx-auto w-full">

        {/* HOME */}
        {section === "home" && (
          <>
            {/* KEEP YOUR HERO STYLE */}
            <h1 className="text-7xl font-extrabold font-serif mt-2 sm:mt-20 ml-10">
              COURSES THAT TEACH. MENTORS THAT GUIDE.
            </h1>

            {/* Optional: small welcome line */}
            <p className="ml-10 mt-2 text-gray-500">
              Welcome back, {user}
            </p>

            <SearchBar />

            <div className="ml-10">
              <h3 className="pt-10 text-lg font-bold text-gray-600">
                Recent doubts
              </h3>

              {/* TAKE THEIR FLEX IMPROVEMENT */}
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

              {/* TAKE THEIR CLEAN LINK POSITION */}
              <a href="#" className="block mt-4 hover:text-blue-500">
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
}