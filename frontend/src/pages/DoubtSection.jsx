
import { DoubtForm } from "../components/DoubtForm";

export function DoubtSection({setInCall}){
    return <div >
        <div className="mt-5 ml-5 "><h3 className="text-lg font-medium">Post Your Doubt</h3>
        <p className="font-basic text-gray-600">Describe your problem and get help from expert tutors or AI assistance

</p></div>
<DoubtForm setInCall={setInCall}/>

    </div>
}