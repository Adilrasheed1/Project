export function InputCompo(props){
    return <div><label htmlFor="input-9" className="block text-sm font-medium text-gray-700">{props.label}</label>
        <div className="flex items-center mt-1">
            <input type={props.Type} id="input-9" className={`${props.className}`} placeholder={props.Placeholder} onChange={props.onchangemail} value={props.value}/>
           
            
        </div>
    </div>
}