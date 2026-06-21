import { LoginHead } from "./LoginHead";

export const LoginCard = (props) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-200">

      <div className="mb-10">
        <LoginHead msg={props.msg} />
      </div>

      <div className="bg-gray-400 w-96 p-6 rounded-lg border border-gray-500 flex flex-col gap-4">


        <label className="text-sm font-medium text-white">
          Email
        </label>
        <input
          type="email"
          className="w-full h-10 px-3 text-sm text-gray-700 border border-gray-400 bg-gray-500 rounded-lg"
          placeholder="user@mail.com"
          onChange={props.onchangemail}
        />

        <label className="text-sm font-medium text-white">
          Password
        </label>
        <input
          type="password"
          className="w-full h-10 px-3 text-sm text-gray-700 border border-gray-900 bg-gray-500 rounded-lg"
          placeholder="Enter your password"
          onChange={props.onchangepassword}
        />

     
        <button
          className="w-full h-10 text-sm text-white bg-blue-600 mt-2 rounded-lg"
          onClick={props.onclick}
        >
          {props.button}
        </button>

      </div>

    </div>
  );
};