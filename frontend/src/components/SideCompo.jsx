export function SideCompo(props){
    return <div  >
        <div className={` ${props.className} h-10   w-35 bg-gray-200 flex justify-center items-center mt-8 rounded-md border-1 border-gray-100 hover:bg-orange-700 hover:text-gray-100` } onClick={props.onClick} 
     
>
          <a href="#">{props.title}</a></div> 
    </div>
}