
import { ButtonComp } from "./ButtonComp";
import { useNavigate } from "react-router-dom";


export function HeroSection(){
  const navigate=useNavigate()
    return <div className="grid lg:grid-cols-2 gap-12 items-center dark:bg-gray-900 pb-4">
      <div className="col-span-1 pt-10 pl-4">
         <h1 className="text-4xl text-gray-400 sm:text-5xl lg:text-6xl font-bold leading-tight">
                Solve Your Doubts Instantly with{' '}
                <span className="text-primary">Expert Tutors</span>
              </h1>
              <p className=" text-gray-500 text-lg text-muted-foreground ">
                Connect with verified tutors, get instant AI hints, and resolve your academic
                doubts through chat or video sessions. Learning made simple and effective.
              </p>
              <div className="flex 
              flex-col

              w-100 pt-8 pb-4
              sm:flex-row justify-between
              
              ">
              <ButtonComp  className="w-200  bg-gray-100    sm:w-45" title="Post a Doubt" click={()=>{
                 navigate("/LoginPage")
              }}/>
                <div className="text-base
                font-bold 
                text-gray-400 
                
                bg-gray-800 w-100 h-10
                flex justify-center rounded
                sm:w-45 "><button onClick={()=>{
                  navigate('/tutorSignup')
                }}>Become a Tutor</button></div>
              </div>
             
              <div className="flex items-center   text-gray-400  gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Expert Tutors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Doubts Solved</div>
                </div>
                
              </div>
              </div>
              <div className="col-span-1 pt-12 pr-4 ">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Students studying"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
    </div>
}