import { LoginHead } from "./LoginHead"

export const LoginCard=(props)=>{
  
   return <div className=" h-screen w-full flex items-center  flex-col justify-center bg-slate-900">
    
<div className="mb-20"><LoginHead /></div>
        <div className="bg-gray-700 w-130 h-80 ml-50 flex justify-center flex-col  pl-20 rounded-lg border-1 border-gray-500"><label htmlFor="input-9" className="block text-sm font-medium text-white">Email</label>
        <div className="flex items-center mt-1">
            <input type="email" id="input-9" className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-400 bg-gray-500 rounded-lg" placeholder="user@mail.com" onChange={props.onchangemail}/>
            
        </div>
        <label htmlFor="input-9" className="block text-sm font-medium text-white">Password</label>
        <div className="flex items-center mt-1">
            <input type="password" id="input-9"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-900 bg-gray-500 rounded-lg" placeholder="Enter your password" onChange={props.onchangepassword}/>
            
        </div>
        <button className="w-80 h-10 px-3 text-sm text-white  border-1 border-gray-900 bg-blue-600  mt-4 rounded-lg" onClick={props.onclick}>{props.button}</button>
        </div>
   </div>
    
}