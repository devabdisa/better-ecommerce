import type { FC, ReactNode } from "react";
import type { MessageVariant } from "../types";

interface MessageProps {
  variant?: MessageVariant;
  children: ReactNode;
}

const Message: FC<MessageProps> = ({ variant = "info", children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div
      className={`p-4 rounded border ${getVariantClass()} transition-opacity duration-300`}
    >
      {children}
    </div>
  );
};

export default Message;
