import type { FC } from "react";
import {
  FaCheck,
  FaMapMarkerAlt,
  FaShippingFast,
  FaReceipt,
} from "react-icons/fa";

interface ProgressStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
}

const ProgressSteps: FC<ProgressStepsProps> = ({
  step1 = false,
  step2 = false,
  step3 = false,
}) => {
  return (
    <div className="flex justify-center items-center w-full max-w-2xl mx-auto mb-16 mt-8 px-4">
      {/* Step 1: Login/Address */}
      <div className="flex flex-col items-center relative gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
            step1
              ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              : "bg-surface border-white/10 text-text-muted"
          }`}
        >
          {step1 && step2 ? (
            <FaCheck size={14} />
          ) : (
            <FaMapMarkerAlt size={14} />
          )}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            step1 ? "text-primary" : "text-text-muted"
          }`}
        >
          Shipping
        </span>
      </div>

      <div
        className={`flex-1 h-0.5 mx-4 transition-all duration-700 ${
          step1 && step2
            ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            : "bg-white/5"
        }`}
      />

      {/* Step 2: Payment/Review */}
      <div className="flex flex-col items-center relative gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
            step2
              ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              : "bg-surface border-white/10 text-text-muted"
          }`}
        >
          {step2 && step3 ? (
            <FaCheck size={14} />
          ) : (
            <FaShippingFast size={16} />
          )}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            step2 ? "text-primary" : "text-text-muted"
          }`}
        >
          Place Order
        </span>
      </div>

      <div
        className={`flex-1 h-0.5 mx-4 transition-all duration-700 ${
          step2 && step3
            ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            : "bg-white/5"
        }`}
      />

      {/* Step 3: Complete */}
      <div className="flex flex-col items-center relative gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
            step3
              ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              : "bg-surface border-white/10 text-text-muted"
          }`}
        >
          <FaReceipt size={14} />
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            step3 ? "text-primary" : "text-text-muted"
          }`}
        >
          Confirmation
        </span>
      </div>
    </div>
  );
};

export default ProgressSteps;
