function ExamCard({ title, color, onClick }) {
  return (
    <div 
      onClick={onClick}   
      className="bg-white rounded-xl font-serif shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition w-full max-w-[400px]"
    >

      {/* Top color bar */}
      <div style={{ backgroundColor: color }} className="h-20 flex items-center">
        <h3 className="p-1 m-2 text-lg bg-white text-black rounded-full">⅚</h3>
        <h3 className="text-gray-100 font-bebas tracking-wider text-2xl">
          MATH
        </h3>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-3xl font-bebas tracking-widest">{title}</h3>

        <p className="text-sm text-gray-500">
          Click to start this exam
        </p>
      </div>

      {/* Bottom color bar */}
      <div style={{ backgroundColor: color }} className="h-20"></div>

    </div>
  );
}

export default ExamCard;