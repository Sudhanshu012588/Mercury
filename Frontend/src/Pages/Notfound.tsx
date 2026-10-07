import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="text-[120px] font-bold leading-none text-indigo-500">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-2">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-3 text-center max-w-md">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white font-medium"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
