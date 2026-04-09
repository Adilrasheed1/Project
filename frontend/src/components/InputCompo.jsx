export function InputCompo(props){
    return <div><label for="input-9" className="block text-sm font-medium text-gray-700">{props.label}</label>
        <div class="flex items-center mt-1">
<<<<<<< HEAD
            <input type={props.Type} id="input-9" className={`${props.className}`} placeholder={props.Placeholder} onChange={props.onchangemail} value={props.value}/>
=======
            <input type={props.Type} id="input-9" className={`${props.className}`} placeholder={props.Placeholder} onChange={props.onchangemail}/>
>>>>>>> 90c22c10369290dd69b7be6935de4c50e516b84a
            
        </div>
    </div>
}