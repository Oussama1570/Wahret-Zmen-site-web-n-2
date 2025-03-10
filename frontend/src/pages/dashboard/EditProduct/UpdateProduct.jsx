import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useFetchProductByIdQuery, useUpdateProductMutation } from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useFetchProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("category", productData.category);
      setValue("trending", productData.trending);
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("coverImage", productData.coverImage);
    }
  }, [productData, setValue]);

  // ✅ Handle Update
  const onSubmit = async (data) => {
    const updateProductData = {
      ...data,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || productData.coverImage,
    };

    try {
      await axios.put(`${getBaseUrl()}/api/products/edit/${id}`, updateProductData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire("Success!", "Product updated successfully!", "success");
      await refetch();
    } catch (error) { 
      Swal.fire("Error!", "Failed to update product.", "error");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center text-red-500">Error fetching product data.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold text-center text-[#A67C52] mb-4">Update Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 🔹 Product Details */}
        <input {...register("title")} className="w-full p-2 border rounded" placeholder="Product Name" required />
        <textarea {...register("description")} className="w-full p-2 border rounded" placeholder="Description" required />

        {/* 🔹 Category Selection */}
        <select {...register("category")} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          <option value="kaftan">Kaftan</option>
          <option value="jebba">Jebba</option>
          <option value="gandoura">Gandoura</option>
          <option value="safsari">Safsari</option>
          <option value="chachia">Chachia</option>
        </select>

        {/* 🔹 Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <input {...register("oldPrice")} type="number" className="w-full p-2 border rounded" placeholder="Old Price" required />
          <input {...register("newPrice")} type="number" className="w-full p-2 border rounded" placeholder="New Price" required />
        </div>

        {/* 🔹 Trending Checkbox */}
        <label className="flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />
          Trending Product
        </label>

        {/* 🔹 Update Image */}
        <input {...register("coverImage")} type="text" className="w-full p-2 border rounded" placeholder="Cover Image URL" required />

        {/* 🔹 Submit Button */}
        <button type="submit" className="w-full py-2 bg-[#A67C52] text-white rounded-md hover:bg-[#8a5d3b] transition">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
