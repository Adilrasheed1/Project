import { useNavigate } from "react-router-dom"
import { ButtonComp } from "./ButtonComp";

export function AppBar(){
const navigate=useNavigate();

   return (
  <div className="flex items-center justify-between px-6 py-3 bg-gray-300 flex-wrap gap-y-2">
    
    {/* Logo */}
    <div className="text-lg font-bold">Doubtsolver</div>

    {/* Nav Links - hidden on mobile, shown on md+ */}
    <div className="hidden md:flex items-center gap-6 text-sm">
      <span className="hover:text-fuchsia-500 cursor-pointer">Features</span>
      <span className="hover:text-fuchsia-500 cursor-pointer">Tutors</span>
      <span className="hover:text-fuchsia-500 cursor-pointer">Pricing</span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate("/LoginPage")}
        className="text-sm hover:text-fuchsia-500"
      >
        Login
      </button>
      <button
        onClick={() => navigate("/tutorLogin")}
        className="text-sm hover:text-fuchsia-500"
      >
        Tutor Login
      </button>
      <button
        onClick={() => navigate("/SignupPage")}
        className="bg-violet-900 text-white text-sm px-4 py-2 rounded hover:bg-violet-700 transition"
      >
        Get Started
      </button>
    </div>

  </div>
)}