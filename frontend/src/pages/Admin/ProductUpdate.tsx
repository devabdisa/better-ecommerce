import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import type { ChangeEvent, FormEvent, FC } from "react";
import type { ApiError } from "../../types";
import { resolveImageUrl } from "../../utils/imageUrl";

const ProductUpdate: FC = () => {
  const params = useParams();

  const { data: productData, isLoading } = useGetProductByIdQuery(
    params._id as string,
  );

  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [stock, setStock] = useState<string>("");

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price.toString());
      setCategory(
        typeof productData.category === "object"
          ? productData.category._id
          : productData.category,
      ); // Handle populated vs unpopulated
      setQuantity(productData.quantity.toString());
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock.toString());
    }
  }, [productData]);

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files) {
      formData.append("image", e.target.files[0]);
    } else {
      return;
    }

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const paramsId = params._id as string;

      const data = await updateProduct({
        productId: paramsId,
        formData,
      }).unwrap();

      if ((data as any)?.error) {
        // Type assertion if needed, though unwrap usually throws
        toast.error((data as any).error);
      } else {
        toast.success(`Product successfully updated`);
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(error?.data?.message || "Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?",
      );
      if (!answer) return;

      const paramsId = params._id as string;
      await deleteProduct(paramsId).unwrap();

      toast.success(`Product is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      const error = err as ApiError;
      toast.error(error?.data?.message || "Delete failed. Try again.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen ml-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );

  return (
    <div className="md:ml-[5%] lg:ml-[4%] flex flex-col md:flex-row min-h-screen bg-background text-white">
      <AdminMenu />
      <div className="md:w-3/4 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 border-b border-gray-700 pb-4">
          Update / Delete Product
        </h1>

        <div className="bg-surface p-8 rounded-lg shadow-lg border border-gray-700">
          {image && (
            <div className="text-center mb-6">
              <img
                src={resolveImageUrl(image)}
                alt="product"
                className="block mx-auto max-h-75 w-auto rounded-lg shadow-md border border-gray-600"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="border border-dashed border-gray-500 hover:border-blue-500 hover:bg-surface/50 transition-all duration-300 text-gray-300 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-4">
              {image ? image : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

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
                min="1"
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
                type="text"
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
                value={category}
              >
                <option value="" disabled>
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

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
