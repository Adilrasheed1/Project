import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";

export function DoubtForm(){
    return <div className="h-150 w-150  mx-5 my-5 rounded-lg border-1 border-gray-200 pt-5 pl-5 ">
        <InputCompo label="Doubt" Type="text"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " Placeholder="write the name of doubt"/>
        <InputCompo label="Detailed Description" Type="text" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="Explain your doubt in detail....."/>
        <InputCompo label="Attachments" Type="file" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="choose image"/>
        <ButtonComp title="Connect To Tutor" className={"bg-gray-200 text-gray-700 border-1 border-gray-200 mt-5 ml-3"} />
    </div>
}