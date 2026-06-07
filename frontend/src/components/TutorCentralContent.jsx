import { FeatureCard } from "../components/FeatureCard";
import { DoubtSection } from "../pages/DoubtSection";
import { ButtonComp } from "./ButtonComp";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { useEffect } from "react";
import { Courses } from "./Courses";
import { TutorTestCompo } from "./TutorTestCompo";

export function TutorCentralContent({ section }) {
  const [doubts, setDoubts] = useState([]);

  useEffect(() => {
    fetch("https://project-3-7kx1.onrender.com/doubts/DoubtSection")
      .then(res => res.json())
      .then(data => {
        setDoubts(data);
      });
  }, []);

  const recentDoubts = doubts.slice(-4);

  return (
    <div className="col-span-3 mt-4 px-4 md:mt-5 md:ml-8 md:mr-8">

      <div><SearchBar /></div>

      {section === 'home' && (
        <div>


          <div className="bg-gray-300 mt-6 rounded-xl px-5 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:h-40 md:py-0">
            <div>
              <h3 className="text-xl font-semibold text-gray-600 md:text-2xl">
                Welcome Back, Adil!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                You have 5 pending sessions today.
              </p>
              <div className="flex items-center mt-2 bg-gray-200 w-36 h-9 rounded-lg justify-center">
                <span className="text-sm text-orange-500">5 sessions today</span>
              </div>
            </div>
            <div className="md:mr-5">
              <ButtonComp className="w-full md:w-auto text-white bg-orange-500" title="Session history" />
            </div>
          </div>

        
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">

            <div className="bg-gray-200 rounded-xl flex flex-col items-center justify-center py-5 px-3 text-center">
              <h2 className="text-sm text-gray-500 font-medium">Total students</h2>
              <span className="text-3xl text-gray-600 font-semibold mt-1 md:text-4xl">104</span>
              <span className="text-xs text-green-700 mt-2 md:text-sm">13 new this month</span>
            </div>

            <div className="bg-gray-200 rounded-xl flex flex-col items-center justify-center py-5 px-3 text-center">
              <h2 className="text-sm text-gray-500 font-medium">Open doubts</h2>
              <span className="text-3xl text-gray-600 font-semibold mt-1 md:text-4xl">3</span>
              <span className="text-xs text-orange-700 mt-2 md:text-sm">oldest: 4 hrs ago</span>
            </div>

            <div className="bg-gray-200 rounded-xl flex flex-col items-center justify-center py-5 px-3 text-center col-span-2 md:col-span-1">
              <h2 className="text-sm text-gray-500 font-medium">Average Rating</h2>
              <span className="text-3xl text-gray-600 font-semibold mt-1 md:text-4xl">4.8</span>
              <span className="text-xs text-green-700 mt-2 md:text-sm">based on 120 reviews</span>
            </div>

          </div>
        </div>
      )}

      {section === 'courses' && <Courses />}
      {section === 'Test' && <TutorTestCompo />}

    </div>
  );
}