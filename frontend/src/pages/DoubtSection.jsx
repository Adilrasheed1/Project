import { DoubtForm } from "../components/DoubtForm";
import { MessageCircleQuestion, Users, Video, CheckCircle2 } from "lucide-react";

export function DoubtSection({ setInCall }) {
  return (
    <div>
      {/* ── Heading ── */}
      <div className="mt-8 ml-6 mr-6 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F64515" }}>
          <MessageCircleQuestion size={20} color="white" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Post Your Doubt
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Describe what you're stuck on and get help from an expert tutor.
            
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <DoubtForm setInCall={setInCall} />

      {/* ── How it works box (spans full width of main content area) ── */}
      <div className="w-full mt-10 mb-6 px-6">
        <div
          className="w-full rounded-2xl p-6"
          style={{ background: "#eeeff1" }}
        >
          <p className="text-xs font-bold tracking-widest text-gray-500 mb-4">
            HOW CONNECTING TO A TUTOR WORKS
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Step
              icon={<MessageCircleQuestion size={18} color="white" />}
              iconBg="#F64515"
              title="1. Post your doubt"
              text="Add a clear title and description so tutors know exactly what you need."
            />
            <Step
              icon={<Users size={18} color="white" />}
              iconBg="#165ee7"
              title="2. A tutor picks it up"
              text="Available tutors matching your subject get notified and can accept it."
            />
            <Step
              icon={<Video size={18} color="white" />}
              iconBg="#9fd200"
              title="3. Join the call"
              text="Once accepted, you'll be moved into a live session to solve it together."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ icon, iconBg, title, text }) {
  return (
    <div className="flex gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}