import { useNavigate } from "react-router-dom"
import { ButtonComp } from "./ButtonComp";

export function AppBar(){
const navigate=useNavigate();

    return <div className=" grid grid-cols-11 h-12 pt-2 pl-4 bg-gray-300" >
     <div className="col-span-4 text-lg font-bold ">Doubtsolver</div>
     <div className="col-span-1 hover:text-fuchsia-400">Features</div>
     <div className="col-span-1 hover:text-fuchsia-400">Tutors</div>
     <div className="col-span- 1 hover:text-fuchsia-400">Pricing</div>
     <div className="col-span-1 hover:text-fuchsia-400 "><button onClick={()=>{
          navigate("/LoginPage")
        }}>Login</button></div>
        <button  className="hover:text-fuchsia-400 " onClick={()=>{
          navigate("/tutorLogin")
        }}>tutor Login</button>
          <div className="col-span-2 w-35 h-9 flex justify-center items-center bg-violet-900 rounded"><ButtonComp click={()=>{
          navigate("/SignupPage")
          
        }} className="bg-black-800" title="Get Started">
          
         </ButtonComp></div>
      
    </div>
    
}