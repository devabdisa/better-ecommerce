import type { FC, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-1000 backdrop-blur-sm bg-black/50 transition-all duration-300">
          <div
            className="fixed inset-0 bg-black opacity-60"
            onClick={onClose}
          ></div>
          <div className="relative bg-surface p-6 rounded-lg shadow-2xl z-10 text-right min-w-75 border border-gray-700 animate-fade-in-up">
            <button
              className="text-gray-400 hover:text-white focus:outline-none mb-4 transition-colors"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-left w-full">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
