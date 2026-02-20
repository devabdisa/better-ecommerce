import type { FC, ReactNode } from "react";
import type { MessageVariant } from "../types";

interface MessageProps {
  variant?: MessageVariant;
  children: ReactNode;
}

const Message: FC<MessageProps> = ({ variant = "info", children }) => {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-500",
        };
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-500",
        };
      default:
        return {
          bg: "bg-primary/10",
          border: "border-primary/20",
          text: "text-primary",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md ${styles.bg} ${styles.border} ${styles.text} font-bold text-xs uppercase tracking-widest flex items-center justify-center text-center`}
    >
      {children}
    </div>
  );
};

export default Message;
