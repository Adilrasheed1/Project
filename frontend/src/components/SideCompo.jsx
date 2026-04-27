export function SideCompo({ icon: Icon, title, onClick, isActive }) {
  return (
    <div className="flex flex-col transition-all duration-200 hover:scale-105 active:scale-95 items-center gap-1 cursor-pointer" onClick={onClick}>
      
      <div
        className={`h-14 w-14 flex items-center justify-center rounded-full transition shadow-md ${
          isActive
            ? "bg-[#F64515] text-white"
            : "bg-white text-black hover:bg-[#F64515] hover:text-white"
        }`}
      >
        <Icon size={22} />
      </div>

      <span className={`text-xs ${isActive ? "text-[#F64515]" : ""}`}>
        {title}
      </span>
      
export function SideCompo(props){
    return <div  >
        <div className={` ${props.className} h-10   w-35 bg-gray-200 flex justify-center items-center mt-8 rounded-md border-1 border-gray-100 ` } onClick={props.onClick} 
     
>
          <a href="#">{props.title}</a></div> 
    </div>
  );
}