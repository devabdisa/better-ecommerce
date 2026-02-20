import type { FC } from "react";

const Background: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#0a0a0c]">
      <div className="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute top-[30%] -right-[5%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
    </div>
  );
};

export default Background;
