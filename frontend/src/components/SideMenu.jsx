import { SideCompo } from "./SideCompo";
import { useNavigate } from "react-router-dom";

export function SideMenu(props){
    const navigate=useNavigate();
    return <div className={`${props.className}`}>
<<<<<<< HEAD
        <div className="h-138  w-60 bg-gray-300 flex flex-col pl-5 pt-20 text-lg font-semibold rounded-lg border-1 border-orange-800">
=======
        <div className="h-screen w-60 bg-gray-300 flex flex-col pl-5 pt-20 text-lg font-semibold">
>>>>>>> 90c22c10369290dd69b7be6935de4c50e516b84a
           <SideCompo title="Home" className='bg-orange-800 disabled:bg-gray-200'  />
            <SideCompo title="DoubtSection" className=' active:bg-orange-800' onClick={()=>navigate("/DoubtSection")} />
            <SideCompo title="Courses"/>
            <SideCompo title="Progress"/>
            <SideCompo title="Tests"/>
        </div>
    </div>
}