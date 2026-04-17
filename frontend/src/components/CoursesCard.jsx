import { ButtonComp } from "./ButtonComp"
export function CoursesCard(props){
    return <>
   <div className="h-45 mt-5 bg-white rounded-sm flex flex-row">
       <div className={` h-45 w-50 pt-10 pl-3 bg-gray-200 rounded-sm text-lg font-semibold flex flex-col  ${props.className} `}>
       
           
       </div>
       <div className="pt-10 pl-4  text-gray-400 font-semibold">
       <a >{props.title} </a>
       <p>{props.description}</p>
       <ButtonComp className="text-white bg-sky-500 mt-4 ml-3" title='Edit'/>
    </div>
      </div>
    </>
}