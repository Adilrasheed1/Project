
import { ButtonComp } from "./ButtonComp";
import { useNavigate } from "react-router-dom";


export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center  dark:bg-gray-100 px-6 py-10">
      
  
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-400">
          Solve Your Doubts Instantly with{' '}
          <span className="text-primary">Expert Tutors</span>
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed">
          Connect with verified tutors, get instant AI hints, and resolve your academic
          doubts through chat or video sessions. Learning made simple and effective.
        </p>

   
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <ButtonComp
            className="w-full sm:w-auto"
            title="Post a Doubt"
            click={() => navigate("/LoginPage")}
          />
          <button
            onClick={() => navigate('/tutorSignup')}
            className="w-full sm:w-auto h-10 px-6 bg-gray-800 text-gray-400 font-bold text-base rounded hover:bg-gray-700 transition"
          >
            Become a Tutor
          </button>
        </div>


        <div className="flex items-center gap-8 pt-2 text-gray-400">
          <div>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-gray-500">Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-gray-500">Expert Tutors</div>
          </div>
          <div>
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-gray-500">Doubts Solved</div>
          </div>
        </div>
      </div>


      <div className="w-full">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
          alt="Students studying"
          className="w-full rounded-3xl shadow-2xl object-cover"
        />
      </div>

    </div>
  );
}