import { FeatureCard } from "./FeatureCard"

const Details=[{
    title:"AI-POWERED HINTS",
    description:"Get instant AI-generated hints and suggestions before connecting with a tutor"
},{
title:"Live Chat Support",
    description:"Real-time messaging with tutors for quick doubt resolution and guidance"
},{
    title:"Video Sessions",
    description:"Schedule one-on-one video calls for in-depth explanations and learning"
},
{
    title:"24/7 Availability",
    description:"Get instant Access tutors round the clock, whenever you need help with your studies"
},
{
    title:"Verified Tutors",
    description:"All tutors are verified professionals with proven expertise in their subjects"
},
{
    title:"Track Progress",
    description:"Monitor your learning journey with detailed analytics and progress reports"
}]
export  const  FeaturesGrid=()=>{
    return <div className="bg-gray-800 h-200 ">
         <h3 className="pl-100 pt-5 text-xl font-bold  text-gray-400 
         sm:text-4xl leading-tight">Everything You Need to Excel</h3>
        <p className="pl-93 pt-3 text-gray-500
        text-md">Our platform provides all the tools and features you need for effective learning</p>
    <div className="grid lg:grid-cols-3
    sm:grid-cols-2">
         {Details.map(detail=><div>
            <FeatureCard  className="col-span-1 " title={detail.title}
                description={detail.description}>
                
            </FeatureCard>         </div>)}
          
        </div>
    </div>
}