import { FeatureCard } from "./FeatureCard"

const Details = [
  {
    title: "AI-Powered Hints",
    description: "Get instant AI-generated hints and suggestions before connecting with a tutor"
  },
  {
    title: "Live Chat Support",
    description: "Real-time messaging with tutors for quick doubt resolution and guidance"
  },
  {
    title: "Video Sessions",
    description: "Schedule one-on-one video calls for in-depth explanations and learning"
  },
  {
    title: "24/7 Availability",
    description: "Access tutors round the clock, whenever you need help with your studies"
  },
  {
    title: "Verified Tutors",
    description: "All tutors are verified professionals with proven expertise in their subjects"
  },
  {
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and progress reports"
  }
]

export const FeaturesGrid = () => {
  return (
    <div className="bg-gray-200 py-16 px-6">

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h3 className="text-2xl sm:text-4xl font-bold text-gray-400 leading-tight">
          Everything You Need to Excel
        </h3>
        <p className="text-gray-500 text-base mt-3">
          Our platform provides all the tools and features you need for effective learning
        </p>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Details.map((detail, index) => (
          <FeatureCard
            key={index}
            className="bg-gray-400 border border-gray-700 rounded-3xl p-6 flex flex-col h-full"
            title={detail.title}
            description={detail.description}
          />
        ))}
      </div>

    </div>
  )
}