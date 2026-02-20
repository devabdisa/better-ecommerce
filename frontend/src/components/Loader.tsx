import type { FC } from "react";

const Loader: FC = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-25">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-purple-500/20" />
        <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin-slow" />
      </div>
    </div>
  );
};

export default Loader;
