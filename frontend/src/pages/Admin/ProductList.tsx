import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import type { ChangeEvent, FormEvent, FC } from "react";
import type { ApiError } from "../../types";
import { resolveImageUrl } from "../../utils/imageUrl";

const ProductList: FC = () => {
  const [image, setImage] = useState<File | string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image as string | Blob);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const res = await createProduct(productData).unwrap();

      if (res.error) {
        toast.error((res.error as string) || "Creating product failed");
      } else {
        toast.success(`${res.name} is created`);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(error?.data?.message || "Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files) {
      formData.append("image", e.target.files[0]);
    } else {
      return;
    }

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  return (
    <div className="ml-20 flex flex-col md:flex-row min-h-screen bg-background text-white">
      <AdminMenu />
      <div className="md:w-3/4 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-700 pb-4">
          Create Product
        </h1>

        {imageUrl && (
          <div className="text-center mb-6">
            <img
              src={resolveImageUrl(imageUrl)}
              alt="product"
              className="block mx-auto max-h-50 rounded-lg shadow-lg border border-gray-700"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="border border-dashed border-gray-500 hover:border-blue-500 hover:bg-surface transition-all duration-300 text-gray-300 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-12">
            {image
              ? typeof image === "string"
                ? image
                : image.name
              : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className={!image ? "hidden" : "hidden"} // Always hide input
            />
          </label>
        </div>

        <div className="bg-surface p-8 rounded-lg shadow-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-400 mb-2 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-gray-400 mb-2 font-medium"
              >
                Price
              </label>
              <input
                type="number"
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="quantity"
                className="block text-gray-400 mb-2 font-medium"
              >
                Quantity
              </label>
              <input
                type="number"
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="brand"
                className="block text-gray-400 mb-2 font-medium"
              >
                Brand
              </label>
              <input
                type="text"
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <label
            htmlFor="description"
            className="block text-gray-400 mb-2 font-medium"
          >
            Description
          </label>
          <textarea
            className="p-3 mb-6 bg-background border rounded-lg w-full text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="stock"
                className="block text-gray-400 mb-2 font-medium"
              >
                Count In Stock
              </label>
              <input
                type="number"
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-gray-400 mb-2 font-medium"
              >
                Category
              </label>
              <select
                className="p-3 w-full border rounded-lg bg-background text-white border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled selected>
                  Choose Category
                </option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 rounded-lg font-bold text-white bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 transition-all duration-300 transform hover:scale-[1.01] shadow-lg"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
