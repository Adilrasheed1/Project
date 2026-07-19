import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";



import './App.css'
import { LandingPage } from './pages/LandingPage'

import { DoubtSection } from './pages/DoubtSection';

import {AuthPages} from "./pages/AuthPages";
import {CoursesPage} from "./pages/CoursesPage";
import { TeacherDashboard } from './pages/TeacherDashboard';
import OrdersPage from "./pages/ordersPage";
import LecturePage from "./pages/lecturepage";
import StudentDashboard from "./pages/StudentDashboard";
import CourseDetail from "./pages/CourseDetail";
import PaymentPage from "./pages/PaymentPage";
import ForgotPassword from "./pages/ForgotPassword";
import StudentProfile from "./pages/StudentProfile";
import TestsPage from "./pages/TestsPage";

import SharedSidebar from "./components/SharedSidebar";
import StudentRightPanel from "./components/StudentRightPanel";

function DoubtSectionPage() {
  const [inCall, setInCall] = useState(false);
 return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: "#ffffff" }} className="app-shell">
        <style>{`
          .app-main::-webkit-scrollbar,
          .app-rightPanel::-webkit-scrollbar {
            display: none;
          }
          .app-main,
          .app-rightPanel {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          @media (max-width: 900px) {
            /* same pattern as CoursesPage/OrdersPage/StudentDashboard/TestsPage:
               right panel removed on small screens (team decision pending),
               and bottom padding reserved so the floating nav pill doesn't
               sit on top of the "How it works" box at the end of the page.
               Only paddingBottom is forced here (not left/right) because
               DoubtSection.jsx already manages its own horizontal spacing
               with mx-4/sm:mx-6 Tailwind classes - adding page-level
               horizontal padding too would double it up. */
            .app-rightPanel { display: none !important; }
            .app-main { padding-bottom: 100px !important; }
          }
        `}</style>

      <SharedSidebar activePage="doubts" />

      <div
        style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto" }}
        className="app-main"
      >
        <DoubtSection setInCall={setInCall} inCall={inCall} />
      </div>

      <StudentRightPanel />
    </div>
  );
}


function App() {
  

  return (
    <>

      <BrowserRouter>
     
   
    <Routes>
       <Route path="/courses" element={<CoursesPage />} />
       <Route path="/auth" element={<AuthPages />} />
      <Route path="/" element={<LandingPage/>}/>
     
      <Route path="/teacher" element={<TeacherDashboard />} />

      <Route path="/DoubtSection" element={<DoubtSectionPage/>}/>
       <Route path="/orders" element={<OrdersPage />} />
        <Route path="/lecture" element={<LecturePage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/testdashboard" element={<TestsPage />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App