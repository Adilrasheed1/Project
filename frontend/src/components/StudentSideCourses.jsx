export function StudentSideCourses({course}){

    
    return <div >
      
      <div className="h-30 w-40 bg-gray-200 mt-20 pt-5 pl-3 rounded-sm hover:shadow-lg hover:scale-105 transition duration-200 
                 "> 
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        </div>  
    </div>
}