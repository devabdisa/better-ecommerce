import type { FC, FormEvent } from "react";

interface CategoryFormProps {
  value: string;
  setValue: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
  buttonText?: string;
  handleDelete?: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full bg-surface text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition-colors"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between items-center gap-4">
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all font-medium shadow-md">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              type="button" // Important to prevent form submission
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all font-medium shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
