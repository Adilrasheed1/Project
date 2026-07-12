import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";



import './App.css'
import { LandingPage } from './pages/LandingPage'

import { DoubtSection } from './pages/DoubtSection';

import {AuthPages} from "./pages/AuthPages";
import {CoursesPage} from "./pages/CoursesPage";
import { TeacherDashboard } from './pages/TeacherDashboard';
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
    
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
