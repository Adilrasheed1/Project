export function FeatureCard(props){
return <div  className="mt-10  bg-slate-900 ml-5 mr-2 h-60 flex flex-col pl-5 pt-20 rounded-4xl border-1 border-gray-700">
<h3 className="text-base text-white
                font-bold ">{props.title}</h3>
<p className=" text-md text-gray-500 text-muted-foreground">{props.description}</p>
</div>
}