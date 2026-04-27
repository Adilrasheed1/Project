function SideCompo({ title, icon: Icon, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className="w-full flex flex-col items-center justify-center py-2 cursor-pointer transition duration-200 hover:scale-105 active:scale-95"
    >
      {/* ICON */}
      <div
        className={`h-12 w-12 flex items-center justify-center rounded-full shadow-md transition-all duration-200
          ${
            isActive
              ? "bg-[#F64515] text-white"
              : "bg-white text-black hover:bg-[#F64515] hover:text-white"
          }
        `}
      >
        {Icon && <Icon size={20} />}
      </div>

      {/* TEXT */}
      <span
        className={`mt-1 text-sm font-semibold transition ${
          isActive ? "text-[#F64515]" : "text-gray-600"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

export default SideCompo;