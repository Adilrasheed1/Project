export function GuideComp(){
    return <div className="grid grid-cols-4 h-120 bg-slate-950 pt-30  ">
       <div className="col-span-4 flex  flex-col justify-center items-center">
        <h3 className="text-4xl  font-bold text-gray-400 
        sm:text-5xl">How It Works</h3>
        <h5 className="text-lg font-base text-gray-500 ">Get started in three simple steps</h5>
       </div>
       <div className="grid grid-cols-3
      ">
        <div className="flex justify-between w-screen
        lg:col-span-3
        ">
            <div className="flex flex-col justify-center items-center
          
            
            ">
            <div className="bg-sky-600 h-20 w-20 flex justify-center pt-6 text-lg font-bold rounded-4xl">1</div>
            
                <h3 className="pt-5 pb-2 text-xl font-bold">Post Your Doubt</h3>
                <p className="text-sm font-base text-gray-500 ">Describe your problem with text, images, or audio. Add relevant subject tags.</p>
            </div>
     
      <div className="flex flex-col justify-center items-center
            
             ">
         <div className="bg-red-600 h-20 w-20 flex justify-center pt-6 text-lg font-bold rounded-4xl">2</div>
            
            
                <h3 className="pt-5 pb-2 text-xl font-bold">Get AI Hints or Connect</h3>
                <p className="text-sm font-base text-gray-500 ">Receive instant AI suggestions or connect with expert tutors for personalized help.</p>
            
            </div>
           <div className="flex flex-col justify-center items-center
       
           
            ">
            <div className="bg-green-600 h-20 w-20 flex justify-center pt-6 text-lg font-bold rounded-4xl">3</div>
           
                <h3 className="pt-5 pb-2 text-xl font-bold">Resolve & Learn</h3>
                <p className="text-sm font-base text-gray-500 pr-10 ">Solve your doubts through chat or video sessions and strengthen your understanding.</p>
           
            </div>
            </div>
            </div>
    </div>
}