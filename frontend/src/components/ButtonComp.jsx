

export const ButtonComp=(props)=>{
   
    return <div> <div className={`text-base
                font-bold 
                text-gray-400 
               
                ${props.className} w-100 h-10
           
                
                flex justify-center rounded
        sm:w-45
    `}><button onClick={props.click} >{props.title}</button></div></div>
}
    `}><button onClick={props.click}   >{props.title}</button></div></div>
}
