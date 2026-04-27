import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Exam  from './pages/exam';



import './App.css'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DoubtSection } from './pages/DoubtSection';
import { StudentDashboard } from './pages/StudentDashboard';
import { TutorSignup } from './pages/TutorSignup';
import { TutorLogin } from './pages/TutorLogin';
import { TutorDashboard } from './pages/TutorDashboard';


function App() {
  

  return (
    <>

      <BrowserRouter>
     
   
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/LoginPage" element={<LoginPage/>}/>
      <Route path="/SignupPage" element={<SignupPage/>}/>
      <Route path="/DoubtSection" element={<DoubtSection/>}/>
      <Route path="/StudentDashboard" element={<StudentDashboard/>}/>
     
      <Route path="/tutorSignup" element={<TutorSignup/>}/>
      <Route path="/tutorLogin" element={<TutorLogin/>}/>
      <Route path="/TutorDashboard" element ={<TutorDashboard/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
