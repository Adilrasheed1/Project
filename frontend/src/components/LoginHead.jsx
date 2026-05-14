export function LoginHead(props){
    return <div className="pl-20 pt-10">
        <div className="text-black text-4xl text-gray-400  pl-5 font-bold ">DoubtSolver</div>
        <div><h3 className="text-4xl font-medium pt-5 text-gray-400  ">Welcome Back</h3>
        <p className="pl-4 pt-2 text-gray-500  ">{props.msg}</p></div>
    </div>
}