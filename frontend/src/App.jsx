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
function DoubtSectionPage() {
  const [inCall, setInCall] = useState(false);
  return <DoubtSection setInCall={setInCall} inCall={inCall} />;
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
    
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
