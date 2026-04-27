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
    setUsername(user);

    fetch("http://localhost:3000/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => setDoubts(data))
      .catch(() => setDoubts([]));
  }, []);

  const recentDoubts = doubts.slice(-4);

  return (
    <div className={`h-full overflow-y-auto overflow-x-hidden ${className}`}>
      <div className="max-w-6xl mb-30 mx-auto w-full">

        {/* HOME */}
        {section === "home" && (
          <>
            <h1 className="text-5xl font-bold font-serif mt-10 ml-6">
              Welcome back, {user}
            </h1>

            <SearchBar />

            <div className="ml-6">
              <h3 className="pt-6 text-lg font-bold text-gray-600">
                Recent doubts
              </h3>

              <div className="flex gap-4 flex-wrap">
                {recentDoubts.map((doubt) => (
                  <FeatureCard
                    key={doubt._id}
                    title={doubt.title}
                    description={doubt.description}
                    className="mt-4 bg-gray-200 h-40 w-52 p-4 rounded-lg border border-gray-300 text-gray-700"
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
        {section === "doubts" && <DoubtSection />}

        {/* TEST */}
        {section === "Test" && (
          <TestDashboard setSelectedExam={setSelectedExam} />
        )}

      </div>
    </div>
  );
}