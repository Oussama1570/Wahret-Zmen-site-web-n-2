import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import { getImgUrl } from '../../../utils/getImgUrl';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
                <p className="text-gray-700 mb-6">Welcome, {currentUser?.name || 'User'}! Here are your recent orders:</p>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <ul className="space-y-4">
                            {orders.map((order) => (
                                <li key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2">
                                    <p className="font-medium">Order ID: {order._id}</p>
                                    <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                                    <p>Total: ${order.totalPrice}</p>
                                    <h3 className="font-semibold mt-2">Products:</h3>
                                    <ul>
                                        {order.products.map((product) => {
                                            if (!product.productId) return null; // Avoid errors when productId is missing

                                            return (
                                                <li key={product.productId._id} className="flex items-center gap-4 border-b py-2">
                                                    {/* ✅ Ensure coverImage exists before accessing */}
                                                    <img 
                                                        src={product.productId.coverImage ? getImgUrl(product.productId.coverImage) : "/default-image.jpg"} 
                                                        alt="Product Image" 
                                                        className="w-16 h-16 object-cover rounded" 
                                                    />
                                                    <div>
                                                        <p className="font-medium">Product ID: {product.productId._id}</p>
                                                        <p>Product Name: {product.productId.title || "No Title"}</p>
                                                        <p>Qty: {product.quantity}</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no recent orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
