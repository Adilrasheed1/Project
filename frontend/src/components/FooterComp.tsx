export function FooterComp(){
    return <div className="h-100 w-screen flex justify-center items-center">
        <div className="bg-blue-500 h-70 w-230 flex flex-col justify-center items-center rounded-lg 
        "><h2 className="text-4xl font-bold pt-5 pb-5">Ready to Start Learning?</h2>
        <p className="text-lg ">Join thousands of students who are already excelling with DoubtSolver</p>
        <div className="flex  
        pt-5
        flex-col 
        sm:flex-row
        
        "><button className="bg-cyan-300 text-md font-semibold h-10 w-100 text-gray-700 rounded-lg mr-5
         sm:w-50 mt-3">Get Started Free</button>
        <button className="text-md font-semibold h-10 w-100 rounded-lg bg-slate-400
        sm:w-50 mt-3">Browse Tutors</button>
        </div></div>
    </div>
}