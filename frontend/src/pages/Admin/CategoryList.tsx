import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import type { FormEvent, FC } from "react";
import type { Category, ApiError } from "../../types";

const CategoryList: FC = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [updatingName, setUpdatingName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      setName("");
      toast.success(`${result.name} is created.`);
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(
        error?.data?.message || error.error || "Creating category failed.",
      );
    }
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    if (!selectedCategory) return;

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      toast.success(`${result.name} is updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(error?.data?.message || "Updating category failed");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${selectedCategory.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(error?.data?.message || "Category deletion failed.");
    }
  };

  return (
    <div className="ml-20 flex flex-col md:flex-row min-h-screen bg-background text-white">
      <AdminMenu />
      <div className="md:w-3/4 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-700 pb-4">
          Manage Categories
        </h1>

        <div className="bg-surface p-6 rounded-lg shadow-lg border border-gray-700 mb-8 max-w-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Add New Category
          </h2>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </div>

        <div className="border-t border-gray-700 py-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            Existing Categories
          </h2>
          <div className="flex flex-wrap gap-4">
            {categories?.map((category: Category) => (
              <button
                key={category._id}
                className="bg-transparent border border-blue-500 text-blue-400 font-medium py-2 px-6 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:-translate-y-1 shadow-sm"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4 text-blue-400">
              Update Category
            </h3>
            <CategoryForm
              value={updatingName}
              setValue={(value: string) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
