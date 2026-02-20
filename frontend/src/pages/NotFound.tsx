import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Meta title="404 | Page Not Found" />
      <div className="text-center space-y-8">
        <h1 className="text-[12rem] font-black leading-none text-white/5 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none animate-pulse">
          404
        </h1>

        <div className="relative z-10 space-y-4">
          <div className="px-4 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] w-fit mx-auto">
            Security Alert
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Lost in <span className="text-primary italic">Cyber Space?</span>
          </h2>
          <p className="text-text-muted max-w-md mx-auto font-medium">
            The coordinates you requested do not exist in our database. You
            might have taken a wrong turn or the content has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="relative z-10 inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
        >
          Return to Base Console
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
