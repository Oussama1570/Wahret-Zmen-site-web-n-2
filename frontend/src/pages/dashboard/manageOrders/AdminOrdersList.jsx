import React, { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderMutation, useDeleteOrderMutation, useSendOrderNotificationMutation } from "../../../redux/features/orders/ordersApi.js";
import Swal from "sweetalert2";
import axios from "axios";

const AdminOrdersList = () => {
  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [sendOrderNotification] = useSendOrderNotificationMutation();

  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});

  // ✅ Handle Edit Order
  const handleEdit = async (orderId) => {
    try {
      await updateOrder({
        orderId,
        ...updatedValues,
      }).unwrap();

      Swal.fire("Success", "Order updated successfully!", "success");
      setEditingOrder(null);
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to update order. Please try again.", "error");
    }
  };

  // ✅ Handle Change in Editable Fields
  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({ ...prev, [field]: value }));
  };
  

  // ✅ Handle Send Notification
  const handleSendNotification = async (orderId, email, name, completionPercentage) => {
    try {
      await sendOrderNotification({ orderId, email, completionPercentage }).unwrap();

      const message =
        completionPercentage < 100
          ? `Progress update sent to ${name}: Order is ${completionPercentage}% completed.`
          : `Order completion notice sent to ${name}: Your order is fully ready!`;

      Swal.fire("Notification Sent", message, "success");
    } catch (error) {
      Swal.fire("Error", `Failed to send notification to ${name}. Please try again.`, "error");
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">Manage Orders</h3>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border border-collapse border-gray-300">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">#</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Order ID</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Products</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Customer</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Mail</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Phone</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Address</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Total Price</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Paid</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Delivered</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Completion %</th>
                  <th className="px-6 py-3 text-xs uppercase border border-gray-300 font-semibold text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="border-b border-gray-300">
                    <td className="border px-6 py-4 text-xs text-blueGray-700">{index + 1}</td>
                    <td className="border px-6 py-4 text-xs">{order._id.slice(0, 8)}...</td>

                    {/* ✅ Product ID & Quantity Section */}
                    <td className="border px-6 py-4 text-xs">
                      {Array.isArray(order.products) && order.products.length > 0 ? (
                        order.products.map((prod) => (
                          <div key={prod.productId?._id || prod.productId} className="border-b py-1">
                            <strong>ID:</strong> {typeof prod.productId === "object" ? prod.productId._id.slice(0, 8) : prod.productId.slice(0, 8)}... |
                            <strong> Qty:</strong> {prod.quantity}
                          </div>
                        ))
                      ) : (
                        "No Products"
                      )}
                    </td>

                    <td className="border px-6 py-4 text-xs">{order.name}</td>
                    <td className="border px-6 py-4 text-xs">{order.email}</td>
                    <td className="border px-6 py-4 text-xs">{order.phone}</td>
                    <td className="border px-6 py-4 text-xs">{order.address.city}, {order.address.street}</td>
                    <td className="border px-6 py-4 text-xs">{order.totalPrice} USD</td>

                    {/* ✅ Editable Fields */}
                    <td className="border px-6 py-4 text-xs">
                      <select
                        value={editingOrder === order._id ? updatedValues.isPaid ?? order.isPaid : order.isPaid}
                        onChange={(e) => handleChange("isPaid", e.target.value === "true")}
                        disabled={editingOrder !== order._id}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>

                    <td className="border px-6 py-4 text-xs">
                      <select
                        value={editingOrder === order._id ? updatedValues.isDelivered ?? order.isDelivered : order.isDelivered}
                        onChange={(e) => handleChange("isDelivered", e.target.value === "true")}
                        disabled={editingOrder !== order._id}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>

                    <td className="border px-6 py-4 text-xs">
                      <input
                        type="number"
                        value={editingOrder === order._id ? updatedValues.completionPercentage ?? order.completionPercentage : order.completionPercentage}
                        onChange={(e) => handleChange("completionPercentage", parseInt(e.target.value))}
                        disabled={editingOrder !== order._id}
                        className="w-16 border px-2 py-1"
                      />
                    </td>

                    <td className="border px-6 py-4 text-xs flex flex-col space-y-2">
  <button
    onClick={() => setEditingOrder(order._id)}
    className="font-medium bg-yellow-500 py-2 px-4 rounded-full text-white text-sm hover:bg-yellow-600 transition"
  >
    Edit
  </button>

  <button
    onClick={() => handleEdit(order._id)}
    className="font-medium bg-blue-500 py-2 px-4 rounded-full text-white text-sm hover:bg-blue-600 transition"
  >
    Save
  </button>

  

  <button
    onClick={() => handleSendNotification(order._id, order.email, order.name, order.completionPercentage)}
    className="font-medium bg-green-500 py-2 px-4 rounded-full text-white text-sm hover:bg-green-600 transition"
  >
    Send Notification
  </button>
</td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOrdersList;