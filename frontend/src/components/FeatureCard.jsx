
export function FeatureCard(props){
return <div className={`${props.className}`} key={props.key} >
    <div >
        <img src={props.image} alt={props.title} className="w-full  h-20 object-cover rounded-md mb-2" />

    </div>
    <div className="flex flex-col">
<h3 className="text-base 
                font-bold ">{props.title}</h3>
<p className=" text-md text-gray-700 text-muted-foreground">{props.description}</p>
</div>
</div>
}