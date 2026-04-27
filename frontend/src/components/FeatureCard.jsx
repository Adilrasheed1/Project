export function FeatureCard(props){
return <div className={`${props.className}`} key={props.key} >
<h3 className="text-base 
                font-bold ">{props.title}</h3>
<p className=" text-md text-gray-700 text-muted-foreground">{props.description}</p>
</div>
}