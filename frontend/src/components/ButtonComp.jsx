export const ButtonComp = (props) => {
  return (
    <div>
      <div
        className={`text-base font-bold text-gray-400 
        ${props.className} w-full h-10 flex justify-center items-center rounded sm:w-45`}
      >
        <button onClick={props.click}>
          {props.title}
        </button>
      </div>
    </div>
  );
};